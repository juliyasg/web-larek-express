import { Router } from 'express';
import {
  getProducts,
  createProduct,
} from '../controllers/products';

import {
  validateProductBody,
} from '../middlewares/validations';

const router = Router();

router.get('/product', getProducts);
router.post('/product', validateProductBody, createProduct);

export default router;
