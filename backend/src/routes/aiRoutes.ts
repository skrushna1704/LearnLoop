import { Router } from 'express';
import { getChatCompletion, getDashboardSuggestions } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';
// import { authenticate } from '../middleware/auth'; // Can be added later

const router = Router();

// @route   POST /api/ai/chat
// @desc    Send a message to the AI chatbot and get a response
// @access  Public
router.post('/chat', getChatCompletion);

// @route   GET /api/ai/suggestions
// @desc    Get AI-powered suggestions for the user's dashboard
// @access  Private
router.get('/suggestions', authenticate, getDashboardSuggestions);

export default router; 