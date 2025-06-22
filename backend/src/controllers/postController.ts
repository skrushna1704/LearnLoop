import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Post, { IPost } from '../models/Post';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';

// Get all posts with filters
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const { 
    type, 
    search, 
    tags, 
    featured, 
    limit = 10, 
    page = 1 
  } = req.query;

  let query: any = {};

  // Filter by post type
  if (type && type !== 'all') {
    query.type = type;
  }

  // Search in content
  if (search) {
    query.$or = [
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }

  // Filter by tags
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    query.tags = { $in: tagArray };
  }

  // Filter featured posts
  if (featured === 'true') {
    query.featured = true;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const posts = await Post.find(query)
    .populate('author', 'profile.name profile.profilePicture profile.location profile.role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  // Format posts with time ago
  const formattedPosts = posts.map(post => ({
    ...post.toObject(),
    time: getTimeAgo(post.createdAt)
  }));

  const total = await Post.countDocuments(query);

  res.json({
    posts: formattedPosts,
    pagination: {
      current: Number(page),
      total: Math.ceil(total / Number(limit)),
      hasMore: skip + posts.length < total
    }
  });
});

// Create new post
export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const postData = {
    ...req.body,
    author: user._id
  };

  const post = await Post.create(postData);
  const populatedPost = await Post.findById(post._id)
    .populate('author', 'profile.name profile.profilePicture profile.location profile.role');

  res.status(201).json(populatedPost);
});

// Like/unlike post
export const toggleLike = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { postId } = req.params;
  const post = await Post.findById(postId);
  
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check if user already liked the post
  const userLiked = (post as any).likes?.includes(user._id);
  
  if (userLiked) {
    // Unlike
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
      $inc: { 'engagement.likes': -1 }
    });
  } else {
    // Like
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: user._id },
      $inc: { 'engagement.likes': 1 }
    });
  }

  const updatedPost = await Post.findById(postId)
    .populate('author', 'profile.name profile.profilePicture profile.location profile.role');

  res.json({
    liked: !userLiked,
    engagement: updatedPost?.engagement
  });
});

// Add comment to post
export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { postId } = req.params;
  const { content } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Add comment and increment comment count
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: { user: user._id, content, createdAt: new Date() } },
    $inc: { 'engagement.comments': 1 }
  });

  res.json({ message: 'Comment added successfully' });
});

// Get comments for a post
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .populate('comments.user', 'profile.name profile.profilePicture');

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post.comments);
});

// Get trending posts
export const getTrendingPosts = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 5 } = req.query;

  const posts = await Post.aggregate([
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ['$engagement.likes', 2] },
            { $multiply: ['$engagement.comments', 3] },
            { $multiply: ['$engagement.shares', 1] },
            { $multiply: ['$engagement.views', 0.1] }
          ]
        }
      }
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: Number(limit) }
  ]);

  // Populate author information
  const populatedPosts = await Post.populate(posts, {
    path: 'author',
    select: 'profile.name profile.profilePicture profile.location profile.role'
  });

  res.json(populatedPosts);
});

// Get suggested members for current user
export const getSuggestedMembers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get users with complementary skills
  const suggestedUsers = await User.aggregate([
    {
      $match: {
        _id: { $ne: user._id },
        'skills_offered.0': { $exists: true }
      }
    },
    {
      $addFields: {
        matchScore: {
          $add: [
            // Skill compatibility score
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: [
                      '$skills_offered.skillId',
                      user.skills_needed?.map((s: any) => s.skillId) || []
                    ]
                  }
                },
                20
              ]
            },
            // Rating score
            { $multiply: ['$rating.average', 10] },
            // Experience score
            { $multiply: [{ $size: '$skills_offered' }, 5] }
          ]
        }
      }
    },
    { $sort: { matchScore: -1 } },
    { $limit: 5 }
  ]);

  // Populate skills information
  const populatedUsers = await User.populate(suggestedUsers, [
    {
      path: 'skills_offered.skillId',
      select: 'name category level'
    },
    {
      path: 'skills_needed.skillId',
      select: 'name category level'
    }
  ]);

  res.json(populatedUsers);
});

// Get trending skills
export const getTrendingSkills = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;

  const trendingSkills = await Post.aggregate([
    {
      $unwind: '$tags'
    },
    {
      $group: {
        _id: '$tags',
        posts: { $sum: 1 },
        growth: { $avg: '$engagement.likes' }
      }
    },
    {
      $addFields: {
        tag: '#' + '$_id',
        growth: { $concat: ['+', { $toString: { $round: '$growth' } }, '%'] }
      }
    },
    { $sort: { posts: -1 } },
    { $limit: Number(limit) }
  ]);

  res.json(trendingSkills);
});

// Get community statistics
export const getCommunityStats = asyncHandler(async (req: Request, res: Response) => {
  const [totalUsers, totalPosts, activeUsers] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    User.countDocuments({ updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
  ]);

  res.json({
    totalUsers,
    totalPosts,
    totalExchanges: 0, // Placeholder - would need Exchange model
    activeUsers,
    skillsAvailable: 156, // This could be calculated from skills collection
    exchangesThisMonth: 1234 // This could be calculated from exchanges collection
  });
});

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
} 