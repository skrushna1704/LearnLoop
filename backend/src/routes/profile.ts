import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile as any);

export default router; 