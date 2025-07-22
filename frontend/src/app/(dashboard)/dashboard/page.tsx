'use client';

import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  MessageSquare,
  BookOpen,
  CheckCircle,
  Plus,
  X,
  Star,
  Calendar,
  GraduationCap,
  Lightbulb,
  Palette,
  Music,
  Languages,
  Camera,
  Code,
  Coffee,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/common';
import { useRouter } from 'next/navigation';
import AiCoachWidget from '@/components/dashboard/AiCoachWidget';
import Image from 'next/image';
import { quickActions, achievements, upcomingSessions, skillLevels } from '@/data/constants';
import { ApiSkill } from '@/types/dashboard';

const skillIcons: { [key: string]: React.ElementType } = {
  'React.js': Code,
  'JavaScript': Code,
  'UI/UX Design': Palette,
  'Spanish': Languages,
  'Photography': Camera,
  'Music': Music,
  'Coffee': Coffee
};


export default function BeautifulDashboard() {
  const { profile: user, loading, error, refetch } = useProfile();
  const { updateProfile } = useAuth();
  const router = useRouter();
  const [customTeachingSkill, setCustomTeachingSkill] = useState('');
  const [teachingSkillLevel, setTeachingSkillLevel] = useState('Beginner');
  const [customLearningSkill, setCustomLearningSkill] = useState('');
  const [learningSkillLevel, setLearningSkillLevel] = useState('Beginner');
  const [showTeachModal, setShowTeachModal] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [teachLoading, setTeachLoading] = useState(false);
  const [learnLoading, setLearnLoading] = useState(false);

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>Profile not found.</div>;

  const teachingSkills: ApiSkill[] = user.skills_offered || [];
  const learningSkills: ApiSkill[] = user.skills_needed || [];

  const userProgress = {
    profileComplete: user?.isProfileComplete || false,
    skillsAdded: (teachingSkills.length + learningSkills.length) || 0,
    exchangesStarted: user?.exchangesStarted || 0,
    messagesSent: user?.messagesSent || 0,
    communityJoined: true
  };

  const completionPercentage = Math.round(
    (Object.values(userProgress).filter(Boolean).length / 5) * 100
  );

  const removeTeachingSkill = async (skillToRemove: ApiSkill) => {
    if (!user?.skills_offered) return;
    try {
      const updatedSkills = user.skills_offered.filter(s => s.name !== skillToRemove.name);
      const skillsForUpdate = updatedSkills.map(skill => ({
        name: skill.name,
        level: skill.level,
        category: (skill as ApiSkill).category || 'Technology',
        description: (skill as ApiSkill).description || '',
        experience: (skill as ApiSkill).experience || ''
      }));
      await updateProfile({ skills_offered: skillsForUpdate });
      toast.success('Teaching skill removed!');
      await refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove skill.';
      toast.error(message);
    }
  };

  const removeLearningSkill = async (skillToRemove: ApiSkill) => {
    if (!user?.skills_needed) return;
    try {
      const updatedSkills = user.skills_needed.filter(s => s.name !== skillToRemove.name);
      const skillsForUpdate = updatedSkills.map(skill => ({
        name: skill.name,
        level: skill.level,
        category: (skill as ApiSkill).category || 'Technology',
        description: (skill as ApiSkill).description || '',
        experience: (skill as ApiSkill).experience || ''
      }));
      await updateProfile({ skills_needed: skillsForUpdate });
      toast.success('Learning goal removed!');
      await refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove goal.';
      toast.error(message);
    }
  };

  const handleTeachModalAdd = async () => {
    const name = customTeachingSkill.trim();
    if (!name) return;
    setTeachLoading(true);
    try {
      const newSkill = { 
        name, 
        level: teachingSkillLevel,
        category: 'Technology',
        description: '',
        experience: ''
      };
      const updatedSkills = [...(user.skills_offered || []), newSkill];
      await updateProfile({ skills_offered: updatedSkills });
      toast.success('Teaching skill added!');
      await refetch();
      setShowTeachModal(false);
      setCustomTeachingSkill('');
      setTeachingSkillLevel('Beginner');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add skill.';
      toast.error(message);
    } finally {
      setTeachLoading(false);
    }
  };

  const handleLearnModalAdd = async () => {
    const name = customLearningSkill.trim();
    if (!name) return;
    setLearnLoading(true);
    try {
      const newSkill = { 
        name, 
        level: learningSkillLevel,
        category: 'Technology',
        description: '',
        experience: ''
      };
      const updatedSkills = [...(user.skills_needed || []), newSkill];
      await updateProfile({ skills_needed: updatedSkills });
      toast.success('Learning goal added!');
      await refetch();
      setShowLearnModal(false);
      setCustomLearningSkill('');
      setLearningSkillLevel('Beginner');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add goal.';
      toast.error(message);
    } finally {
      setLearnLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
        
        {/* Enhanced Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm p-1">
                  <Image
                    src={user.profile?.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                    alt={user.profile?.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                    width={64}
                    height={64}
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                    Welcome back, {user.profile?.name}! 👋
                  </h1>
                  <p className="text-purple-100 text-sm sm:text-lg">
                    Your skill exchange journey continues. Ready to learn and teach today?
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-4 lg:mt-0 lg:ml-auto">
                <button className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg text-sm sm:text-base">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  Schedule Session
                </button>
                <button className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 text-sm sm:text-base">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  Messages
                </button>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-white/5 rounded-full -mr-24 sm:-mr-48 -mt-24 sm:-mt-48"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/5 rounded-full -ml-16 sm:-ml-32 -mb-16 sm:-mb-32"></div>
        </div>

        <AiCoachWidget />

        {/* Progress & Stats Section */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Your Progress</h3>
              <span className="font-bold text-green-500 text-base sm:text-lg">{completionPercentage}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
              <div className="bg-gradient-to-r from-green-400 to-teal-500 h-2 sm:h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${userProgress.profileComplete ? 'text-green-500' : 'text-gray-300'}`} />
                <span>Profile Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${userProgress.skillsAdded > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                <span>Skills Added</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${userProgress.exchangesStarted > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                <span>Exchange Started</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${userProgress.messagesSent > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                <span>Message Sent</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 italic">Complete your profile to unlock more features!</p>
          </div>

          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {quickActions.map(action => (
                <div key={action.title} className="group cursor-pointer" onClick={() => router.push(action.href)}>
                  <div className={`relative overflow-hidden aspect-square flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-gradient-to-br ${action.color} text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                    <action.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mb-1 sm:mb-2 opacity-80" />
                    <h4 className="font-bold text-center text-xs sm:text-sm">{action.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Skills Offered Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-4 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600"/>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">I Can Teach</h3>
            </div>
            <div className="space-y-2 sm:space-y-3 flex-grow">
              {teachingSkills.map((skill) => {
                const Icon = skillIcons[skill.name] || Code;
                return (
                  <div key={skill.name} className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{skill.name}</p>
                        <p className="text-xs text-gray-500">{skill.level}</p>
                      </div>
                    </div>
                    <button onClick={() => removeTeachingSkill(skill)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                );
              })}
              {teachingSkills.length === 0 && (
                <div className="text-center text-gray-500 py-4 sm:py-6">
                  <p className="text-sm sm:text-base">You haven&apos;t added any skills to teach yet.</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowTeachModal(true)}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-semibold py-2 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Skill
            </button>
          </div>

          {/* Skills Wanted Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-4 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">I Want to Learn</h3>
            </div>
            <div className="space-y-2 sm:space-y-3 flex-grow">
              {learningSkills.map((skill) => {
                const Icon = skillIcons[skill.name] || BookOpen;
                return (
                  <div key={skill.name} className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{skill.name}</p>
                        <p className="text-xs text-gray-500">{skill.level}</p>
                      </div>
                    </div>
                    <button onClick={() => removeLearningSkill(skill)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                );
              })}
              {learningSkills.length === 0 && (
                <div className="text-center text-gray-500 py-4 sm:py-6">
                  <p className="text-sm sm:text-base">Set some learning goals to get started.</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowLearnModal(true)}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-purple-500 text-white font-semibold py-2 sm:py-2.5 rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Goal
            </button>
          </div>

          {/* User Profile Completion Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.name} className={`text-center p-2 sm:p-3 rounded-lg ${achievement.unlocked ? 'bg-yellow-50' : 'bg-gray-100'}`}>
                  <achievement.icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <p className={`text-xs font-semibold ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>{achievement.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
            <div className="space-y-3 sm:space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 rounded-lg">
                  <Image src={session.avatar} alt="avatar" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" width={48} height={48}/>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{session.skill}</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {session.type === 'learning' ? 'with ' : 'teaching '} 
                      <span className="font-medium text-gray-700">{session.type === 'learning' ? session.teacher : session.student}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-xs sm:text-sm text-gray-800">{session.time}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${session.type === 'learning' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {session.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-4 sm:p-10 text-center">
             <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Your Stats</h3>
             <div className="flex justify-around items-center h-full">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{user.skills_offered?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-gray-500 p-2">Skills Offered</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{user.skills_needed?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-gray-500 p-2">Skills Wanted</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showTeachModal} onClose={() => setShowTeachModal(false)}>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Add a new skill to teach</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="teaching-skill" className="block text-sm font-medium text-gray-700 mb-1">
                What skill can you teach?
              </label>
              <input
                type="text"
                id="teaching-skill"
                value={customTeachingSkill}
                onChange={(e) => setCustomTeachingSkill(e.target.value)}
                placeholder="e.g., Intro to React"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="teaching-level" className="block text-sm font-medium text-gray-700 mb-1">
                Your proficiency level
              </label>
              <select
                id="teaching-level"
                value={teachingSkillLevel}
                onChange={(e) => setTeachingSkillLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowTeachModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleTeachModalAdd}
              disabled={teachLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {teachLoading ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showLearnModal} onClose={() => setShowLearnModal(false)}>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Add a new learning goal</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="learning-skill" className="block text-sm font-medium text-gray-700 mb-1">
                What do you want to learn?
              </label>
              <input
                type="text"
                id="learning-skill"
                value={customLearningSkill}
                onChange={(e) => setCustomLearningSkill(e.target.value)}
                placeholder="e.g., Advanced JavaScript"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label htmlFor="learning-level" className="block text-sm font-medium text-gray-700 mb-1">
                Your current level
              </label>
              <select
                id="learning-level"
                value={learningSkillLevel}
                onChange={(e) => setLearningSkillLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowLearnModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleLearnModalAdd}
              disabled={learnLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {learnLoading ? 'Adding...' : 'Add Goal'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}