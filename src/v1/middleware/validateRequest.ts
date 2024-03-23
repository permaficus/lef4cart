import { validateSchema } from "../../libs/joi";
import { NextFunction, Request, Response } from "express";

export const validateRequest = async (schema: any) => {
    try {
        await validateSchema(schema)
    } catch (error: any) {
        throw new Error(JSON.stringify({
            status: 'ERROR_BAD_REQUEST',
            code: 400,
            details: error.details[0].message.replace(/"/g, '')
        }))
    }
}
export const validateIncomingRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await validateRequest(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({
            status: 'ERROR_BAD_REQUEST',
            code: 400,
            details: JSON.parse(error.message)['details']}).end();
    }
}