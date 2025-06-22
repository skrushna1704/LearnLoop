import { Router } from 'express';
import { getAllUsers, getUserSkills } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllUsers);
router.get('/:userId/skills', authenticate, getUserSkills);

export default router; 