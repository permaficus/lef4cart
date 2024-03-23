import Joi from 'joi'

const validator = async (schema: any, payload: any) => {
    return await schema.validateAsync(payload, {
        abortEarly: true,
        allowUnknow: false
    })
}
const _template_: any = {
    task: Joi.string().required().valid(
        'create',
        'read',
        'delete',
        'update'),
    payload: Joi.object({
        user_id: Joi.string().required().messages({
            'string.empty': 'User ID must have a value'
        }),
        product_id: Joi.string().required().messages({
            'string.empty': 'Product ID cannot be an empty value'
        }),
        product_name: Joi.string().required().messages({
            'string.empty': 'Product Name cannot be an empty value'
        }),
        product_image: Joi.string().required().messages({
            'string.empty': 'Product Image cannot be an empty value'
        }),
        price: Joi.number().min(1).required().messages({
            'number.base': 'Price must be a number value'
        }),
        quantity: Joi.number().min(1).required().messages({
            'number.base': 'Quantity must be a number value'
        }),
        apps_id: Joi.string().allow(''),
        merchant_id: Joi.string().allow(''),
        merchant_name: Joi.string().allow(''),
        session_id: Joi.string().allow(''),
    })
}
export const validateSchema = async (payload: any) => {
    let selectedSchema: any = {}
    for (let props in payload) {
        if (_template_.hasOwnProperty(props)) {
            selectedSchema[props] = _template_[props] 
        }
    }
    let schema = Joi.object(selectedSchema)
    return await validator(schema, payload)
}