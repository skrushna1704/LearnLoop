'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  Clock,
  Globe,
  Award,
  MessageSquare,
  Calendar,
  BookOpen,
  Code,
  Palette,
  Music,
  Camera,
  Coffee,
  Languages,
  Briefcase,
  Heart,
  CheckCircle,
  Target,
  Zap,
  TrendingUp,
  Eye,
  ArrowRight,
  Plus,
  Sparkles,
  Crown,
  Badge,
  Video,
  Phone,
  Mail
} from 'lucide-react';

const teachers = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'Senior UI/UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    location: 'San Francisco, CA',
    timezone: 'PST',
    rating: 4.9,
    reviews: 127,
    students: 45,
    hoursTaught: 320,
    responseTime: '< 2 hours',
    verified: true,
    online: true,
    premium: true,
    skills: [
      { name: 'UI/UX Design', level: 'Expert', icon: Palette },
      { name: 'Figma', level: 'Expert', icon: Target },
      { name: 'Design Systems', level: 'Advanced', icon: Briefcase }
    ],
    languages: ['English', 'Mandarin'],
    hourlyValue: '$85',
    nextAvailable: 'Today at 3:00 PM',
    bio: 'Passionate about creating intuitive user experiences. I\'ve worked with Fortune 500 companies and love sharing design thinking principles.',
    achievements: ['Top Rated Teacher', '100+ Students', 'Design Mentor'],
    teaching: 'I focus on hands-on learning with real project examples'
  },
  {
    id: 2,
    name: 'Miguel Rodriguez',
    title: 'Full Stack Developer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    location: 'Barcelona, Spain',
    timezone: 'CET',
    rating: 4.8,
    reviews: 89,
    students: 32,
    hoursTaught: 280,
    responseTime: '< 4 hours',
    verified: true,
    online: false,
    premium: false,
    skills: [
      { name: 'React.js', level: 'Expert', icon: Code },
      { name: 'Node.js', level: 'Expert', icon: Code },
      { name: 'JavaScript', level: 'Expert', icon: Code }
    ],
    languages: ['Spanish', 'English', 'Catalan'],
    hourlyValue: '$75',
    nextAvailable: 'Tomorrow at 10:00 AM',
    bio: 'Full-stack developer with 8 years experience. I enjoy teaching modern web development and helping others build amazing applications.',
    achievements: ['Expert Developer', 'Community Contributor'],
    teaching: 'Project-based learning with industry best practices'
  },
  {
    id: 3,
    name: 'Emma Thompson',
    title: 'Digital Marketing Strategist',
    avatar: 'https://i.pravatar.cc/150?img=3',
    location: 'London, UK',
    timezone: 'GMT',
    rating: 4.7,
    reviews: 156,
    students: 67,
    hoursTaught: 450,
    responseTime: '< 1 hour',
    verified: true,
    online: true,
    premium: true,
    skills: [
      { name: 'Digital Marketing', level: 'Expert', icon: TrendingUp },
      { name: 'SEO', level: 'Advanced', icon: Target },
      { name: 'Content Strategy', level: 'Expert', icon: BookOpen }
    ],
    languages: ['English', 'French'],
    hourlyValue: '$90',
    nextAvailable: 'Today at 5:00 PM',
    bio: 'Marketing professional helping businesses grow online. I specialize in data-driven strategies and love teaching practical marketing skills.',
    achievements: ['Marketing Expert', 'Top Performer', '50+ Success Stories'],
    teaching: 'Real campaign examples with actionable strategies'
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'Professional Photographer',
    avatar: 'https://i.pravatar.cc/150?img=4',
    location: 'Seoul, South Korea',
    timezone: 'KST',
    rating: 4.9,
    reviews: 94,
    students: 28,
    hoursTaught: 190,
    responseTime: '< 3 hours',
    verified: true,
    online: false,
    premium: false,
    skills: [
      { name: 'Photography', level: 'Expert', icon: Camera },
      { name: 'Lightroom', level: 'Expert', icon: Eye },
      { name: 'Portrait Photography', level: 'Expert', icon: Camera }
    ],
    languages: ['Korean', 'English', 'Japanese'],
    hourlyValue: '$60',
    nextAvailable: 'This Weekend',
    bio: 'Award-winning photographer with 10+ years experience. I teach everything from basics to advanced techniques.',
    achievements: ['Award Winner', 'Published Artist'],
    teaching: 'Hands-on practice with immediate feedback'
  },
  {
    id: 5,
    name: 'Maria Garcia',
    title: 'Language Learning Expert',
    avatar: 'https://i.pravatar.cc/150?img=5',
    location: 'Mexico City, Mexico',
    timezone: 'CST',
    rating: 4.8,
    reviews: 203,
    students: 89,
    hoursTaught: 520,
    responseTime: '< 2 hours',
    verified: true,
    online: true,
    premium: true,
    skills: [
      { name: 'Spanish Language', level: 'Expert', icon: Languages },
      { name: 'Language Teaching', level: 'Expert', icon: BookOpen },
      { name: 'Conversation Practice', level: 'Expert', icon: MessageSquare }
    ],
    languages: ['Spanish', 'English', 'Portuguese'],
    hourlyValue: '$45',
    nextAvailable: 'Today at 2:00 PM',
    bio: 'Certified language teacher with a passion for helping students achieve fluency through immersive conversation practice.',
    achievements: ['Certified Teacher', 'Polyglot', '500+ Hours'],
    teaching: 'Immersive conversation with cultural context'
  },
  {
    id: 6,
    name: 'Alex Johnson',
    title: 'Music Producer & Composer',
    avatar: 'https://i.pravatar.cc/150?img=6',
    location: 'Nashville, TN',
    timezone: 'CST',
    rating: 4.6,
    reviews: 72,
    students: 34,
    hoursTaught: 240,
    responseTime: '< 6 hours',
    verified: false,
    online: true,
    premium: false,
    skills: [
      { name: 'Music Production', level: 'Expert', icon: Music },
      { name: 'Guitar', level: 'Advanced', icon: Music },
      { name: 'Audio Engineering', level: 'Expert', icon: Music }
    ],
    languages: ['English'],
    hourlyValue: '$70',
    nextAvailable: 'Tomorrow at 7:00 PM',
    bio: 'Professional music producer and multi-instrumentalist. I love teaching music theory and production techniques.',
    achievements: ['Chart Success', 'Studio Professional'],
    teaching: 'Learn by creating - we\'ll make music together'
  }
];

const skillCategories = [
  { name: 'All Skills', count: teachers.length, icon: BookOpen, color: 'bg-gray-100 text-gray-800' },
  { name: 'Programming', count: 2, icon: Code, color: 'bg-blue-100 text-blue-800' },
  { name: 'Design', count: 1, icon: Palette, color: 'bg-purple-100 text-purple-800' },
  { name: 'Marketing', count: 1, icon: TrendingUp, color: 'bg-green-100 text-green-800' },
  { name: 'Photography', count: 1, icon: Camera, color: 'bg-pink-100 text-pink-800' },
  { name: 'Languages', count: 1, icon: Languages, color: 'bg-orange-100 text-orange-800' },
  { name: 'Music', count: 1, icon: Music, color: 'bg-indigo-100 text-indigo-800' }
];

const filters = {
  rating: [
    { label: '4.5+ Stars', value: '4.5+', count: 4 },
    { label: '4.0+ Stars', value: '4.0+', count: 6 },
    { label: '3.5+ Stars', value: '3.5+', count: 6 }
  ],
  availability: [
    { label: 'Available Today', value: 'today', count: 3 },
    { label: 'This Week', value: 'week', count: 5 },
    { label: 'Flexible Schedule', value: 'flexible', count: 6 }
  ],
  experience: [
    { label: 'Expert Level', value: 'expert', count: 4 },
    { label: 'Advanced Level', value: 'advanced', count: 2 },
    { label: '100+ Students', value: '100students', count: 2 }
  ]
};

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Skills');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  const stats = {
    totalTeachers: teachers.length,
    avgRating: (teachers.reduce((sum, teacher) => sum + teacher.rating, 0) / teachers.length).toFixed(1),
    totalStudents: teachers.reduce((sum, teacher) => sum + teacher.students, 0),
    onlineNow: teachers.filter(teacher => teacher.online).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Teacher</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connect with expert teachers from around the world. Learn new skills through personalized, 
              one-on-one sessions in our skill exchange community.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                <div className="text-sm text-blue-100">Expert Teachers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.avgRating}★</div>
                <div className="text-sm text-blue-100">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.totalStudents}+</div>
                <div className="text-sm text-blue-100">Students Taught</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.onlineNow}</div>
                <div className="text-sm text-blue-100">Online Now</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by skill, name, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            {/* Sort Options */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="rating">Highest Rated</option>
                <option value="students">Most Students</option>
                <option value="hours">Most Experience</option>
                <option value="availability">Available Now</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex gap-3 mt-6 flex-wrap">
            {skillCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                  selectedCategory === category.name
                    ? 'bg-blue-500 text-white shadow-md'
                    : category.color + ' hover:scale-105'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Advanced Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Teachers</h3>
              
              {Object.entries(filters).map(([filterType, options]) => (
                <div key={filterType} className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 capitalize">{filterType}</h4>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                          {option.label}
                        </span>
                        <span className="text-gray-400 text-sm">({option.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Teachers */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Featured Teachers
              </h3>
              <p className="text-purple-100 text-sm mb-4">
                Hand-picked experts with exceptional ratings and teaching experience
              </p>
              <button className="w-full py-2 px-4 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300">
                View Featured
              </button>
            </div>
          </div>

          {/* Teachers Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  
                  {/* Teacher Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
                          />
                          {teacher.online && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                          {teacher.verified && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <CheckCircle className="w-3 h-3 text-white fill-current" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                              {teacher.name}
                            </h3>
                            {teacher.premium && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{teacher.title}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {teacher.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {teacher.timezone}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">{teacher.rating}</span>
                          <span className="text-gray-500 text-sm">({teacher.reviews})</span>
                        </div>
                        <div className="text-sm text-gray-500">{teacher.students} students</div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {teacher.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            <skill.icon className="w-3 h-3" />
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {teacher.bio}
                    </p>

                    {/* Teaching Approach */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Teaching Style</span>
                      </div>
                      <p className="text-blue-700 text-sm">{teacher.teaching}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{teacher.hoursTaught}</div>
                        <div className="text-xs text-gray-500">Hours Taught</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{teacher.responseTime}</div>
                        <div className="text-xs text-gray-500">Response Time</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{teacher.hourlyValue}</div>
                        <div className="text-xs text-gray-500">Market Value</div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Languages className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.languages.map((language, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Next Available</span>
                      </div>
                      <p className="text-green-700 text-sm font-medium">{teacher.nextAvailable}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium">
                        Start Exchange
                      </button>
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg">
                Load More Teachers
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Join our community and post your learning goals. Teachers will reach out to you directly!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg">
              <Plus className="w-5 h-5" />
              Post Learning Request
            </button>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
              <Users className="w-5 h-5" />
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}