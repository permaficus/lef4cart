import { PrismaClient, Prisma } from '@prisma/client';

export const DB = new PrismaClient();

class PrismaError extends Error {
    statusCode: number

    constructor(message: any, statusCode: number) {
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.name = this.constructor.prototype

        Object.setPrototypeOf(this, PrismaError.prototype)
    }
}

export const prismaErrHandler = (error: any) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const { meta, code } = error;
        // @ts-ignore
        if (code === 'P2010' && /(kind\: I\/O error)|(connection refused)/gi.test(meta?.message)) {
            throw new PrismaError('We have trouble connecting to our database server, Please try again later', 500);
        }
        throw new PrismaError(meta?.cause, 400);
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
        throw new PrismaError('We have trouble connecting to our database server, Please try again later', 500);
    }
    throw new PrismaError('We have a slight problem with our backend. Please try again later', 500)
}