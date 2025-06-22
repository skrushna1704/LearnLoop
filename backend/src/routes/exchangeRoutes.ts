import { Router } from 'express';
import * as exchangeController from '../controllers/exchangeController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// @route   GET api/exchanges
// @desc    Get all exchanges for a user
// @access  Private
router.get('/', authenticate, asyncHandler(exchangeController.getExchanges));

// @route   POST api/exchanges
// @desc    Create a new exchange
// @access  Private
router.post('/', authenticate, asyncHandler(exchangeController.createExchange));

// @route   GET api/exchanges/:id
// @desc    Get exchange by ID
// @access  Private
router.get('/:id', authenticate, asyncHandler(exchangeController.getExchangeById));

// @route   PUT api/exchanges/:id/status
// @desc    Update exchange status
// @access  Private
router.put('/:id/status', authenticate, asyncHandler(exchangeController.updateExchangeStatus));

export default router; 