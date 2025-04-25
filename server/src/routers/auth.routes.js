import express from 'express';
import { register, login, verifyEmail, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/current', authenticateToken, getCurrentUser);
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);

export default router;