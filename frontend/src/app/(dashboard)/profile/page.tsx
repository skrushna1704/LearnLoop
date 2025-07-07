'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Edit, Star, BookOpen, Calendar, MapPin, TrendingUp, Target, Zap, Clock, Share2, Trophy, Camera, Link, Mail, Users, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SkillsManagement from '@/components/profile/SkillsManagement';
import { AvatarUpload } from '@/components/profile';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ProfileSkeleton } from '@/components/common';
import { profileApi } from '@/lib/api/profile';
import toast from 'react-hot-toast';
import Image from 'next/image';

type Skill = {
  name: string;
  level: string;
  students?: number;
  teachers?: number;
  rating?: number;
  hours?: number;
  progress?: number;
  description?: string;
  category?: string;
};

// Define a type for skill data coming from the API
interface ApiSkill {
  name?: string;
  level?: string;
  category?: string;
  description?: string;
  experience?: string;
  students?: number;
  rating?: number;
  hours?: number;
  teachers?: number;
  progress?: number;
}

// Define a type for the user data coming from the API
interface ApiUser {
  email: string;
  name?: string;
  isEmailVerified?: boolean;
  profile?: {
    name?: string;
    profilePicture?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    website?: string;
  };
  skills_offered?: ApiSkill[];
  skills_needed?: ApiSkill[];
  createdAt?: string;
  rating?: { average: number; count: number };
  stats?: Stats;
}

type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  date?: string;
};

type Activity = {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  icon: React.ElementType;
  color: string;
};

type Stats = {
  skillsTeaching?: number;
  skillsLearning?: number;
  connections?: number;
  completedExchanges?: number;
  totalHoursTeaching?: number;
  totalHoursLearning?: number;
  communityRank?: number;
  impactScore?: number;
};

type ProfileData = {
  email: string;
  verified?: boolean;
  profile?: {
    name?: string;
    profilePicture?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    website?: string;
  };
  joinedDate?: string;
  rating?: { average: number; count: number };
  stats?: Stats;
  skills: {
    teaching: Skill[];
    learning: Skill[];
  };
  achievements?: Achievement[];
  recentActivity?: Activity[];
};

// Replace 'any' with a more specific type for skill
type AddSkillType = {
  name: string;
  category: string;
  level: string;
  description?: string;
  experience?: string;
  isPublic?: boolean;
};

type UpdateSkillType = {
  level?: string;
  description?: string;
  category?: string;
};

// Helper function to transform API user data to the format expected by the profile page
const transformApiUserToProfileData = (apiUser: ApiUser): ProfileData => {
  return {
    email: apiUser.email || '',
    verified: apiUser.isEmailVerified || false,
    profile: {
      name: apiUser.profile?.name || apiUser.name || '',
      profilePicture: apiUser.profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name}`,
      coverImage: apiUser.profile?.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      bio: apiUser.profile?.bio || '',
      location: apiUser.profile?.location || '',
      timezone: apiUser.profile?.timezone || '',
      website: apiUser.profile?.website || '',
    },
    joinedDate: apiUser.createdAt ? new Date(apiUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A',
    rating: apiUser.rating || { average: 0, count: 0 },
    stats: apiUser.stats || {},
    skills: {
      teaching: (apiUser.skills_offered || []).map((s: ApiSkill) => ({
        name: s.name || '',
        level: s.level || 'Beginner',
        students: s.students || 0,
        rating: s.rating || 0,
        hours: s.hours || 0,
      })),
      learning: (apiUser.skills_needed || []).map((s: ApiSkill) => ({
        name: s.name || '',
        level: s.level || 'Beginner',
        teachers: s.teachers || 0,
        progress: s.progress || 0,
        hours: s.hours || 0,
      })),
    },
    achievements: [], 
    recentActivity: [],
  };
};

export default function MyProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication error. Please log in.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // The API returns the user object directly, not nested under a 'user' key.
        if (data) {
          setProfile(transformApiUserToProfileData(data));
        } else {
          throw new Error('API returned an empty response.');
        }
      } else if (response.status === 401) {
        toast.error('Session expired. Please log in again.');
        router.push('/login');
      } else {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      toast.error((error as Error).message || 'Could not fetch your profile data.');
    } finally {
      setLoading(false);
    }
  }, [router, apiUrl]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleAddSkill = async (skill: AddSkillType, type: 'teaching' | 'learning') => {
    try {
      if (!user || !updateProfile) throw new Error('User not authenticated');

      // Convert to the format expected by the API
      const skillForUpdate = {
        name: skill.name,
        level: skill.level,
        category: skill.category,
        description: skill.description || '',
        experience: skill.experience || ''
      };

      if (type === 'teaching') {
        // Convert existing skills to the correct format
        const existingSkills = (user.skills_offered || []).map(skill => ({
          name: (skill as ApiSkill).name || '',
          level: (skill as ApiSkill).level || 'Beginner',
          category: (skill as ApiSkill).category || 'Technology',
          description: (skill as ApiSkill).description || '',
          experience: (skill as ApiSkill).experience || ''
        }));
        const updatedSkills = [...existingSkills, skillForUpdate];
        await updateProfile({ skills_offered: updatedSkills });
      } else {
        // Convert existing skills to the correct format
        const existingSkills = (user.skills_needed || []).map(skill => ({
          name: (skill as ApiSkill).name || '',
          level: (skill as ApiSkill).level || 'Beginner',
          category: (skill as ApiSkill).category || 'Technology',
          description: (skill as ApiSkill).description || '',
          experience: (skill as ApiSkill).experience || ''
        }));
        const updatedSkills = [...existingSkills, skillForUpdate];
        await updateProfile({ skills_needed: updatedSkills });
      }
      
      toast.success('Skill added successfully!');
      await fetchProfileData(); // Refetch data to show updates
    } catch (error) {
      console.error('Failed to add skill:', error);
      toast.error('Failed to add skill.');
    }
  };

  const handleUpdateSkill = async (id: string, updates: UpdateSkillType, type: 'teaching' | 'learning') => {
    if (!profile || !updateProfile) return;
    try {
        if (type === 'teaching') {
            const updatedSkills = profile.skills.teaching.map(skill => 
              skill.name === id ? { 
                name: skill.name,
                level: updates.level || skill.level,
                category: updates.category || 'Technology',
                description: updates.description || '',
                experience: ''
              } : { 
                name: skill.name,
                level: skill.level,
                category: 'Technology',
                description: '',
                experience: ''
              }
            );
            await updateProfile({ skills_offered: updatedSkills });
        } else {
            const updatedSkills = profile.skills.learning.map(skill => 
              skill.name === id ? { 
                name: skill.name,
                level: updates.level || skill.level,
                category: updates.category || 'Technology',
                description: updates.description || '',
                experience: ''
              } : { 
                name: skill.name,
                level: skill.level,
                category: 'Technology',
                description: '',
                experience: ''
              }
            );
            await updateProfile({ skills_needed: updatedSkills });
        }
        toast.success('Skill updated!');
        await fetchProfileData();
    } catch (error) {
      console.error('Failed to update skill:', error);
      toast.error('Failed to update skill.');
    }
  };
  
  const handleDeleteSkill = async (id: string, type: 'teaching' | 'learning') => {
    if (!profile || !updateProfile) return;
    try {
        if (type === 'teaching') {
            const updatedSkills = profile.skills.teaching
              .filter(skill => skill.name !== id)
              .map(skill => ({
                name: skill.name,
                level: skill.level,
                category: 'Technology',
                description: '',
                experience: ''
              }));
            await updateProfile({ skills_offered: updatedSkills });
        } else {
            const updatedSkills = profile.skills.learning
              .filter(skill => skill.name !== id)
              .map(skill => ({
                name: skill.name,
                level: skill.level,
                category: 'Technology',
                description: '',
                experience: ''
              }));
            await updateProfile({ skills_needed: updatedSkills });
        }
        toast.success('Skill deleted!');
        await fetchProfileData();
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast.error('Failed to delete skill.');
    }
  };

  const handleAvatarUpload = async (file: File, preview: string) => {
    try {
      const response = await profileApi.uploadProfilePicture(file);
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          profile: {
            ...profile.profile,
            profilePicture: response.profilePicture || preview
          }
        });
      }
      
      // Update auth context if needed
      if (updateProfile) {
        updateProfile({ 
          profile: { 
            profilePicture: response.profilePicture || undefined
          } 
        });
      }
      
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload profile picture. Please try again.');
      throw error;
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await profileApi.removeProfilePicture();
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          profile: {
            ...profile.profile,
            profilePicture: undefined
          }
        });
      }
      
      // Update auth context if needed
      if (updateProfile) {
        updateProfile({ 
          profile: { 
            profilePicture: undefined 
          } 
        });
      }
      
      toast.success('Profile picture removed successfully!');
    } catch (error) {
      console.error('Avatar removal error:', error);
      toast.error('Failed to remove profile picture. Please try again.');
      throw error;
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!profile) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        
        {/* Welcome Section for New Users */}
        {profile.skills.teaching.length === 0 && profile.skills.learning.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to LearnLoop! 🎉</h2>
              <p className="text-gray-600 mb-6">
                Let&apos;s get you started by adding your first skills. You can teach some and learn others!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-blue-900">Skills I Can Teach</h3>
                </div>
                <p className="text-blue-700 text-sm mb-4">
                  Share your expertise with others. What are you good at?
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // Scroll to skills section and open add form
                    document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' });
                    // You can add logic here to auto-open the add form
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Teaching Skills
                </Button>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-purple-900">Skills I Want to Learn</h3>
                </div>
                <p className="text-purple-700 text-sm mb-4">
                  Find teachers for skills you want to master.
                </p>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    // Scroll to skills section and open add form
                    document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' });
                    // You can add logic here to auto-open the add form
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Learning Skills
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>I can teach</span>
                </div>
                <div className="text-gray-400">⇄</div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span>I want to learn</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-lg border border-gray-100">
          {/* Cover Image */}
          <div className="relative h-48 lg:h-64">
            <Image
              src={profile.profile?.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
              alt="Cover"
              className="w-full h-full object-cover"
              width={1200}
              height={64}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Edit Cover Button */}
            <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-16 lg:-mt-20">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                <div className="relative">
                  <AvatarUpload
                    currentAvatar={profile.profile?.profilePicture}
                    userName={profile.profile?.name || 'User'}
                    size="xl"
                    onUpload={handleAvatarUpload}
                    onRemove={handleAvatarRemove}
                    className="w-32 h-32 lg:w-40 lg:h-40"
                    editable={true}
                  />
                  {profile.verified && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
                      <Star className="w-5 h-5 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{profile.profile?.name}</h1>
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.profile?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {profile.profile?.timezone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {profile.joinedDate || ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-6">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-lg">{profile.rating?.average || 0}</span>
                        <span className="text-gray-500">({profile.rating?.count || 0} exchanges)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold">Rank #{profile.stats?.communityRank || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed max-w-2xl">{profile.profile?.bio}</p>
                  {/* Contact Links */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
                    <a href={`mailto:${profile.email}`} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </a>
                    {profile.profile?.website && (
                      <a href={profile.profile.website} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-300">
                        <Link className="w-5 h-5" />
                      </a>
                    )}
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-300">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 lg:mt-0">
                <button 
                  onClick={() => router.push('/profile/edit')}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
                {/* <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300">
                  <Settings className="w-5 h-5" />
                  Settings
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{profile.stats?.skillsTeaching || 0}</div>
            <div className="text-sm text-gray-500">Skills Teaching</div>
            <div className="text-xs text-green-600 mt-1">+2 this month</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-purple-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{profile.stats?.skillsLearning || 0}</div>
            <div className="text-sm text-gray-500">Skills Learning</div>
            <div className="text-xs text-green-600 mt-1">+1 this month</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-green-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{profile.stats?.connections || 0}</div>
            <div className="text-sm text-gray-500">Connections</div>
            <div className="text-xs text-green-600 mt-1">+12 this month</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-8 h-8 text-orange-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{profile.stats?.impactScore || 0}</div>
            <div className="text-sm text-gray-500">Impact Score</div>
            <div className="text-xs text-green-600 mt-1">+45 this month</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Skills */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Skills I'm Teaching */}
            <div id="skills-section" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Skills I&apos;m Teaching
                </h2>
              </div>
              
              <SkillsManagement
                skills={profile.skills?.teaching.map(skill => ({
                  id: skill.name,
                  name: skill.name,
                  category: 'Technology',
                  level: (skill.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
                  verified: false,
                  endorsements: skill.students || 0,
                  description: '',
                  lastUpdated: new Date().toISOString(),
                  isPublic: true
                })) || []}
                onAddSkill={(skill) => handleAddSkill(skill, 'teaching')}
                onUpdateSkill={(id, updates) => handleUpdateSkill(id, updates, 'teaching')}
                onDeleteSkill={(id) => handleDeleteSkill(id, 'teaching')}
                editable={true}
                showEndorsements={true}
              />
            </div>

            {/* Skills I'm Learning */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-600" />
                  Skills I&apos;m Learning
                </h2>
              </div>
              
              <SkillsManagement
                skills={profile.skills?.learning.map(skill => ({
                  id: skill.name,
                  name: skill.name,
                  category: 'Technology',
                  level: (skill.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
                  verified: false,
                  endorsements: skill.teachers || 0,
                  description: '',
                  lastUpdated: new Date().toISOString(),
                  isPublic: true
                })) || []}
                onAddSkill={(skill) => handleAddSkill(skill, 'learning')}
                onUpdateSkill={(id, updates) => handleUpdateSkill(id, updates, 'learning')}
                onDeleteSkill={(id) => handleDeleteSkill(id, 'learning')}
                editable={true}
                showEndorsements={true}
              />
            </div>
          </div>

          {/* Right Column - Activity & Achievements */}
          <div className="space-y-8">
            
            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Achievements
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {Array.isArray(profile.achievements) && profile.achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 opacity-60'
                    }`}
                  >
                    <achievement.icon className={`w-8 h-8 mb-3 ${
                      achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                    <h3 className={`font-semibold text-sm mb-1 ${
                      achievement.earned ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-xs ${
                      achievement.earned ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <div className="text-xs text-yellow-600 mt-2 font-medium">
                        Earned {achievement.date}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-gray-600" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {Array.isArray(profile.recentActivity) && profile.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                    <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.subtitle}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                View All Activity
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Teaching Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Hours Taught</span>
                  <span className="font-bold">{profile.stats?.totalHoursTeaching || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>People Helped</span>
                  <span className="font-bold">{profile.skills?.teaching.reduce((acc, skill) => acc + (skill.students || 0), 0) || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Hours Learned</span>
                  <span className="font-bold">{profile.stats?.totalHoursLearning || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Impact Score</span>
                  <span className="font-bold">{profile.stats?.impactScore || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}