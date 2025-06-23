import React, { useState, useEffect } from 'react';
import { Badge, Card, CardContent, Avatar } from '@/components/ui';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  skill: string;
}

export interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(testimonials.length / 3)) % Math.ceil(testimonials.length / 3));
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
  };

  const visibleTestimonials = testimonials.slice(currentIndex * 3, (currentIndex * 3) + 3);

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Success Stories</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who have transformed their skills through LearnLoop.
          </p>
        </div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-transform hover:scale-110"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-transform hover:scale-110"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Carousel Container */}
          <div className="overflow-hidden px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
              {visibleTestimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="card-elevated hover-lift p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-6 italic text-lg">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                        <img src={testimonial.avatar} alt={testimonial.name} className="rounded-full" />
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                        <Badge variant="outline" className="mt-1 text-xs bg-blue-50">
                          {testimonial.skill}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 