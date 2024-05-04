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
        const { meta } = error;
        throw new PrismaError(meta?.cause, 400);
    }

    throw new PrismaError('We have a slight problem with our backend. Please try again later', 500)
}