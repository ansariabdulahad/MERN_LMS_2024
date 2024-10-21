import { Router } from 'express';
import { registerUser } from '../../controllers/auth-controller/index.js';

const router = Router();

router.post('/register', registerUser);

export default router;