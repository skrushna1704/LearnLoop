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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
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
      className={`py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-white ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Learners Worldwide
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of passionate learners who are transforming their skills 
            and building meaningful connections through LearnLoop.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 lg:mb-20">
          {stats.map((stat, index) => {
            const animatedValue = [animatedValue1, animatedValue2, animatedValue3, animatedValue4][index];
            
            return (
              <Card
                key={stat.label}
                className="p-4 sm:p-6 text-center border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full ${stat.bgColor} mb-3 sm:mb-4`}>
                  <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                </div>
                
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {animatedValue.toLocaleString()}{stat.suffix}
                </div>
                
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <div className="relative">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from learners and teachers who have transformed their skills through LearnLoop
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={`${testimonial.id}-${index}`}
                    className={`w-full flex-shrink-0 ${
                      index === currentTestimonial ? 'block' : 'hidden'
                    }`}
                  >
                    <Card className="p-6 sm:p-8 text-center border-2 border-gray-100">
                      <div className="flex justify-center mb-4">
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      
                      <blockquote className="text-base sm:text-lg text-gray-700 mb-6 italic">
                        &ldquo;{testimonial.text}&rdquo;
                      </blockquote>
                      
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="text-2xl sm:text-3xl">{testimonial.avatar}</div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-600">{testimonial.role}</div>
                          <div className="text-xs text-gray-500">{testimonial.location}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="font-medium text-green-800 mb-1">Learning:</div>
                          <div className="text-green-700">
                            {testimonial.skillsLearned.join(', ')}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="font-medium text-blue-800 mb-1">Teaching:</div>
                          <div className="text-blue-700">
                            {testimonial.skillsTaught.join(', ')}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 lg:-translate-x-8 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 lg:translate-x-8 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.slice(0, 4).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-indigo-600 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
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
              {/* <Heart className="h-4 w-4" /> */}
              <span>4.9/5 User Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;