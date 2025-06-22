import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  getComments,
  getTrendingPosts,
  getSuggestedMembers,
  getTrendingSkills,
  getCommunityStats
} from '../controllers/postController';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/trending', getTrendingPosts);
router.get('/trending-skills', getTrendingSkills);
router.get('/stats', getCommunityStats);
router.get('/:postId/comments', getComments);

// Protected routes
router.post('/', authenticate, createPost);
router.put('/:postId/like', authenticate, toggleLike);
router.post('/:postId/comment', authenticate, addComment);
router.get('/suggested-members', authenticate, getSuggestedMembers);

export default router; 