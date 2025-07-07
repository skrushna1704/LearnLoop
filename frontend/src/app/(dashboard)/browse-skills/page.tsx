'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Star, 
  Users, 
  BookOpen,
  TrendingUp,
  Target,
  Music,
  Camera,
  Code,
  Palette,
  Globe,
  ArrowRight,
  Heart,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { BrowseSkillsSkeleton } from '@/components/common';


interface Teacher {
  _id: string;
  name: string;
  rating: number;
  profilePicture?: string;
}

interface Skill {
  _id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  teachers: Teacher[];
  learners: string[];
  popularity?: number;
  tags?: string[];
}

const categories = [
  { id: 'All', name: 'All', icon: Globe },
  { id: 'Technology', name: 'Tech', icon: Code },
  { id: 'Design', name: 'Design', icon: Palette },
  { id: 'Music', name: 'Music', icon: Music },
  { id: 'Photography', name: 'Photo', icon: Camera },
  { id: 'Business', name: 'Business', icon: TrendingUp },
  { id: 'Languages', name: 'Languages', icon: Globe },
  { id: 'Arts', name: 'Arts', icon: Target },
];

const sortOptions = [
  { id: 'popularity', name: 'Most Popular' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest' }
];

export default function EnhancedSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [favorites, setFavorites] = useState(new Set<string>());
  const router = useRouter();

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
        // Optionally, set an error state here to show in the UI
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);



  const filterAndSortSkills = useCallback(() => {
    let filtered: Skill[] = [...skills];

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
        // Add other sorting cases like 'newest' if you have timestamps
        default:
          return 0;
      }
    });

    setFilteredSkills(filtered);
  }, [skills, searchTerm, selectedCategory, selectedLevel, sortBy]);

  useEffect(() => {
    filterAndSortSkills();
  }, [searchTerm, selectedCategory, selectedLevel, sortBy, skills, filterAndSortSkills]);

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

  const SkillCard = ({ skill }: { skill: Skill }) => (
    <div className={`group relative bg-white rounded-xl border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-xl border-gray-100`}>
      
      {/* Heart icon for favorites */}
      <button
        onClick={() => toggleFavorite(skill._id)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
      >
        <Heart 
          className={`h-4 w-4 ${favorites.has(skill._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
        />
      </button>

      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-medium">{getAvgRating(skill.teachers)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{skill.learners.length} learners</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
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
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {skill.teachers.length} teacher{skill.teachers.length !== 1 ? 's' : ''} available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {skill.teachers?.slice(0, 3).map((teacher: Teacher) => (
                <Image
                  key={teacher._id}
                  src={teacher.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`}
                  alt={teacher.name}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  width={32}
                  height={32}
                />
              ))}
              {skill.teachers?.length > 3 && (
                <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600 font-medium">
                  +{skill.teachers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
           <button 
                onClick={() => {
                  if (skill.teachers.length > 0) {
                    router.push(`/profile/${skill.teachers[0]._id}`);
                  } else {
                    alert('No teachers available for this skill yet.');
                  }
                }}
                className="w-full text-center bg-blue-500 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Offer a Skill
                <ArrowRight className="h-4 w-4" />
              </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <BrowseSkillsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Next 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Skill</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from passionate experts in our community. Find the perfect teacher for any skill you want to master.
            </p>
          </div>

          {/* Enhanced Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills, teachers, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:border-blue-500 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count and active filters */}
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              <span className="font-semibold">{filteredSkills.length}</span> skills found
            </div>
            {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setSearchTerm('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill: Skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No skills found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}