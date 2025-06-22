'use client';

import React, { useState, useEffect } from 'react';
import { Post, Comment, addComment, getComments } from '@/lib/api/posts';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Award,
  Lightbulb,
  Target,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  isLiked: boolean;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, isLiked, onLike, onShare }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchComments = async () => {
      if (isCommentOpen && comments.length === 0) {
        setIsLoadingComments(true);
        try {
          const fetchedComments = await getComments(post._id);
          setComments(fetchedComments);
        } catch (error) {
          console.error('Failed to fetch comments:', error);
          toast.error('Could not load comments.');
        } finally {
          setIsLoadingComments(false);
        }
      }
    };
    fetchComments();
  }, [isCommentOpen, post._id, comments.length]);

  const handleCommentSubmit = async () => {
    console.log('Attempting to submit comment...');
    console.log('User object:', user);
    console.log('Comment text:', comment);

    if (!comment.trim() || !user) {
      console.error('Submission failed: User not logged in or comment is empty.');
      return;
    }

    const commentToSubmit = comment;
    const newComment: Comment = {
      _id: new Date().toISOString(),
      user: {
        _id: user.id,
        profile: {
          name: user.profile?.name || 'Anonymous',
          profilePicture: user.profile?.profilePicture,
        }
      },
      content: commentToSubmit,
      createdAt: new Date().toISOString(),
    };
    
    console.log('Submitting new comment:', newComment);
    
    // Perform state updates together
    setComments(prev => [...prev, newComment]);
    setComment('');
    
    try {
      await addComment(post._id, commentToSubmit);
      toast.success('Comment added!');
      console.log('Comment successfully posted to API.');
    } catch (error) {
      toast.error('Failed to add comment.');
      setComments(prev => prev.filter(c => c._id !== newComment._id));
      console.error('Error adding comment:', error);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'success_story':
        return <Award className="w-4 h-4 text-green-500" />;
      case 'skill_offer':
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'learning_request':
        return <Target className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const authorName = post.author.profile?.name || 'Anonymous';
  const authorProfilePicture = post.author.profile?.profilePicture;

  return (
    <Card className="mb-6 bg-white rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar 
          src={authorProfilePicture} 
          fallback={authorName.charAt(0)}
          alt={authorName}
        />
        <div>
          <p className="font-semibold">{authorName}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex-grow" />
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          {getPostTypeIcon(post.type)}
          <p className="font-semibold capitalize">
            {post.type.replace('_', ' ')}
          </p>
        </div>
        <p>{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post image"
            className="mt-4 rounded-lg w-full"
          />
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch px-6 pb-4">
        <div className="flex justify-between items-center py-2 border-t border-gray-100">
          <div className="flex space-x-1">
            <Button variant="ghost" onClick={() => onLike(post._id)} className="rounded-full">
              <Heart 
                className={`w-5 h-5 mr-2 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} 
              />
              <span className="text-gray-600 font-semibold">{post.engagement.likes}</span>
            </Button>
            <Button variant="ghost" onClick={() => setIsCommentOpen(!isCommentOpen)} className="rounded-full">
              <MessageCircle className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-600 font-semibold">{post.engagement.comments}</span>
            </Button>
            <Button variant="ghost" onClick={() => onShare(post._id)} className="rounded-full">
              <Share2 className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          <Button variant="ghost" className="rounded-full">
            <Bookmark className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        
        {isCommentOpen && (
          <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
            {isLoadingComments ? (
              <div className="text-center py-4">
                <p>Loading comments...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map(c => {
                  if (!c.user?.profile) return null;

                  return (
                    <div key={c._id} className="flex items-start space-x-3">
                      <Avatar 
                        src={c.user.profile.profilePicture}
                        fallback={c.user.profile.name.charAt(0)}
                        alt={c.user.profile.name}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <p className="font-semibold text-sm text-gray-800">{c.user.profile.name}</p>
                          <p className="text-sm text-gray-600">{c.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 pl-1">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="flex items-start space-x-3 pt-4">
              <Avatar 
                  src={user?.profile?.profilePicture}
                  fallback={user?.profile?.name?.charAt(0) || '?'}
                  alt={user?.profile?.name || 'You'}
                  size="sm"
              />
              <div className="flex-1">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a public comment..."
                  className="mb-2 bg-gray-50 border-gray-200 rounded-lg"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCommentSubmit} 
                    size="sm"
                    disabled={!comment.trim()}
                    className="rounded-full"
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard; 