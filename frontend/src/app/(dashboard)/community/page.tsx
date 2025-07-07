'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { 
  Search, 
  Users,
  Star,
  Plus,
  TrendingUp,
  BookOpen,
  Target,
  Zap,
  Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  getPosts, 
  getSuggestedMembers, 
  getTrendingSkills, 
  getCommunityStats,
  toggleLike,
  type Post,
  type SuggestedMember,
  type TrendingSkill,
  type CommunityStats
} from '@/lib/api/posts';
import PostCard from '@/components/community/PostCard';
import { Avatar, Button } from '@/components/ui';
import Image from 'next/image';
import { CommunitySkeleton } from '@/components/common';

const quickActions = [
  { icon: Plus, label: 'Share Knowledge', color: 'bg-blue-500', href: 'community/create-post' },
  { icon: Search, label: 'Find Skills', color: 'bg-green-500', href: '/browse-skills' },
  { icon: Users, label: 'Join Groups', color: 'bg-purple-500', href: '/groups' },
  { icon: Calendar, label: 'Schedule Exchange', color: 'bg-orange-500', href: '/schedule' }
];

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedMembers, setSuggestedMembers] = useState<SuggestedMember[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingSkill[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);

  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch posts
      const postsResponse = await getPosts({
        type: activeFilter === 'all' ? undefined : activeFilter,
        search: searchQuery || undefined,
        limit: 10,
        page: 1
      });
      setPosts(postsResponse.posts);

      // Fetch suggested members
      const membersResponse = await getSuggestedMembers();
      setSuggestedMembers(membersResponse);

      // Fetch trending skills
      const trendingResponse = await getTrendingSkills(5);
      setTrendingTopics(trendingResponse);

      // Fetch community stats
      const statsResponse = await getCommunityStats();
      setCommunityStats(statsResponse);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load community data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeFilter, searchQuery, fetchData]);

  const handleLike = async (postId: string) => {
    try {
      const response = await toggleLike(postId);
      
      // Update posts with new engagement data
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, engagement: response.engagement }
          : post
      ));

      // Update liked posts state
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (response.liked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this skill exchange!',
          url: `${window.location.origin}/post/${postId}`
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleConnect = async (memberId: string) => {
    try {
      // Navigate to exchange creation with pre-filled member
      router.push(`/exchanges/create?member=${memberId}`);
    } catch (err) {
      console.error('Error connecting:', err);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  if (isAuthenticated === false) {
    return null; // Prevent flicker
  }
  if (isAuthenticated === undefined) {
    return <div className="py-16 text-center text-lg">Checking authentication...</div>;
  }

  if (loading) {
    return <CommunitySkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl p-4 sm:p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row justify-between items-start lg:items-center">
              <div className="w-full lg:w-auto">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2">LearnLoop Community</h1>
                <p className="text-blue-100 text-base sm:text-lg">Where knowledge flows freely and everyone grows together</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{communityStats?.totalUsers || 0} Active Members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{communityStats?.skillsAvailable || 0} Skills Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span>{communityStats?.exchangesThisMonth || 0} Exchanges This Month</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(action.href)}
                    className="flex flex-col items-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 group min-w-[100px]"
                  >
                    <action.icon className="w-6 h-6 mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs sm:text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-96 sm:h-96 bg-white/5 rounded-full -mr-20 -mt-20 sm:-mr-48 sm:-mt-48"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/5 rounded-full -ml-16 -mb-16 sm:-ml-32 sm:-mb-32"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4 sm:gap-8">
          
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-8">
            
            {/* Skill Match Suggestions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Perfect Matches</h2>
                <span className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700">View All</span>
              </div>
              
              <div className="space-y-4">
                {suggestedMembers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No suggestions available</p>
                ) : (
                  suggestedMembers.map((member) => (
                    <div key={member._id} className="group p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Image
                            src={member.profile.profilePicture || 'https://i.pravatar.cc/150?img=4'}
                            alt={member.profile.name}
                            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                            width={48}
                            height={48}
                          />
                          {/* Add online status logic here */}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{member.profile.name}</h3>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <Target className="w-3 h-3" />
                              {Math.round(member.matchScore)}%
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-2">{member.profile.location || 'Location not specified'}</p>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Teaching</div>
                              <div className="flex flex-wrap gap-1">
                                {member.skills_offered.slice(0, 2).map((skill, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                                    {skill.skillId.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Learning</div>
                              <div className="flex flex-wrap gap-1">
                                {member.skills_needed.slice(0, 2).map((skill, index) => (
                                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">
                                    {skill.skillId.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                {member.rating.average.toFixed(1)}
                              </span>
                              <span>{member.rating.count} reviews</span>
                            </div>
                            
                            <button 
                              onClick={() => handleConnect(member._id)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 group-hover:scale-105"
                            >
                              Connect
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Trending Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Trending Skills</h2>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="space-y-3">
                {trendingTopics.length === 0 ? (
                  <p className="text-gray-500 text-sm">No trending skills available</p>
                ) : (
                  trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200 cursor-pointer group">
                      <div>
                        <span className="font-medium text-gray-900 group-hover:text-blue-600">{topic.tag}</span>
                        <div className="text-sm text-gray-500">{topic.posts} posts</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${topic.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {topic.growth}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Skills Taught</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>People Helped</span>
                  <span className="font-bold">48</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Skills Learned</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Community Rank</span>
                  <span className="font-bold">#156</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <main className="col-span-12 lg:col-span-6 space-y-4 sm:space-y-6">
            {/* Post Creation / Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-2 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center space-x-2 w-full">
                <Avatar src={user?.profile?.profilePicture} fallback={user?.profile?.name?.charAt(0)} />
                <Button variant="ghost" className="text-gray-500 hover:text-gray-900 w-full justify-start rounded-full text-xs sm:text-base">
                  What&apos;s on your mind, {user?.profile?.name?.split(' ')[0] || 'User'}?
                </Button>
              </div>
              <Button onClick={() => router.push('/community/create-post')} className="rounded-full w-full sm:w-auto mt-2 sm:mt-0">
                Create Post
              </Button>
            </div>
            
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-2 sm:p-3 overflow-x-auto whitespace-nowrap">
              <div className="flex items-center space-x-2 min-w-max">
                {['all', 'success_story', 'skill_offer', 'learning_request'].map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? 'default' : 'ghost'}
                    onClick={() => handleFilterChange(filter)}
                    className="rounded-full text-xs sm:text-base px-3 sm:px-4"
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1).replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
            
            {posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onLike={handleLike} 
                onShare={handleShare}
                isLiked={likedPosts.has(post._id)}
              />
            ))}
            {posts.length === 0 && !loading && (
              <div className="text-center py-8 sm:py-16">
                <p className="text-base sm:text-lg text-gray-600">No posts yet. Be the first to share!</p>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
            
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search posts, skills, or members..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}