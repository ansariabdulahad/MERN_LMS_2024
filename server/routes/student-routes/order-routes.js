import { Router } from 'express';
import { capturePaymentAndFinalizeOrder, createOrder } from '../../controllers/student-controller/order-controller.js';

const router = Router();

router.post('/create', createOrder);
router.post('/capture', capturePaymentAndFinalizeOrder);

export default router;