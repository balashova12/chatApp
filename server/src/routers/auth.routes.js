import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/current", authenticateToken, getCurrentUser);
router.post('/register', register);
router.post('/login', login);

export default router;