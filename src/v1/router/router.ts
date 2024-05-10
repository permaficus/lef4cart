import Router from 'express'
import { incomingRequest } from '@/v1/worker/dataHandler';
import { validateIncomingRequest } from '@/v1/middleware/validateRequest';
import { PathNotFound, errHandler } from '@/v1/middleware/errHandler';

export const router = Router();
router.use('/shopping-cart/:token?', validateIncomingRequest, incomingRequest)
router.use(PathNotFound);
router.use(errHandler)
