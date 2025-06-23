'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Code,
  Palette,
  Music,
  Camera,
  Coffee,
  BookOpen,
  Star,
  Users,
  Globe,
  TrendingUp,
  Award,
  Play,
  ArrowRight,
  Eye,
  Heart,
  MapPin,
  Clock,
  Zap,
  Target,
  Sparkles,
  Crown,
  ChevronRight,
  UserPlus,
  LogIn,
  Briefcase,
  Languages,
  Dumbbell,
  PaintBucket,
  Calculator,
  Mic,
  Gamepad2,
  ArrowLeftRight,
  Handshake,
  RefreshCw,
  Gift,
  Users2,
  BookOpenCheck,
  GraduationCap,
  Lightbulb
} from 'lucide-react';

const skillCategories = [
  { 
    id: 'programming', 
    name: 'Programming & Tech', 
    icon: Code, 
    color: 'bg-blue-100 text-blue-600',
    teaching: 1247,
    learning: 892,
    description: 'Exchange web development, mobile apps, data science skills'
  },
  { 
    id: 'design', 
    name: 'Design & Creative', 
    icon: Palette, 
    color: 'bg-purple-100 text-purple-600',
    teaching: 892,
    learning: 1156,
    description: 'Trade UI/UX, graphic design, illustration expertise'
  },
  { 
    id: 'languages', 
    name: 'Languages', 
    icon: Languages, 
    color: 'bg-green-100 text-green-600',
    teaching: 1156,
    learning: 1834,
    description: 'Exchange language skills with native speakers'
  },
  { 
    id: 'business', 
    name: 'Business & Marketing', 
    icon: Briefcase, 
    color: 'bg-orange-100 text-orange-600',
    teaching: 743,
    learning: 567,
    description: 'Trade entrepreneurship, marketing, sales knowledge'
  },
  { 
    id: 'arts', 
    name: 'Arts & Music', 
    icon: Music, 
    color: 'bg-pink-100 text-pink-600',
    teaching: 634,
    learning: 892,
    description: 'Exchange musical instruments, art techniques, creativity'
  },
  { 
    id: 'lifestyle', 
    name: 'Lifestyle & Hobbies', 
    icon: Coffee, 
    color: 'bg-yellow-100 text-yellow-600',
    teaching: 987,
    learning: 1234,
    description: 'Trade cooking, fitness, photography, life skills'
  }
];

const exchangeExamples = [
  {
    id: 1,
    teacherSkill: 'React.js Development',
    learnerSkill: 'UI/UX Design',
    teacherIcon: Code,
    learnerIcon: Palette,
    description: 'Developers learning design thinking while teaching modern React patterns',
    participants: 156,
    success: 94,
    duration: '6-8 weeks'
  },
  {
    id: 2,
    teacherSkill: 'Spanish Language',
    learnerSkill: 'English Conversation',
    teacherIcon: Languages,
    learnerIcon: Languages,
    description: 'Native speakers exchanging languages for mutual fluency',
    participants: 289,
    success: 97,
    duration: '8-12 weeks'
  },
  {
    id: 3,
    teacherSkill: 'Digital Marketing',
    learnerSkill: 'Web Development',
    teacherIcon: TrendingUp,
    learnerIcon: Code,
    description: 'Marketers and developers sharing complementary business skills',
    participants: 134,
    success: 91,
    duration: '5-7 weeks'
  },
  {
    id: 4,
    teacherSkill: 'Photography',
    learnerSkill: 'Video Editing',
    teacherIcon: Camera,
    learnerIcon: Play,
    description: 'Visual creators expanding their multimedia skill sets together',
    participants: 178,
    success: 89,
    duration: '4-6 weeks'
  }
];

const successStories = [
  {
    id: 1,
    name: 'Sarah & Miguel',
    taught: 'React.js',
    learned: 'UI Design',
    result: 'Both landed new jobs using their combined skills',
    avatar1: 'https://i.pravatar.cc/150?img=1',
    avatar2: 'https://i.pravatar.cc/150?img=2',
    duration: '2 months'
  },
  {
    id: 2,
    name: 'Emma & Carlos',
    taught: 'English',
    learned: 'Spanish',
    result: 'Now fluent and planning to work internationally',
    avatar1: 'https://i.pravatar.cc/150?img=3',
    avatar2: 'https://i.pravatar.cc/150?img=4',
    duration: '6 months'
  },
  {
    id: 3,
    name: 'David & Lisa',
    taught: 'Photography',
    learned: 'Marketing',
    result: 'Launched successful creative agency together',
    avatar1: 'https://i.pravatar.cc/150?img=5',
    avatar2: 'https://i.pravatar.cc/150?img=6',
    duration: '4 months'
  }
];

const platformStats = [
  { value: '125,000+', label: 'Skill Exchanges', icon: ArrowLeftRight },
  { value: '50,000+', label: 'Active Members', icon: Users },
  { value: '2,500+', label: 'Skills Available', icon: BookOpen },
  { value: '120+', label: 'Countries', icon: Globe }
];

const howItWorksSteps = [
  {
    step: 1,
    title: 'Share Your Skills',
    description: 'Tell us what you can teach and what you want to learn',
    icon: BookOpenCheck,
    color: 'bg-blue-500'
  },
  {
    step: 2,
    title: 'Find Your Match',
    description: 'We connect you with someone who complements your skills',
    icon: Users2,
    color: 'bg-purple-500'
  },
  {
    step: 3,
    title: 'Exchange & Grow',
    description: 'Teach each other and build lasting learning partnerships',
    icon: Handshake,
    color: 'bg-green-500'
  }
];

export default function PublicSkillExchangePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Hero Section - Exchange Focus */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Exchange</span> Skills, Not Money
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Teach what you know, learn what you need. Join a global community where knowledge flows freely 
              and everyone benefits from skill exchange.
            </p>
            
            {/* Value Proposition */}
            <div className="flex items-center justify-center gap-8 mb-8 text-blue-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                <span className="font-medium">Teach Your Skills</span>
              </div>
              <ArrowLeftRight className="w-6 h-6 text-yellow-400" />
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6" />
                <span className="font-medium">Learn New Ones</span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200 w-6 h-6" />
                <input
                  type="text"
                  placeholder="What can you teach? What do you want to learn?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg"
                />
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg">
                <ArrowLeftRight className="w-5 h-5" />
                Start Exchanging Free
              </button>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                <Play className="w-5 h-5" />
                See How It Works
              </button>
            </div>
            
            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {platformStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* How It Works - Exchange Process */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Skill Exchange Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, fair, and completely free. Everyone teaches, everyone learns.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="text-center group">
                <div className={`w-16 h-16 ${step.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-bold mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Exchange Examples */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Skill Exchanges</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See real exchanges happening right now in our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {exchangeExamples.map((exchange) => (
              <div key={exchange.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                
                {/* Exchange Visual */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                        <exchange.teacherIcon className="w-8 h-8" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{exchange.teacherSkill}</div>
                      <div className="text-xs text-green-600">Teaching</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <ArrowLeftRight className="w-8 h-8 text-purple-500 mb-2" />
                      <span className="text-xs text-purple-600 font-medium">Exchange</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-3">
                        <exchange.learnerIcon className="w-8 h-8" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{exchange.learnerSkill}</div>
                      <div className="text-xs text-blue-600">Learning</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-center mb-6 leading-relaxed">{exchange.description}</p>
                
                {/* Exchange Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{exchange.participants}</div>
                    <div className="text-xs text-gray-500">Active Exchanges</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{exchange.success}%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{exchange.duration}</div>
                    <div className="text-xs text-gray-500">Avg Duration</div>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 font-medium">
                  Join This Exchange
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Categories - Exchange Focus */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Exchange Skills Across Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every category has people ready to teach and learn. Find your perfect skill swap.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category) => (
              <div key={category.id} className="group cursor-pointer">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                  
                  {/* Exchange Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{category.teaching.toLocaleString()}</div>
                      <div className="text-xs text-green-600">Ready to Teach</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{category.learning.toLocaleString()}</div>
                      <div className="text-xs text-blue-600">Want to Learn</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-purple-600 font-semibold">
                      {Math.round((category.teaching / category.learning) * 100)}% match rate
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real people, real exchanges, real results. See how skill exchange transforms lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="text-center group">
                
                {/* Avatar Pair */}
                <div className="relative mb-6">
                  <div className="flex items-center justify-center">
                    <img
                      src={story.avatar1}
                      alt="Teacher"
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg -mr-4 z-10"
                    />
                    <img
                      src={story.avatar2}
                      alt="Learner"
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg -ml-4 z-10"
                    />
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <ArrowLeftRight className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.name}</h3>
                
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Taught: {story.taught}
                  </span>
                  <ArrowLeftRight className="w-4 h-4 text-purple-500" />
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Learned: {story.learned}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 italic">"{story.result}"</p>
                
                <div className="text-sm text-gray-500">
                  Exchange Duration: {story.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Exchange Focus */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Ready to Exchange Skills?</h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands who are already teaching what they know and learning what they need. 
              Your next skill exchange is just one click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg">
                <ArrowLeftRight className="w-5 h-5" />
                Start Your First Exchange
              </button>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                <Users className="w-5 h-5" />
                Browse Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}