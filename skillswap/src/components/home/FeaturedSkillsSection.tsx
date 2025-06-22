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
  ArrowRight
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

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredSkills = skills.slice(0, 8); // Show first 8 skills

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Skills to Exchange
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover skills you can teach and learn from our community. Everyone has something valuable to share!
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <div className="col-span-4 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading amazing skills...</p>
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="col-span-4 text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your skills and start exchanging knowledge!
              </p>
              {user && (
                <Link href="/profile">
                  <Button className="group">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Skill
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            filteredSkills.map((skill) => (
              <Card key={skill._id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200">
                <div className="space-y-4">
                  {/* Skill Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {skill.description}
                      </p>
                    </div>
                    <Badge className={getDifficultyColor(skill.level)}>
                      {skill.level}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {skill.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {skill.teachers?.length || 0} teachers
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {skill.learners?.length || 0} learners
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/browse-skills?skill=${skill._id}`}>
                    <Button 
                      className="w-full group"
                    >
                      View Teachers
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Browse All Skills CTA */}
        <div className="text-center">
          <Link href="/skills/browse">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Browse All 12,500+ Skills
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-indigo-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Skill Categories</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">50k+</div>
            <div className="text-gray-600 font-medium">Active Teachers</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-2">98%</div>
            <div className="text-gray-600 font-medium">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Learning Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}