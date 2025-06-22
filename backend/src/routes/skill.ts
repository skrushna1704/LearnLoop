import { Router } from 'express';
import { createSkill, getAllSkills, getSkillById, updateSkill, deleteSkill, addTeacher, addLearner } from '../controllers/skillController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected routes (require authentication)
router.post('/', authenticate, createSkill as any);

// Public routes
router.get('/', getAllSkills);
router.get('/:skillId', getSkillById as any);
router.put('/:skillId', updateSkill as any);
router.delete('/:skillId', deleteSkill as any);
router.put('/:skillId/teach', authenticate, addTeacher as any);
router.put('/:skillId/learn', authenticate, addLearner as any);

export default router; 