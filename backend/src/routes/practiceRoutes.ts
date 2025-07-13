import { Router } from 'express';
import { 
  getCategories, 
  getQuestions, 
  startSession, 
  submitAnswer, 
  completeSession, 
  getUserProgress, 
  getLeaderboard, 
  runCode 
} from '../controllers/practiceController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get available categories and difficulties
router.get('/categories', authenticate, getCategories);

// Get questions for practice
router.get('/questions', authenticate, getQuestions);

// Start a practice session
router.post('/session', authenticate, startSession);

// Submit answer for a question
router.post('/session/:sessionId/answer', authenticate, submitAnswer);

// Complete practice session
router.post('/session/:sessionId/complete', authenticate, completeSession);

// Get user progress
router.get('/progress', authenticate, getUserProgress);

// Get leaderboard
router.get('/leaderboard', authenticate, getLeaderboard);

router.post('/compile', authenticate, runCode);

export default router; 