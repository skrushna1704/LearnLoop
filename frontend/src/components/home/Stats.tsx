// src/components/sections/StatsTestimonialsSection.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Star, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Award,
  Globe,
  TrendingUp,
  Heart,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface StatsTestimonialsSectionProps {
  className?: string;
}

// Animated counter hook
const useAnimatedCounter = (targetValue: number, inView: boolean, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * targetValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetValue, duration, inView]);

  return count;
};

const Stats: React.FC<StatsTestimonialsSectionProps> = ({ className }) => {
  const [inView, setInView] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Stats data with animation counters
  const stats = [
    {
      icon: Users,
      value: 50000,
      label: 'Active Learners',
      suffix: '+',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: BookOpen,
      value: 12500,
      label: 'Skills Shared',
      suffix: '+',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: MessageCircle,
      value: 250000,
      label: 'Learning Sessions',
      suffix: '+',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: Globe,
      value: 125,
      label: 'Countries',
      suffix: '',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'UX Designer',
      location: 'San Francisco, CA',
      avatar: '👩‍💻',
      rating: 5,
      text: "LearnLoop transformed how I learn new skills. I taught web design and learned data analysis in return. The community is incredibly supportive and knowledgeable!",
      skillsLearned: ['Data Analysis', 'Python', 'SQL'],
      skillsTaught: ['UX Design', 'Figma', 'User Research'],
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Software Engineer',
      location: 'Austin, TX',
      avatar: '👨‍💻',
      rating: 5,
      text: "Amazing platform! I've learned Spanish and photography while teaching programming. The skill exchange system is brilliant - no money needed, just passion for learning.",
      skillsLearned: ['Spanish', 'Photography', 'Digital Marketing'],
      skillsTaught: ['React', 'Node.js', 'DevOps'],
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Marketing Manager',
      location: 'Mumbai, India',
      avatar: '👩‍💼',
      rating: 5,
      text: "The best learning platform I've ever used. I've connected with amazing people worldwide and gained skills that boosted my career. Highly recommend LearnLoop!",
      skillsLearned: ['Graphic Design', 'Video Editing', 'Content Writing'],
      skillsTaught: ['Digital Marketing', 'SEO', 'Social Media'],
    },
    {
      id: 4,
      name: 'Ahmed Hassan',
      role: 'Graphic Designer',
      location: 'Dubai, UAE',
      avatar: '👨‍🎨',
      rating: 5,
      text: "LearnLoop made learning accessible and fun. The community feels like family, and the skill matches are perfect. I've grown both personally and professionally.",
      skillsLearned: ['3D Modeling', 'Animation', 'UI Design'],
      skillsTaught: ['Illustration', 'Branding', 'Adobe Creative Suite'],
    },
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'UX Designer',
      location: 'San Francisco, CA',
      avatar: '👩‍💻',
      rating: 5,
      text: "LearnLoop transformed how I learn new skills. I taught web design and learned data analysis in return. The community is incredibly supportive and knowledgeable!",
      skillsLearned: ['Data Analysis', 'Python', 'SQL'],
      skillsTaught: ['UX Design', 'Figma', 'User Research'],
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Software Engineer',
      location: 'Austin, TX',
      avatar: '👨‍💻',
      rating: 5,
      text: "Amazing platform! I've learned Spanish and photography while teaching programming. The skill exchange system is brilliant - no money needed, just passion for learning.",
      skillsLearned: ['Spanish', 'Photography', 'Digital Marketing'],
      skillsTaught: ['React', 'Node.js', 'DevOps'],
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Marketing Manager',
      location: 'Mumbai, India',
      avatar: '👩‍💼',
      rating: 5,
      text: "The best learning platform I've ever used. I've connected with amazing people worldwide and gained skills that boosted my career. Highly recommend LearnLoop!",
      skillsLearned: ['Graphic Design', 'Video Editing', 'Content Writing'],
      skillsTaught: ['Digital Marketing', 'SEO', 'Social Media'],
    },
    {
      id: 4,
      name: 'Ahmed Hassan',
      role: 'Graphic Designer',
      location: 'Dubai, UAE',
      avatar: '👨‍🎨',
      rating: 5,
      text: "LearnLoop made learning accessible and fun. The community feels like family, and the skill matches are perfect. I've grown both personally and professionally.",
      skillsLearned: ['3D Modeling', 'Animation', 'UI Design'],
      skillsTaught: ['Illustration', 'Branding', 'Adobe Creative Suite'],
    },
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Call hooks at component level
  const animatedValue1 = useAnimatedCounter(stats[0].value, inView);
  const animatedValue2 = useAnimatedCounter(stats[1].value, inView);
  const animatedValue3 = useAnimatedCounter(stats[2].value, inView);
  const animatedValue4 = useAnimatedCounter(stats[3].value, inView);

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  return (
    <section 
      ref={sectionRef}
      className={`py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Learners Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of passionate learners who are transforming their skills 
            and building meaningful connections through LearnLoop.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const animatedValue = [animatedValue1, animatedValue2, animatedValue3, animatedValue4][index];
            
            return (
              <Card
                key={stat.label}
                className={`text-center p-6 bg-white border border-gray-100 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {animatedValue.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h3>
            <p className="text-lg text-gray-600">
              Real stories from real learners who&apos;ve transformed their skills
            </p>
          </div>

          {/* Main Testimonial */}
          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-white p-8 md:p-12 shadow-xl border-0 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-16 -mt-16 opacity-50" />
              
              {/* Quote Icon */}
              <Quote className="absolute top-6 left-6 h-8 w-8 text-indigo-200" />
              
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
                  &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                </blockquote>

                {/* User Info */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-center md:text-left">
                      <div className="font-semibold text-gray-900 text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].role}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonials[currentTestimonial].location}
                      </div>
                    </div>
                  </div>

                  {/* Skills Exchange */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="text-center md:text-left">
                      <div className="font-medium text-green-700 mb-1">Skills Learned</div>
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].skillsLearned.join(', ')}
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="font-medium text-blue-700 mb-1">Skills Taught</div>
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].skillsTaught.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="rounded-full w-12 h-12 p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              {/* Dots */}
              <div className="flex space-x-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="rounded-full w-12 h-12 p-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4 opacity-60">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
              <Award className="h-4 w-4" />
              <span>Featured in TechCrunch</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>#1 Learning Platform</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
              <Heart className="h-4 w-4" />
              <span>4.9/5 User Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;