// src/components/sections/CTASections.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Users, 
  Star, 
  MessageCircle,
  Gift,
  CheckCircle,
  Clock,
  Shield,
  Globe,
  Heart,
  Sparkles,
  TrendingUp,
  Award,
  Play,
  Mail,
  Bell,
  UserPlus,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import MinimalLogo from '@/components/ui/MinimalLogo';

interface CTASectionsProps {
  className?: string;
}

const CTA: React.FC<CTASectionsProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // How it works steps
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Share your skills and what you want to learn',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Get Matched',
      description: 'Find perfect learning partners in your area',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: MessageCircle,
      title: 'Start Learning',
      description: 'Exchange knowledge and grow together',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Award,
      title: 'Track Progress',
      description: 'Earn certificates and build your reputation',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const benefits = [
    { icon: Gift, text: 'Completely Free' },
    { icon: Clock, text: 'Flexible Schedule' },
    { icon: Shield, text: 'Safe & Verified' },
    { icon: Globe, text: 'Global Community' },
  ];

  return (
    <div className={className}>
      {/* Main CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Join 50,000+ Learners & Teachers Today
          </Badge>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Start Your
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Learning & Teaching Journey?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of passionate learners and teachers who are transforming their skills 
            through the power of peer-to-peer education.
          </p>

          {/* Benefits Grid */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center space-x-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
              >
                <benefit.icon className="h-5 w-5 text-yellow-300" />
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Learning & Teaching Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/how-it-works">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                How It Works
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">Trusted by 50,000+ learners & teachers</span>
            </div>

            <div className="hidden sm:block w-px h-6 bg-white/30" />

            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium ml-2">4.9/5 average rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Getting Started is{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simple
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these 4 easy steps to begin your learning and teaching journey today
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className={`p-6 text-center border-2 transition-all duration-500 hover:shadow-lg hover:-translate-y-2 ${
                  currentStep === index
                    ? 'border-indigo-200 shadow-lg scale-105 bg-gradient-to-br from-indigo-50 to-purple-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} mb-4 transition-all duration-300 ${
                  currentStep === index ? 'scale-110' : ''
                }`}>
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  Step {index + 1}
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h4>
                
                <p className="text-gray-600">
                  {step.description}
                </p>

                {currentStep === index && (
                  <div className="mt-4">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/auth/register">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get Started in 2 Minutes
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <div className="mb-6">
              <MinimalLogo size="md" showTagline={false} layout="horizontal" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Stay in the Learning & Teaching Loop
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get weekly tips, featured skills, and community highlights delivered to your inbox. 
              Join 25,000+ subscribers who are leveling up their skills.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 whitespace-nowrap">
                  <Bell className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </form>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-lg py-3 px-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Thanks for subscribing!</span>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Your Learning & Teaching Journey Starts Today
          </h3>
          <p className="text-lg text-white/90 mb-6">
            Join the community that&apos;s revolutionizing how we learn and teach
          </p>
          <Link href="/auth/register">
            <Button 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Learning & Teaching Free Today
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CTA;