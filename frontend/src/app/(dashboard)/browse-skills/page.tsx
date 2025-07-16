'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Star, 
  Users, 
  BookOpen,
  ArrowRight,
  Heart,
  X,
  MessageCircle,
  UserCheck,
  Info,
  Filter,
  SortAsc,
} from 'lucide-react';
import Image from 'next/image';
import { BrowseSkillsSkeleton } from '@/components/common';
import { useProfile } from '@/hooks/useProfile';
import toast from 'react-hot-toast';
import { Skill, Teacher } from '@/types/dashboard';
import { DashboardSkillCategories, DashboardSkillSortOptions } from '@/data/constants';

export default function EnhancedSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [favorites, setFavorites] = useState(new Set<string>());
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  
  // Get current user profile
  const { profile: user, loading: userLoading } = useProfile();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`);
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const data: Skill[] = await response.json();
        setSkills(data);
        setFilteredSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const filterAndSortSkills = useCallback(() => {
    if (!user) return;

    let filtered: Skill[] = [...skills];

    // Filter out skills the user is already teaching
    const userTeachingSkills = user.skills_offered || [];
    filtered = filtered.filter(skill => {
      return !userTeachingSkills.some(userSkill => 
        userSkill.name.toLowerCase() === skill.name.toLowerCase()
      );
    });

    // Filter out skills the user is already learning
    const userLearningSkills = user.skills_needed || [];
    filtered = filtered.filter(skill => {
      return !userLearningSkills.some(userSkill => 
        userSkill.name.toLowerCase() === skill.name.toLowerCase()
      );
    });

    // Filter out skills where the user is the teacher
    // Note: We can't directly compare user IDs since ProfileData doesn't have _id
    // This filtering will be handled by the backend or we'll need to get user ID differently

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (skill.tags && skill.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(skill => skill.level === selectedLevel);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'rating':
          const avgRatingB = b.teachers.reduce((sum, t) => sum + t.rating, 0) / (b.teachers.length || 1);
          const avgRatingA = a.teachers.reduce((sum, t) => sum + t.rating, 0) / (a.teachers.length || 1);
          return avgRatingB - avgRatingA;
        default:
          return 0;
      }
    });

    setFilteredSkills(filtered);
  }, [skills, searchTerm, selectedCategory, selectedLevel, sortBy, user]);

  useEffect(() => {
    if (!userLoading) {
      filterAndSortSkills();
    }
  }, [searchTerm, selectedCategory, selectedLevel, sortBy, skills, user, userLoading, filterAndSortSkills]);

  const toggleFavorite = (skillId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(skillId)) {
      newFavorites.delete(skillId);
    } else {
      newFavorites.add(skillId);
    }
    setFavorites(newFavorites);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvgRating = (teachers: Teacher[]) => {
    if (!teachers || teachers.length === 0) return 'N/A';
    return (teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length).toFixed(1);
  };

  const handleSkillDetails = (skill: Skill) => {
    if (skill.teachers.length > 0) {
      router.push(`/profile/${skill.teachers[0]._id}`);
    } else {
      toast.error('No teachers available for this skill yet.');
    }
  };

  const handleRequestToLearn = (skill: Skill) => {
    if (skill.teachers.length > 0) {
      router.push(`/exchanges/new?skill=${skill._id}&teacher=${skill.teachers[0]._id}`);
    } else {
      toast.error('No teachers available for this skill yet.');
    }
  };

  const handleQuickContact = (skill: Skill) => {
    if (skill.teachers.length > 0) {
      router.push(`/messages?teacher=${skill.teachers[0]._id}&skill=${skill._id}`);
    } else {
      toast.error('No teachers available for this skill yet.');
    }
  };

  const SkillCard = ({ skill }: { skill: Skill }) => (
    <div className={`group relative bg-white rounded-xl border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-xl border-gray-100 overflow-hidden`}>
      
      {/* Heart icon for favorites */}
      <button
        onClick={() => toggleFavorite(skill._id)}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
      >
        <Heart 
          className={`h-3 w-3 sm:h-4 sm:w-4 ${favorites.has(skill._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
        />
      </button>

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {skill.name}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(skill.level)}`}>
              {skill.level}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {skill.description}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
              <span className="font-medium">{getAvgRating(skill.teachers)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{skill.learners.length} learners</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {skill.tags?.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {skill.tags && skill.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{skill.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Teachers Preview */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {skill.teachers.length} teacher{skill.teachers.length !== 1 ? 's' : ''} available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1 sm:-space-x-2">
              {skill.teachers?.slice(0, 3).map((teacher: Teacher) => (
                <Image
                  key={teacher._id}
                  src={teacher.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`}
                  alt={teacher.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-sm"
                  width={32}
                  height={32}
                />
              ))}
              {skill.teachers?.length > 3 && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600 font-medium">
                  +{skill.teachers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3">
          {/* Primary Action */}
          <button 
            onClick={() => handleSkillDetails(skill)}
            className="w-full bg-blue-500 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Info className="h-3 w-3 sm:h-4 sm:w-4" />
            Learn This Skill
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleRequestToLearn(skill)}
              className="flex-1 bg-green-50 text-green-700 font-medium py-2 px-3 rounded-lg hover:bg-green-100 transition-colors duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              Request to Learn
            </button>
            <button
              onClick={() => handleQuickContact(skill)}
              className="flex-1 bg-purple-50 text-purple-700 font-medium py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              Contact Teachers
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading || userLoading) {
    return <BrowseSkillsSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in to browse skills</h2>
          <p className="text-gray-600">You need to be logged in to view available skills.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-8 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Discover Your Next 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Skill</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Learn from passionate experts in our community. Find the perfect teacher for any skill you want to master.
            </p>
          </div>

          {/* Enhanced Search */}
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills, teachers, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-3 px-4 font-medium text-gray-700"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters and Controls */}
        <div className={`mb-6 sm:mb-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 sm:mb-6">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {DashboardSkillCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Level Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium bg-white focus:border-blue-500 focus:outline-none"
                >
                  {DashboardSkillSortOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count and active filters */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">{filteredSkills.length}</span> skills found
              {searchTerm && (
                <span className="text-xs sm:text-sm ml-2">
                  for &ldquo;<span className="font-medium">{searchTerm}</span>&rdquo;
                </span>
              )}
            </div>
            {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setSearchTerm('');
                }}
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-1"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSkills.map((skill: Skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No skills found</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
              {searchTerm || selectedCategory !== 'All' || selectedLevel !== 'All' 
                ? 'Try adjusting your search terms or filters to find what you&apos;re looking for.'
                : 'You&apos;re already teaching or learning all available skills! Consider adding new skills to your learning goals.'
              }
            </p>
            {(searchTerm || selectedCategory !== 'All' || selectedLevel !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}