import express from 'express';

import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  registerUser,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

export default router;
