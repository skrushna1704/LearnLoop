import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { googleAuth, getGoogleAuthUrl } from '../controllers/googleAuthController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

// Google OAuth routes
router.post('/google', asyncHandler(googleAuth));
router.get('/google/url', asyncHandler(getGoogleAuthUrl));

export default router; 