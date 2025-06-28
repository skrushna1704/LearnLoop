import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';
import { googleAuth, getGoogleAuthUrl } from '../controllers/googleAuthController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password', asyncHandler(resetPassword));

// Google OAuth routes
router.post('/google', asyncHandler(googleAuth));
router.get('/google/url', asyncHandler(getGoogleAuthUrl));

export default router; 