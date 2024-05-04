import { Request, Response, NextFunction } from "express";

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
export const PathNotFound = async (req: Request, res: Response, next: NextFunction) => {
    res.status(404);
    next(new Error(`Path Not Found - ${req.originalUrl}`));
}
export const errHandler = async (err: any, req: Request, res: Response, next: NextFunction ) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
    res.status(statusCode).json({
        status: statusCode == 400 ? 'ERR_BAD_REQUEST' : 'ERR_BAD_SERVICE',
        code: statusCode,
        details: err.message
    }).end();
}