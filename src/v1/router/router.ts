import Router from 'express'
import { incomingRequest } from '../worker/dataHandler';

export const router = Router();

router.get('/shopping-cart', incomingRequest)

