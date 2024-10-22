import { Router } from 'express';
import { loginUser, registerUser } from '../../controllers/auth-controller/index.js';
import { authenticate } from '../../middlewares/auth-middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// check if the user is authenticated
router.get('/check-auth', authenticate, (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated!',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Authenticated user!',
        data: {
            user: req.user, // Return user data from the request
        },
    });
});

export default router;