import { Router } from 'express';
import { getMessagesByExchange, sendMessage, clearChat } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all messages for a specific exchange
router.get('/:exchangeId', authenticate, getMessagesByExchange);

// Send a new message
router.post('/', authenticate, sendMessage);

// Clear all messages for a specific exchange
router.delete('/:exchangeId', authenticate, clearChat);

export default router; 