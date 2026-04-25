import express from 'express';
import { getUsers, updateProfile } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { upload } from '../lib/cloudinary.js';

const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.patch('/profile', authenticateToken, (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary error:', err.message, err.stack);
            return res.status(500).json({ message: err.message });
        }
        next();
    });
}, updateProfile);

export default router;