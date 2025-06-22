// src/app/how-it-works/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Users, 
  BookOpen, 
  Star, 
  MessageCircle, 
  CheckCircle,
  Lightbulb,
  Target,
  Zap,
  Heart,
  Award
} from 'lucide-react';
import { Testimonials } from '@/components/home/Testimonials';
import {testimonials,} from '@/data/mockdata';

const HowItWorksPage = () => {
  const steps = [
    {
      number: "01",
      title: "Share Your Skills",
      description: "Create a profile showcasing what you can teach. Whether it's coding, cooking, music, or any skill you're passionate about.",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      number: "02", 
      title: "Find Learning Partners",
      description: "Browse skills you want to learn and connect with teachers who need to learn what you offer. It's a perfect match!",
      icon: <Users className="w-8 h-8" />,
      color: "from-indigo-500 to-purple-600"
    },
    {
      number: "03",
      title: "Exchange Knowledge",
      description: "Schedule sessions where you teach your skill and learn theirs. Both of you grow and benefit from the exchange.",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600"
    },
    {
      number: "04",
      title: "Build Your Network",
      description: "Rate experiences, build relationships, and create a network of lifelong learners and teachers in your community.",
      icon: <Star className="w-8 h-8" />,
      color: "from-pink-500 to-red-500"
    }
  ];

  const benefits = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Learn by Teaching",
      description: "Teaching others reinforces your own knowledge and reveals new perspectives."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Learning",
      description: "One-on-one exchanges tailored to your pace and learning style."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Cost-Effective",
      description: "No money changes hands - trade skills instead of paying for courses."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Build Community",
      description: "Connect with like-minded people in your area and build lasting relationships."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Gain Confidence",
      description: "Teaching builds confidence while learning keeps you growing."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Mutual Benefit",
      description: "Both participants gain value, creating meaningful win-win exchanges."
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-800 text-sm font-medium mb-8">
            <Lightbulb className="w-4 h-4 mr-2" />
            Learn by Teaching • Teach by Learning
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            How
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> LearnLoop </span>
            Works
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover how our unique skill-sharing platform connects learners and teachers 
            in meaningful exchanges that benefit everyone involved.
          </p>
          
          {/* Floating Cards Animation */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl opacity-20 animate-bounce"></div>
            <div className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-10 left-5 w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg opacity-25 animate-ping"></div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Steps to Success</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of learners and teachers in our thriving community
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden xl:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200 z-0"></div>
                )}
                
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  
                  {/* Hover Arrow */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LearnLoop?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the benefits of peer-to-peer learning and teaching
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-6 h-full hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how LearnLoop has transformed learning experiences
            </p>
          </div>
          
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of learners and teachers who are already transforming their skills through meaningful exchanges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </Link>
            <Link href="/skills/browse">
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300">
                Browse Skills
              </button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center mt-8 space-x-8 text-indigo-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Safe & secure</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;