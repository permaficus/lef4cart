import express, { Express, Router } from 'express'
import cors from 'cors'
import {
    SERVICE_LOCAL_PORT,
    NODE_ENV,
    allowedOrigin
} from "../constant/config"
import { router as v1 } from "../v1/router/router"

const httpServer: Express = express()
const httpServerInit = async () => {
    httpServer.use(express.urlencoded({ extended: true }))
    httpServer.use(express.json())
    httpServer.use(cors({
        ...allowedOrigin.length !== 0 ? { origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (!allowedOrigin.includes(origin)) {
                const error = new Error(`Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at ${origin}.`);
                delete error.stack
                return callback(error, false)
            }
            return callback(null, true)
        }} : {}
    }))
    httpServer.use('/v1', v1)
}

export { httpServerInit, httpServer, SERVICE_LOCAL_PORT, NODE_ENV }