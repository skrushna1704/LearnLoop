import { apiClient } from '../api-client';

export interface Post {
  _id: string;
  author: {
    _id: string;
    profile: {
      name: string;
      profilePicture?: string;
      location?: string;
      role?: string;
    };
  };
  type: 'success_story' | 'skill_offer' | 'learning_request';
  content: string;
  skillsExchanged?: {
    taught: string;
    learned: string;
  };
  skillOffered?: string;
  skillSeeking?: string;
  sessions?: number;
  duration?: string;
  image?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  tags: string[];
  featured: boolean;
  urgent: boolean;
  time: string;
  createdAt: string;
}

export interface CreatePostData {
  type: 'success_story' | 'skill_offer' | 'learning_request';
  content: string;
  skillsExchanged?: {
    taught: string;
    learned: string;
  };
  skillOffered?: string;
  skillSeeking?: string;
  sessions?: number;
  duration?: string;
  image?: string;
  tags: string[];
  featured?: boolean;
  urgent?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    current: number;
    total: number;
    hasMore: boolean;
  };
}

export interface SuggestedMember {
  _id: string;
  profile: {
    name: string;
    profilePicture?: string;
    location?: string;
  };
  skills_offered: Array<{
    skillId: {
      name: string;
      category: string;
      level: string;
    };
  }>;
  skills_needed: Array<{
    skillId: {
      name: string;
      category: string;
      level: string;
    };
  }>;
  rating: {
    average: number;
    count: number;
  };
  matchScore: number;
}

export interface TrendingSkill {
  tag: string;
  posts: number;
  growth: string;
}

export interface CommunityStats {
  totalUsers: number;
  totalPosts: number;
  totalExchanges: number;
  activeUsers: number;
  skillsAvailable: number;
  exchangesThisMonth: number;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    profile: {
      name: string;
      profilePicture?: string;
    }
  };
  content: string;
  createdAt: string;
}

export interface LikeResponse {
  liked: boolean;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

// Get all posts with filters
export const getPosts = async (params?: {
  type?: string;
  search?: string;
  tags?: string[];
  featured?: boolean;
  limit?: number;
  page?: number;
}): Promise<PostsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params?.type) searchParams.append('type', params.type);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.tags) params.tags.forEach(tag => searchParams.append('tags', tag));
  if (params?.featured) searchParams.append('featured', 'true');
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.page) searchParams.append('page', params.page.toString());

  const response = await apiClient.get(`/posts?${searchParams.toString()}`);
  return response.data;
};

// Create new post
export const createPost = async (postData: CreatePostData): Promise<Post> => {
  const response = await apiClient.post('/posts', postData);
  return response.data;
};

// Like/unlike post
export const toggleLike = async (postId: string): Promise<LikeResponse> => {
  const response = await apiClient.put(`/posts/${postId}/like`);
  return response.data;
};

// Add comment to post
export const addComment = async (postId: string, content: string): Promise<{ message: string }> => {
  const response = await apiClient.post(`/posts/${postId}/comment`, { content });
  return response.data;
};

// Get comments for a post
export const getComments = async (postId: string): Promise<Comment[]> => {
  const response = await apiClient.get(`/posts/${postId}/comments`);
  return response.data;
};

// Get trending posts
export const getTrendingPosts = async (limit: number = 5): Promise<Post[]> => {
  const response = await apiClient.get(`/posts/trending?limit=${limit}`);
  return response.data;
};

// Get suggested members
export const getSuggestedMembers = async (): Promise<SuggestedMember[]> => {
  const response = await apiClient.get('/posts/suggested-members');
  return response.data;
};

// Get trending skills
export const getTrendingSkills = async (limit: number = 10): Promise<TrendingSkill[]> => {
  const response = await apiClient.get(`/posts/trending-skills?limit=${limit}`);
  return response.data;
};

// Get community statistics
export const getCommunityStats = async (): Promise<CommunityStats> => {
  const response = await apiClient.get('/posts/stats');
  return response.data;
}; 