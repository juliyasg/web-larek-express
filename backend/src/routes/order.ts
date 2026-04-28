import { Router } from 'express';
import createOrder from '../controllers/order';

import {
  validateOrderBody,
} from '../middlewares/validations';

const router = Router();

router.post('/order', validateOrderBody, createOrder);

export default router;
