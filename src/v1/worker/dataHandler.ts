import { Cart } from '../../model/cart.model';
import { Request, Response } from 'express';
import { publishMessage } from '../producer/producer';
import { validateRequest } from '../middleware/validateRequest';

interface MessageOrigin {
    queue: string
    routingKey: string
}
interface Protocols {
    overHttp?: {
        state?: boolean
        request?: Request,
        response?: Response
    }
    useMqtt?: boolean
}
type Task = 'read' | 'create' | 'update' | 'delete' | null;
const taskToMethod = (task: Task) => {
    return {
        ...task == 'create' && { method: 'MQTT-POST' },
        ...task == 'update' && { method: 'MQTT-PATCH' },
        ...task == 'delete' && { method: 'MQTT-DELETE'}
    }?.method
}
export const handlingData = async (task: Task, payload: any, origin?: MessageOrigin, proto?: Protocols) => {
    try {
        /** start to validate payload */
        if (proto?.useMqtt) {
            const requireBody = { 
                task,
                payload,
                ...proto?.useMqtt && { origin }
            }
            await validateRequest(requireBody, taskToMethod(task))
        }
        /** ----------------------------------------------------------------- */
        if (proto?.overHttp?.state && proto?.overHttp.request?.method === 'GET') {
            const { request } = proto?.overHttp;
            task = 'read'
            payload = {
                userId: request.params.token
            }
        }
        if (task == 'create') {
            const count = await Cart.checkDuplicate(payload);
            if (count > 0) {
                task = 'update'
                Object.assign(payload, { params: 'increment' })
            }
        }
        const taskMapping: any = {
            ...task == 'create' && { exec: await Cart.push({ ...payload }) },
            ...task == 'read' && { exec: await Cart.read(payload.userId) },
            ...task == 'update' && { exec: await Cart.update({ ...payload }) },
            ...task == 'delete' && { exec: await Cart.remove(payload.cartId) }
        }
        const response = taskMapping.exec
        if (proto?.useMqtt) {
            await publishMessage({
                message: response,
                replyQueue: origin?.queue,
                replyRoutingKey: origin?.routingKey
            })
        }
        if (proto?.overHttp?.state) {
            proto.overHttp?.response?.status(200).json({
                status: 'OK',
                code: 200,
                data: response.data || response.details || response.document || response
            })
        }
    } catch (error: any) {
        if (proto?.useMqtt) {
            await publishMessage({
                message: {
                    status: 'ERROR_BAD_REQUEST',
                    code: 400,
                    details: JSON.parse(error.message)['details'] || error.message
                },
                replyQueue: origin?.queue,
                replyRoutingKey: origin?.routingKey
            });
            throw new Error(error.message);
        };

        proto?.overHttp?.response?.status(400).json({
            status: 'ERROR_BAD_REQUEST',
            code: 400,
            details: error.message
        }).end();
    }
}
export const incomingRequest = async (req: Request, res: Response) => {
    await handlingData(req.body.task, req.body.payload, undefined, { overHttp: { state: true, request: req, response: res}})
}