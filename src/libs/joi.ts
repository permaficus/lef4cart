import Joi from 'joi'

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'MQTT';

const validator = async (schema: any, payload: any) => {
    return await schema.validateAsync(payload, {
        abortEarly: true,
        allowUnknow: false
    })
}
const _template_ = (method: RequestMethod): any => {
    return {
        task: Joi.string().required().valid(
            'create',
            'read',
            'delete',
            'update').required().label('Task'),
        payload: Joi.object({
            user_id: Joi.string().label('User ID').required().messages({
                'string.empty': 'User ID must have a value'
            }),
            ...['POST', 'PATCH'].includes(method) && { product_id: Joi.string().label('Producdt ID').required().messages({
                'string.empty': 'Product ID cannot be an empty value'
            })},
            ...['POST'].includes(method) && { product_name: Joi.string().label('Product Name').required().messages({
                'string.empty': 'Product Name cannot be an empty value'
            })},
            ...['POST'].includes(method) && { product_image: Joi.string().label('Product Image').required().messages({
                'string.empty': 'Product Image cannot be an empty value'
            })},
            ...['POST'].includes(method) && { price: Joi.number().min(1).label('Price').required().messages({
                'number.base': 'Price must be a number value'
            })},
            ...['POST', 'PATCH'].includes(method) && { quantity: Joi.number().min(1).label('Quantity').required().messages({
                'number.base': 'Quantity must be a number value'
            })},
            ...['PATCH'].includes(method) && { params: Joi.string().valid('increment', 'decrement').required() },
            apps_id: Joi.string().allow(''),
            merchant_id: Joi.string().allow(''),
            merchant_name: Joi.string().allow(''),
            session_id: Joi.string().allow(''),
        }).required().label('Payload'),
        ...method == 'MQTT' && { origin: Joi.object({
            queue: Joi.string().required().label('Queue'),
            routingKey: Joi.string().required().label('RoutingKey')
        }).required().label('Origin') }
    }
}
export const validateSchema = async (payload: any, method: RequestMethod) => {
    let selectedSchema: any = {}
    for (let props in payload) {
        if (_template_(method).hasOwnProperty(props)) {
            selectedSchema[props] = _template_(method)[props]
        }
    }
    let schema = Joi.object(selectedSchema)
    return await validator(schema, payload)
}