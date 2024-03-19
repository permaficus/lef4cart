import express, { Express } from 'express'
import cors from 'cors'
import {
    SERVICE_LOCAL_PORT,
    NODE_ENV
} from "../constant/config"
import { router as v1 } from "../v1/router/router"

const httpServer: Express = express()

const httpServerInit = async () => {
    httpServer.use(express.urlencoded({ extended: true }))
    httpServer.use(express.json())
    httpServer.use(cors())
    httpServer.use('/v1', v1)
}

export { httpServerInit, httpServer, SERVICE_LOCAL_PORT, NODE_ENV }