'use client';

import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  Target,
  Users,
  MessageSquare,
  BookOpen,
  ArrowRightLeft,
  CheckCircle,
  Plus,
  X,
  Star,
  Award,
  Zap,
  Calendar,
  GraduationCap,
  Lightbulb,
  Trophy,
  Palette,
  Music,
  Languages,
  Camera,
  Code,
  Coffee,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import AiCoachWidget from '@/components/dashboard/AiCoachWidget';

const skillIcons: { [key: string]: React.ElementType } = {
  'React.js': Code,
  'JavaScript': Code,
  'UI/UX Design': Palette,
  'Spanish': Languages,
  'Photography': Camera,
  'Music': Music,
  'Coffee': Coffee
};

const quickActions = [
  {
    title: 'Browse Skills',
    description: 'Discover new skills to exchange',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    count: '2.5k+ skills',
    action: 'browse',
    href: '/browse-skills'
  },
  {
    title: 'Messages',
    description: 'Check your conversations',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
    count: '3 new',
    action: 'messages',
    href: '/messages'
  },
  {
    title: 'Exchanges',
    description: 'Track your learning journey',
    icon: ArrowRightLeft,
    color: 'from-green-500 to-emerald-500',
    count: '85% complete',
    action: 'exchanges',
    href: '/exchanges'
  },
  {
    title: 'Community',
    description: 'Connect with skill exchangers',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    count: '120 members',
    action: 'community',
    href: '/community'
  }
];

const achievements = [
  { name: 'First Exchange', icon: Trophy, unlocked: true },
  { name: 'Skill Master', icon: Award, unlocked: true },
  { name: 'Community Builder', icon: Users, unlocked: false },
  { name: 'Learning Streak', icon: Zap, unlocked: true },
];

const upcomingSessions = [
  {
    skill: 'UI/UX Design',
    teacher: 'Sarah Chen',
    time: 'Today, 2:00 PM',
    type: 'learning',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    skill: 'React.js',
    student: 'Mike Torres',
    time: 'Tomorrow, 4:00 PM',
    type: 'teaching',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

interface ApiSkill {
  name: string;
  level: string;
  students?: number;
  rating?: number;
  hours?: number;
  teachers?: number;
  progress?: number;
}

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>Profile not found.</div>;

  const teachingSkills: ApiSkill[] = user.skills_offered || [];
  const learningSkills: ApiSkill[] = user.skills_needed || [];

  const userProgress = {
    profileComplete: user?.isProfileComplete || false,
    skillsAdded: (teachingSkills.length + learningSkills.length) || 0,
    exchangesStarted: 2,
    messagesSent: 15,
    communityJoined: true
  };

  const completionPercentage = Math.round(
    (Object.values(userProgress).filter(Boolean).length / 5) * 100
  );

  const removeTeachingSkill = async (skillToRemove: ApiSkill) => {
    if (!user?.skills_offered) return;
    try {
      const updatedSkills = user.skills_offered.filter(s => s.name !== skillToRemove.name);
      await updateProfile({ skills_offered: updatedSkills });
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
      await updateProfile({ skills_needed: updatedSkills });
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
      const newSkill = { name, level: teachingSkillLevel };
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
      const newSkill = { name, level: learningSkillLevel };
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Enhanced Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm p-1">
                  <img
                    src={user.profile?.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                    alt={user.profile?.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user.profile?.name}! 👋
                  </h1>
                  <p className="text-purple-100 text-lg">
                    Your skill exchange journey continues. Ready to learn and teach today?
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 ml-auto">
                <button className="flex items-center gap-3 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg">
                  <Calendar className="w-5 h-5" />
                  Schedule Session
                </button>
                <button className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </button>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
        </div>

        <AiCoachWidget />

        {/* Progress & Stats Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Your Progress</h3>
              <span className="font-bold text-green-500 text-lg">{completionPercentage}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${userProgress.profileComplete ? 'text-green-500' : 'text-gray-300'}`} />
                <span>Profile Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${userProgress.skillsAdded > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                <span>Skills Added</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${userProgress.exchangesStarted > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                <span>Exchange Started</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${userProgress.messagesSent > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                <span>Message Sent</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 italic">Complete your profile to unlock more features!</p>
          </div>

          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map(action => (
                <div key={action.title} className="group cursor-pointer" onClick={() => router.push(action.href)}>
                  <div className={`relative overflow-hidden aspect-square flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br ${action.color} text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                    <action.icon className="w-10 h-10 mb-2 opacity-80" />
                    <h4 className="font-bold text-center text-sm">{action.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skills Offered Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600"/>
              </div>
              <h3 className="text-xl font-bold text-gray-800">I Can Teach</h3>
            </div>
            <div className="space-y-3 flex-grow">
              {teachingSkills.map((skill) => {
                const Icon = skillIcons[skill.name] || Code;
                return (
                  <div key={skill.name} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{skill.name}</p>
                        <p className="text-xs text-gray-500">{skill.level}</p>
                      </div>
                    </div>
                    <button onClick={() => removeTeachingSkill(skill)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              {teachingSkills.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  <p>You haven&apos;t added any skills to teach yet.</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowTeachModal(true)}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Skill
            </button>
          </div>

          {/* Skills Wanted Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">I Want to Learn</h3>
            </div>
            <div className="space-y-3 flex-grow">
              {learningSkills.map((skill) => {
                const Icon = skillIcons[skill.name] || BookOpen;
                return (
                  <div key={skill.name} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{skill.name}</p>
                        <p className="text-xs text-gray-500">{skill.level}</p>
                      </div>
                    </div>
                    <button onClick={() => removeLearningSkill(skill)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              {learningSkills.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  <p>Set some learning goals to get started.</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowLearnModal(true)}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-purple-500 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Goal
            </button>
          </div>

          {/* User Profile Completion Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.name} className={`text-center p-3 rounded-lg ${achievement.unlocked ? 'bg-yellow-50' : 'bg-gray-100'}`}>
                  <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <p className={`text-xs font-semibold ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>{achievement.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                  <img src={session.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover"/>
                  <div className="flex-grow">
                    <p className="font-semibold">{session.skill}</p>
                    <p className="text-sm text-gray-500">
                      {session.type === 'learning' ? 'with ' : 'teaching '} 
                      <span className="font-medium text-gray-700">{session.type === 'learning' ? session.teacher : session.student}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-gray-800">{session.time}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${session.type === 'learning' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {session.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6 text-center">
             <h3 className="text-xl font-bold text-gray-800 mb-4">Your Stats</h3>
             <div className="flex justify-around items-center h-full">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{user.skills_offered?.length || 0}</p>
                  <p className="text-sm text-gray-500">Skills Offered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{user.skills_needed?.length || 0}</p>
                  <p className="text-sm text-gray-500">Skills Wanted</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showTeachModal} onClose={() => setShowTeachModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a new skill to teach</h3>
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
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a new learning goal</h3>
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