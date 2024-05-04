import Router from 'express'
import { incomingRequest } from '../worker/dataHandler';
import { validateIncomingRequest } from '../middleware/validateRequest';
import { PathNotFound, errHandler } from '../middleware/errHandler';

export const router = Router();
router.use('/shopping-cart/:token?', validateIncomingRequest, incomingRequest)
router.use(PathNotFound);
router.use(errHandler)
