import express from 'express';
import { createOrGetChat, getChats } from '../controllers/chat.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getChats);
router.post('/', authenticateToken, createOrGetChat);

export default router;