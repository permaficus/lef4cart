import Joi from 'joi'

const validator = async (schema: any, payload: any) => {
    return await schema.validateAsync(payload, {
        abortEarly: true,
        allowUnknow: false
    })
}
// const _template_: any = {
    
// }
// export const validateSchema = async (body: any) => {
//     let selectedSchema = {}
//     for (let props in body) {
//         selectedSchema = { 
//             ..._template_.hasOwnProperty(props) && { [props]: _template_[props] }
//         }
//     }
//     let schema = Joi.object(selectedSchema)
//     return await validator(schema, body)
// }