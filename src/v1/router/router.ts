import Router from 'express'
import { incomingRequest } from '../worker/dataHandler';
import { validateIncomingRequest } from '../middleware/validateRequest';

export const router = Router();
router.use('/shopping-cart/:token?', validateIncomingRequest, incomingRequest)
