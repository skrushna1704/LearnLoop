import React from 'react';
import { Badge, Card, CardContent } from '@/components/ui';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface FeaturesProps {
  features: Feature[];
}

export function Features({ features }: FeaturesProps) {
  return (
    <section className="py-12 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <Badge variant="secondary" className="mb-4">Why Choose LearnLoop</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to start learning and teaching
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform makes skill sharing simple, safe, and rewarding for everyone involved.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-elevated hover-lift text-center p-4 sm:p-6">
              <CardContent className="p-0">
                <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                  <feature.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 
 