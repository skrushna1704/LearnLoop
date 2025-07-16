'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Star, CheckCircle, Zap, Code, Palette, Music, Camera, Gift, Plus, Search, BookOpen } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export function Hero() {
  const { user } = useAuth();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 lg:mb-6 animate-fade-in">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Join 50,000+ learners & teachers worldwide</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 animate-fade-in-up animate-delay-100">
              Teach & Learn Skills — Together
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 max-w-2xl animate-fade-in-up animate-delay-200">
              Join a global community where you can teach your expertise and learn from others. On LearnLoop, everyone is both a teacher and a learner. Exchange knowledge, grow together, and unlock your full potential!
            </p>
            
            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animate-delay-300 mb-6">
              {user ? (
                // Logged in user actions
                <>
                  <Link href="/browse-skills">
                    <Button size="lg" className="btn-primary group w-full sm:w-auto">
                      <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Find Skills to Learn
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Link href="/profile">
                    <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Share Your Skills
                    </Button>
                  </Link>
                </>
              ) : (
                // Non-logged in user actions
                <>
                  <Link href="/login">
                    <Button size="lg" className="btn-primary group w-full sm:w-auto">
                      Start Teaching & Learning
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                      <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Explore Skills
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-8 lg:mt-12 text-xs sm:text-sm text-gray-500 animate-fade-in-up animate-delay-600">
              <div className="flex items-center space-x-2">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>50k+ users</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Floating Cards */}
          <div className="relative animate-fade-in-up animate-delay-300">
            <div className="grid grid-cols-2 gap-4">
              {/* Skill Cards */}
              <div className="space-y-4">
                <Card className="card-elevated hover-lift p-4 cursor-pointer transition-all duration-300 hover:scale-105">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Code className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Web Development</p>
                        <p className="text-sm text-gray-500">2,500+ learners</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-elevated hover-lift p-4 animate-delay-100 cursor-pointer transition-all duration-300 hover:scale-105">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Palette className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Digital Art</p>
                        <p className="text-sm text-gray-500">1,800+ learners</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4 mt-8">
                <Card className="card-elevated hover-lift p-4 animate-delay-200 cursor-pointer transition-all duration-300 hover:scale-105">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Music className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Music Production</p>
                        <p className="text-sm text-gray-500">1,200+ learners</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-elevated hover-lift p-4 animate-delay-300 cursor-pointer transition-all duration-300 hover:scale-105">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Camera className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Photography</p>
                        <p className="text-sm text-gray-500">980+ learners</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Floating Exchange Indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-16 w-16 rounded-full bg-white shadow-large flex items-center justify-center animate-pulse-glow">
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            {/* Quick Add Skill Button (Floating) */}
            <div className="absolute -bottom-20 -right-5 hidden lg:block">
              <Button
                size="lg"
                className={`rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
                  user ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => setShowQuickAdd(true)}
              >
                <Plus className="h-5 w-5" />
                {user ? 'Add Skills' : 'See How'}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Add Skill Modal */}
        {showQuickAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {user ? 'Add Your Skills' : 'How Skills Work'}
                </h3>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {user ? (
                  // Logged in user - can actually add skills
                  <>
                    <p className="text-gray-600 text-sm">
                      What would you like to add to your profile?
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <Link href="/profile">
                        <Button className="w-full justify-start" variant="outline">
                          <Users className="mr-3 h-5 w-5 text-blue-600" />
                          <div className="text-left">
                            <div className="font-medium">I can teach this</div>
                            <div className="text-sm text-gray-500">Share your expertise with others</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button className="w-full justify-start" variant="outline">
                          <BookOpen className="mr-3 h-5 w-5 text-purple-600" />
                          <div className="text-left">
                            <div className="font-medium">I want to learn this</div>
                            <div className="text-sm text-gray-500">Find teachers for this skill</div>
                          </div>
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => setShowQuickAdd(false)}
                      >
                        Go to Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowQuickAdd(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  // Non-logged in user - show how it works
                  <>
                    <p className="text-gray-600 text-sm">
                      Here&apos;s how you can exchange skills on LearnLoop:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Share Your Skills</p>
                          <p className="text-xs text-gray-500">List what you can teach others</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-purple-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Find Learning Partners</p>
                          <p className="text-xs text-gray-500">Connect with people who can teach you</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-green-600">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Exchange Knowledge</p>
                          <p className="text-xs text-gray-500">Teach and learn without money</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <Link href="/register" className="flex-1">
                        <Button className="w-full">
                          Get Started Free
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => setShowQuickAdd(false)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 