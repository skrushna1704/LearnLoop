// src/components/sections/FeaturedSkillsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { 
  BookOpen, 
  Users, 
  ChevronRight,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { getAllSkills } from '@/data/api/skills';

interface Skill {
  _id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  tags?: string[];
  teachers?: string[];
  learners?: string[];
  trending?: boolean;
}

export function FeaturedSkillsSection() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const fetchedSkills = await getAllSkills();
      setSkills(fetchedSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-700';
    
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredSkills = skills.slice(0, 8); // Show first 8 skills

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />
            SKILL EXCHANGE PLATFORM
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
            Popular Skills to{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Exchange
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover skills you can teach and learn from our vibrant community. Everyone has something valuable to share!
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto relative mb-12 lg:mb-16">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 lg:mb-16">
          {loading ? (
            <div className="col-span-full text-center py-12 lg:py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4 lg:mb-6"></div>
                <div className="absolute inset-0 rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-200 border-t-purple-600 mx-auto animate-spin animate-reverse"></div>
              </div>
              <p className="text-gray-600 text-base sm:text-lg">Loading amazing skills...</p>
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="col-span-full text-center py-12 lg:py-20">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-6 sm:p-8 w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 lg:mb-8 flex items-center justify-center">
                <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-indigo-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No skills found</h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto">
                Be the first to share your skills and start exchanging knowledge with our community!
              </p>
              {user && (
                <Link href="/profile">
                  <Button className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Add Your First Skill
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            filteredSkills.map((skill) => (
              <Card key={skill._id} className="justify-center group relative p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-indigo-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 overflow-hidden">
                {/* Trending indicator */}
                {skill.trending && (
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="space-y-4 sm:space-y-6 relative z-10">
                  {/* Skill Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-900 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                    <Badge className={`${getDifficultyColor(skill.level)} border font-semibold px-2 sm:px-3 py-1 text-xs`}>
                      {skill.level || 'Not specified'}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {skill.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full font-medium transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-3 sm:gap-6">
                      <span className="flex items-center gap-1 sm:gap-2 bg-blue-50 px-2 sm:px-3 py-1 rounded-full">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="font-medium text-blue-700">{skill.teachers?.length || 0} teachers</span>
                      </span>
                      <span className="flex items-center gap-1 sm:gap-2 bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        <span className="font-medium text-green-700">{skill.learners?.length || 0} learners</span>
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {user ? (
                    <Link href={`/browse-skills?skill=${skill._id}`}>
                      <Button 
                        className="w-full group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                      >
                        View Teachers
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button 
                        className="mt-4 w-full group bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                      >
                        Login to View
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                      </Button> 
                    </Link>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Browse All Skills CTA */}
        <div className="text-center mb-12 lg:mb-20">
          <Link href="/skills/browse">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-2xl"
            >
              Browse All 12,500+ Skills
              <ChevronRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
          <div className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">500+</div>
              <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">Skill Categories</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3">50k+</div>
              <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">Active Teachers</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 sm:mb-3">98%</div>
              <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">Success Rate</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-2 sm:mb-3">125</div>
              <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}