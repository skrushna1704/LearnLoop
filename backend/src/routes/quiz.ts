import express from 'express';
import {
  getQuizCategories,
  getQuizQuestions,
  startQuizSession,
  getQuizSession,
  submitQuizAnswer,
  completeQuizSession,
  getQuizProgress,
  getQuizLeaderboard
} from '../controllers/quizController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes protected
router.use(authenticate);

router.get('/categories', getQuizCategories);
router.get('/questions', getQuizQuestions);
router.post('/session', startQuizSession);
router.get('/session/:sessionId', getQuizSession);
router.post('/session/:sessionId/answer', submitQuizAnswer);
router.post('/session/:sessionId/complete', completeQuizSession);
router.get('/progress', getQuizProgress);
router.get('/leaderboard', getQuizLeaderboard);

export default router; 