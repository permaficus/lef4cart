import { Cart } from '../../model/cart.model';
import { Request, Response } from 'express';
import { publishMessage } from '../producer/producer';

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
type Task = 'read' | 'create' | 'update' | 'delete'

export const handlingData = async (task: Task, payload: any, origin?: MessageOrigin, proto?: Protocols) => {
    try {
        const taskMapping: any = {
            ...task == 'create' && { exec: await Cart.push(payload) },
            ...task == 'read' && { exec: await Cart.read(payload.userId) },
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
                data: response.data || response.details
            })
        }
    } catch (error: any) {
        if (proto?.useMqtt) {
            await publishMessage({
                message: {
                    status: 'ERROR',
                    code: 400,
                    details: error.message
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
        })
    }
}
export const incomingRequest = async (req: Request, res: Response) => {
    await handlingData(req.body.task, req.body.payload, undefined, { overHttp: { state: true, request: req, response: res}})
}