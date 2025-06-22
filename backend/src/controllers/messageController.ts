import { Request, Response } from 'express';
import Message from '../models/Message';
import Exchange from '../models/Exchange';
import { asyncHandler } from '../utils/asyncHandler';
import { io } from '../app';

// @desc    Get all messages for an exchange
// @route   GET /api/messages/:exchangeId
export const getMessagesByExchange = asyncHandler(async (req: Request, res: Response) => {
  const { exchangeId } = req.params;
  const userId = (req as any).user.id;

  const exchange = await Exchange.findById(exchangeId);
  if (!exchange) {
    res.status(404);
    throw new Error('Exchange not found');
  }

  const userInExchange = exchange.users.find(u => u.user.toString() === userId);
  const clearedAt = userInExchange?.chatClearedAt;

  const query: any = { exchangeId };
  if (clearedAt) {
    query.createdAt = { $gt: clearedAt };
  }
  
  const messages = await Message.find(query)
    .populate('senderId', 'profile.name profile.profilePicture')
    .sort({ createdAt: 'asc' });
    
  res.json(messages);
});

// @desc    Send a new message
// @route   POST /api/messages
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { exchangeId, receiverId, content } = req.body;
  const senderId = (req as any).user.id;

  if (!content) {
    res.status(400);
    throw new Error('Message content cannot be empty');
  }

  const newMessage = new Message({
    exchangeId,
    senderId,
    receiverId,
    content,
  });

  const savedMessage = await newMessage.save();
  await savedMessage.populate('senderId', 'profile.name profile.profilePicture');
  
  // Emit the new message to the specific exchange room
  io.to(exchangeId).emit('newMessage', savedMessage);

  res.status(201).json(savedMessage);
});

// @desc    Clear all messages for an exchange for the current user
// @route   DELETE /api/messages/:exchangeId
export const clearChat = asyncHandler(async (req: Request, res: Response) => {
  const { exchangeId } = req.params;
  const userId = (req as any).user.id;

  const exchange = await Exchange.findById(exchangeId);
  if (!exchange) {
    res.status(404);
    throw new Error('Exchange not found');
  }

  const userIndex = exchange.users.findIndex(u => u.user.toString() === userId);
  if (userIndex === -1) {
    res.status(403);
    throw new Error('User not authorized for this action');
  }

  exchange.users[userIndex].chatClearedAt = new Date();
  await exchange.save();

  // Emit an event with the exchangeId to notify the client to clear their chat
  io.to(exchangeId).emit('chatCleared', { exchangeId });
  
  res.status(200).json({ message: 'Chat history cleared successfully for the user.' });
}); 