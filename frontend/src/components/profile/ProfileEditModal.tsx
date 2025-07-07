// src/components/profile/ProfileEditModal.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';


// Validation schema
const profileEditSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().optional(),
  twitter: z.string().optional()
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bio?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    skills: Array<{
      name: string;
      level: string;
      verified: boolean;
      endorsements: number;
    }>;
    interests: string[];
  };
  onSave: (data: ProfileEditFormData & { skills: Array<{ name: string; level: string; verified: boolean; endorsements: number }>; interests: string[] }) => Promise<void>;
}

export default function ProfileEditModal({ 
  isOpen, 
  onClose, 
  userData, 
  onSave 
}: ProfileEditModalProps) {
  const [currentTab, setCurrentTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Skills and interests state
  const [skills, setSkills] = useState(userData.skills || []);
  const [interests, setInterests] = useState(userData.interests || []);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [newInterest, setNewInterest] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      bio: userData.bio || '',
      location: userData.location || '',
      website: userData.website || '',
      linkedin: userData.linkedin || '',
      twitter: userData.twitter || ''
    }
  });

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: User },
    { id: 'skills', name: 'Skills', icon: Edit3 },
    { id: 'interests', name: 'Interests', icon: Plus }
  ];

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const onSubmit = async (data: ProfileEditFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const profileData = {
        ...data,
        skills,
        interests
      };

      await onSave(profileData);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() && !skills.find(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
      setSkills([...skills, { 
        ...newSkill, 
        verified: false, 
        endorsements: 0 
      }]);
      setNewSkill({ name: '', level: 'Beginner' });
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'advanced':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'beginner':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Info Tab */}
            {currentTab === 'basic' && (
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        {...register('firstName')}
                        placeholder="First name"
                        className={`pl-10 ${errors.firstName ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      {...register('lastName')}
                      placeholder="Last name"
                      className={errors.lastName ? 'border-red-300' : ''}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 ${errors.email ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        {...register('phone')}
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>
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
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    placeholder="Tell us about yourself, your interests, and what you love to teach..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <Input
                      {...register('website')}
                      placeholder="https://yourwebsite.com"
                      className={errors.website ? 'border-red-300' : ''}
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <Input
                      {...register('linkedin')}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {currentTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Your Skills</h3>
                  <p className="text-gray-600 mb-6">
                    Add skills you can teach others. Be specific and choose the appropriate level.
                  </p>
                </div>

                {/* Add New Skill */}
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Skill</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="Skill name (e.g., JavaScript, Guitar, Cooking)"
                      className="flex-1"
                    />
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      disabled={!newSkill.name.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </Card>

                {/* Current Skills */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Your Skills ({skills.length})</h4>
                  {skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map((skill, index) => (
                        <div 
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{skill.name}</h5>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSkill(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={`${getSkillLevelColor(skill.level)} border`}>
                              {skill.level}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {skill.endorsements} endorsements
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No skills added yet. Add your first skill above!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Interests Tab */}
            {currentTab === 'interests' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Interests</h3>
                  <p className="text-gray-600 mb-6">
                    Add topics and skills you&apos;d like to learn. This helps us match you with the right teachers.
                  </p>
                </div>

                {/* Add New Interest */}
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Interest</h4>
                  <div className="flex gap-3">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="What would you like to learn? (e.g., Python, Photography, Spanish)"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                    />
                    <Button
                      type="button"
                      onClick={handleAddInterest}
                      disabled={!newInterest.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </Card>

                {/* Current Interests */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Your Interests ({interests.length})</h4>
                  {interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest, index) => (
                        <Badge 
                          key={index}
                          className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 flex items-center space-x-2"
                        >
                          <span>{interest}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(index)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No learning interests added yet. Add your first interest above!
                    </p>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => reset()}
              variant="outline"
              disabled={isLoading || !isDirty}
            >
              Reset Changes
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}