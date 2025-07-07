// src/app/auth/setup-profile/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  MapPin, 
  BookOpen, 
  Camera, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  X,
  Plus,
  Sparkles,
  Clock,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import MinimalLogo from '@/components/ui/MinimalLogo';
import { profileSetupSchema } from '@/utils/validation';
import type { ProfileSetupFormData } from '@/utils/validation';
import Image from 'next/image';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    mode: 'onChange',
    defaultValues: {
      skills: [],
      interests: [],
      availability: 'flexible'
    }
  });

  // Popular skills for selection
  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Web Design', 'Photography',
    'Digital Marketing', 'Writing', 'Spanish', 'French', 'Guitar', 'Piano',
    'Cooking', 'Yoga', 'Drawing', 'Video Editing', 'Public Speaking', 'Excel',
    'Data Analysis', 'Project Management', 'Graphic Design', 'SEO',
    'Social Media', 'Content Creation', 'UI/UX Design', 'Machine Learning'
  ];

  // Learning interests categories
  const interestCategories = [
    'Technology', 'Languages', 'Arts & Crafts', 'Music', 'Sports & Fitness',
    'Business', 'Cooking', 'Photography', 'Writing', 'Design', 'Marketing',
    'Personal Development', 'Health & Wellness', 'Travel', 'Science'
  ];

  const steps = [
    {
      id: 1,
      title: 'Basic Info',
      description: 'Tell us about yourself',
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      title: 'Your Skills',
      description: 'What can you teach?',
      icon: BookOpen,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      title: 'Learning Goals',
      description: 'What do you want to learn?',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 4,
      title: 'Availability',
      description: 'When can you learn/teach?',
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillToggle = (skill: string) => {
    const updated = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(updated);
    setValue('skills', updated);
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      const updated = [...selectedSkills, customSkill.trim()];
      setSelectedSkills(updated);
      setValue('skills', updated);
      setCustomSkill('');
    }
  };

  const handleInterestToggle = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(updated);
    setValue('interests', updated);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof ProfileSetupFormData)[] => {
    switch (step) {
      case 1:
        return ['bio', 'location'];
      case 2:
        return ['skills'];
      case 3:
        return ['interests', 'goals'];
      case 4:
        return ['availability'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: ProfileSetupFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Profile setup data:', {
        ...data,
        avatar: avatarPreview,
        skills: selectedSkills,
        interests: selectedInterests
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      console.error('Profile setup failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 overflow-hidden">
                  {avatarPreview ? (
                    <Image 
                      src={avatarPreview} 
                      alt="Avatar" 
                      width={96}
                      height={96}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    'U'
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600">Upload your profile picture</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about yourself
              </label>
              <textarea
                {...register('bio')}
                placeholder="Share a bit about your background, interests, and what makes you excited about learning..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={4}
              />
              {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register('location')}
                  placeholder="City, State/Country"
                  className="pl-10"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What skills can you teach others?
              </h3>
              <p className="text-gray-600 mb-4">
                Select skills you&apos;re comfortable teaching or sharing with others.
              </p>
            </div>

            {/* Skill Selection */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSkillToggle(skill)}
                    className={selectedSkills.includes(skill) 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                      : "hover:border-indigo-300"
                    }
                  >
                    {skill}
                    {selectedSkills.includes(skill) && (
                      <CheckCircle className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                ))}
              </div>

              {/* Add Custom Skill */}
              <div className="flex space-x-2">
                <Input
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add a custom skill..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                />
                <Button
                  type="button"
                  onClick={handleAddCustomSkill}
                  disabled={!customSkill.trim()}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Skills ({selectedSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 cursor-pointer hover:bg-indigo-200"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {errors.skills && <p className="text-sm text-red-600">{errors.skills.message}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What would you like to learn?
              </h3>
              <p className="text-gray-600 mb-4">
                Select areas you&apos;re interested in learning about.
              </p>
            </div>

            {/* Interest Categories */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {interestCategories.map((interest) => (
                  <Button
                    key={interest}
                    type="button"
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInterestToggle(interest)}
                    className={selectedInterests.includes(interest) 
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white" 
                      : "hover:border-green-300"
                    }
                  >
                    {interest}
                    {selectedInterests.includes(interest) && (
                      <CheckCircle className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                ))}
              </div>

              {/* Selected Interests */}
              {selectedInterests.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Learning Interests ({selectedInterests.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <Badge
                        key={interest}
                        className="bg-green-100 text-green-700 px-3 py-1 cursor-pointer hover:bg-green-200"
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Learning Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are your learning goals?
              </label>
              <textarea
                {...register('goals')}
                placeholder="Describe what you hope to achieve through LearnLoop..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={3}
              />
              {errors.goals && <p className="mt-1 text-sm text-red-600">{errors.goals.message}</p>}
            </div>

            {errors.interests && <p className="text-sm text-red-600">{errors.interests.message}</p>}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                When are you available?
              </h3>
              <p className="text-gray-600 mb-4">
                Let us know your general availability for learning sessions.
              </p>
            </div>

            {/* Availability Options */}
            <div className="space-y-3">
              {[
                { value: 'weekdays', label: 'Weekdays Only', desc: 'Monday - Friday' },
                { value: 'weekends', label: 'Weekends Only', desc: 'Saturday & Sunday' },
                { value: 'evenings', label: 'Evenings', desc: 'After 6 PM' },
                { value: 'flexible', label: 'Flexible', desc: 'Any time works' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    {...register('availability')}
                    value={option.value}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {errors.availability && <p className="text-sm text-red-600">{errors.availability.message}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0ibTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <MinimalLogo size="md" showTagline={false} layout="horizontal" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Tell us what you want to learn and teach to personalize your LearnLoop experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Info */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={currentStep === 1 ? 'invisible' : ''}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Sparkles className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip for now - I&apos;ll complete this later
          </button>
        </div>
      </div>
    </div>
  );
}