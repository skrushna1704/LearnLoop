import React from 'react';
import { Badge, ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Step {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface HowItWorksProps {
  steps: Step[];
}

export function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How LearnLoop Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in just three simple steps and begin your learning journey today.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl mr-4">
                  {step.step}
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
              
              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 text-gray-300">
                  <ChevronRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 