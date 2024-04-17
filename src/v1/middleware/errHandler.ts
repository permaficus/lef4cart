import { Request, Response } from "express";

export const badRequest = async ( err: any, req: Request, res: Response ) => {
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).send({
            status: 'ERR_BAD_REQUEST',
            code: res.statusCode,
            details: `Oops..there is something wrong with your request`
        }).end();
        return;
    }
}