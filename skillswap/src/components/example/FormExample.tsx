'use client'
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const FormExample: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Selected option:', selectedOption);
    console.log('Feedback:', feedback);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent>
        <CardTitle>Feedback Form</CardTitle>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <Label htmlFor="experience" required>
              How was your experience?
            </Label>
            <RadioGroup 
              value={selectedOption} 
              onValueChange={setSelectedOption}
              className="mt-2"
            >
              <RadioGroupItem 
                value="excellent" 
                label="Excellent"
                description="Very satisfied with the service"
              />
              <RadioGroupItem 
                value="good" 
                label="Good"
                description="Generally satisfied"
              />
              <RadioGroupItem 
                value="fair" 
                label="Fair"
                description="Somewhat satisfied"
              />
              <RadioGroupItem 
                value="poor" 
                label="Poor"
                description="Not satisfied at all"
              />
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="feedback">
              Additional Comments
            </Label>
            <Textarea
              id="feedback"
              placeholder="Please share your thoughts..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 