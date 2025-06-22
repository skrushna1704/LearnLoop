'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft,
  User,
  BookOpen,
  MessageSquare,
  Clock,
  Calendar,
  Video,
  Phone,
  MessageCircle,
  Users,
  Plus,
  X,
  Loader,
  CheckCircle,
  AlertCircle,
  Search,
  Star,
  MapPin,
  Check,
  Sparkles,
  Send
} from 'lucide-react';
import { debounce } from 'lodash';
import { cn } from '@/utils/helpers';

interface User {
  _id: string;
  name?: string;
  profile: {
    profilePicture?: string;
    role?: string;
    rating?: number;
    verified?: boolean;
  };
  skills?: Array<{
    _id: string;
    name: string;
    level: string;
  }>;
}

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: string;
}

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface FormData {
  receiverId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  message: string;
  proposedDuration: number;
  preferredTimes: TimeSlot[];
  sessionType: 'video' | 'in-person' | 'phone' | 'chat';
  location: string;
}

const sessionTypeOptions = [
  { 
    value: 'video', 
    label: 'Video Call', 
    icon: Video, 
    description: 'Online video session',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    value: 'in-person', 
    label: 'In Person', 
    icon: Users, 
    description: 'Meet face-to-face',
    color: 'from-green-500 to-green-600'
  },
  { 
    value: 'phone', 
    label: 'Phone Call', 
    icon: Phone, 
    description: 'Voice call only',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    value: 'chat', 
    label: 'Chat Only', 
    icon: MessageCircle, 
    description: 'Text-based exchange',
    color: 'from-orange-500 to-orange-600'
  },
];

const steps = [
  { id: 1, title: 'Choose Partner', icon: User, description: 'Find your exchange partner' },
  { id: 2, title: 'Select Skills', icon: BookOpen, description: 'Choose skills to exchange' },
  { id: 3, title: 'Session Details', icon: Clock, description: 'Set meeting preferences' },
  { id: 4, title: 'Schedule', icon: Calendar, description: 'Pick available times' },
  { id: 5, title: 'Message', icon: MessageSquare, description: 'Write your proposal' },
];

export default function EnhancedNewExchangePage() {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    receiverId: '',
    offeredSkillId: '',
    requestedSkillId: '',
    message: '',
    proposedDuration: 60,
    preferredTimes: [{ date: '', startTime: '', endTime: '' }],
    sessionType: 'video',
    location: '',
  });

  const fetchUsers = async (query: string = '') => {
    setSearching(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?search=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Could not load users. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  useEffect(() => {
    fetchUsers(); // Initial fetch

    const fetchMySkills = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token');

        // This should be adapted to fetch the logged-in user's skills
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`, {
           headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch skills');
        const data = await response.json();
        setMySkills(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Could not load your skills.');
        }
      }
    };
    fetchMySkills();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      debouncedFetchUsers(searchTerm);
    } else {
      fetchUsers(); // fetch all users if search term is cleared
    }
  }, [searchTerm, debouncedFetchUsers]);

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle time slot changes
  const handleTimeSlotChange = (index: number, field: keyof TimeSlot, value: string) => {
    const newTimes = [...formData.preferredTimes];
    newTimes[index] = { ...newTimes[index], [field]: value };
    setFormData(prev => ({ ...prev, preferredTimes: newTimes }));
  };

  // Add new time slot
  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      preferredTimes: [...prev.preferredTimes, { date: '', startTime: '', endTime: '' }]
    }));
  };

  // Remove time slot
  const removeTimeSlot = (index: number) => {
    if (formData.preferredTimes.length > 1) {
      const newTimes = formData.preferredTimes.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, preferredTimes: newTimes }));
    }
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormData(prev => ({ ...prev, receiverId: user._id }));
    setSearchTerm('');
    setCurrentStep(2);
  };

  // Check if step is complete
  const isStepComplete = (stepId: number) => {
    switch (stepId) {
      case 1: return !!formData.receiverId;
      case 2: return !!formData.offeredSkillId && !!formData.requestedSkillId;
      case 3: return !!formData.sessionType && !!formData.proposedDuration;
      case 4: return formData.preferredTimes.some(slot => slot.date && slot.startTime && slot.endTime);
      case 5: return formData.message.length >= 10;
      default: return false;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token');

      const finalData = { ...formData };
      // We might not need to send all data, can be optimized
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchanges`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit the proposal.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-md mx-4">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Proposal Sent! 🎉</h2>
          <p className="text-gray-600 mb-6">Your exchange proposal has been successfully sent. You&apos;ll be notified when they respond.</p>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
              View My Exchanges
            </button>
            <button className="w-full text-gray-600 hover:text-gray-800 font-medium">
              Send Another Proposal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Exchanges
          </button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Start New Exchange
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Share Knowledge,
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Learn Together</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Propose a skill exchange with another learner and grow together through mutual teaching.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = isStepComplete(step.id);
                const isAccessible = step.id <= currentStep || isCompleted;
                
                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => isAccessible && setCurrentStep(step.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                          : isCompleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                      disabled={!isAccessible}
                    >
                      <div className="relative">
                        {isCompleted && !isActive ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                        {isActive && (
                          <div className="absolute -inset-1 bg-white/30 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-center min-w-0">
                        {step.title}
                      </span>
                    </button>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 transition-colors duration-300 ${
                        isStepComplete(step.id) ? 'bg-green-400' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Choose Partner */}
          {currentStep === 1 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Exchange Partner</h2>
                <p className="text-gray-500">Find someone whose skills complement yours</p>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or skill..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searching && <Loader className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />}
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                    <p className="mt-2 text-gray-500">Loading potential partners...</p>
                  </div>
                ) : users.length > 0 ? (
                  users.map(user => (
                    <div
                      key={user._id}
                      className="flex items-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={user.profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name || 'User profile'}
                        className="w-16 h-16 rounded-full mr-4 border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{user.profile?.rating || 'N/A'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{user.profile?.role || 'Learner'}</p>
                        <div className="flex flex-wrap gap-2">
                          {user.skills?.slice(0, 3).map(skill => (
                            <span key={skill._id} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                              {skill.name}
                            </span>
                          ))}
                          {user.skills && user.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full font-medium">
                              +{user.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">No users found</h3>
                    <p className="text-gray-500">Try adjusting your search or check back later.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Skills */}
          {currentStep === 2 && selectedUser && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-green-100 text-green-600 rounded-full mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Skills for Exchange</h2>
                <p className="text-gray-500">
                  You&apos;re teaching one of your skills and learning one of {selectedUser.name?.split(' ')[0]}&apos;s skills.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <div className="flex-1 space-y-4">
                    <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" /> You&apos;ll teach...</h3>
                    <div className="space-y-3">
                      {mySkills.length > 0 ? mySkills.map(skill => (
                        <div
                          key={skill._id}
                          onClick={() => handleInputChange('offeredSkillId', skill._id)}
                          className={cn(
                            "p-4 rounded-xl border cursor-pointer transition-all",
                            formData.offeredSkillId === skill._id
                              ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-gray-900">{skill.name}</h4>
                              <p className="text-sm text-gray-500">{skill.level}</p>
                            </div>
                            {formData.offeredSkillId === skill._id && (
                              <CheckCircle className="w-6 h-6 text-purple-500" />
                            )}
                          </div>
                        </div>
                      )) : <p className="text-gray-500">You have no skills to offer. Please add skills to your profile.</p>}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
                    You want to learn...
                  </h3>
                  <div className="space-y-3">
                    {selectedUser.skills && selectedUser.skills.length > 0 ? (
                      selectedUser.skills.map(skill => (
                        <div
                          key={skill._id}
                          onClick={() => handleInputChange('requestedSkillId', skill._id)}
                          className={cn(
                            'flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2',
                            formData.requestedSkillId === skill._id ? 
                              'border-purple-500 bg-purple-50 text-purple-700' : 
                              'border-gray-300 bg-white hover:border-purple-400'
                          )}
                        >
                          <div className="flex-1">
                            <p className="font-semibold">{skill.name}</p>
                            <p className="text-sm text-gray-500">{skill.level}</p>
                          </div>
                          {formData.requestedSkillId === skill._id && <CheckCircle className="w-6 h-6 text-purple-500" />}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">{selectedUser.name} hasn&apos;t listed any skills to teach yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Session Details */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Preferences</h2>
                <p className="text-gray-600">How would you like to meet and for how long?</p>
              </div>
              
              <div className="space-y-8">
                {/* Session Type */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Type</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {sessionTypeOptions.map(option => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange('sessionType', option.value)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                            formData.sessionType === option.value
                              ? 'border-blue-500 bg-gradient-to-r ' + option.color + ' text-white shadow-lg scale-105'
                              : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                          }`}
                        >
                          <Icon className="w-8 h-8 mx-auto mb-3" />
                          <h4 className="font-semibold mb-1">{option.label}</h4>
                          <p className="text-sm opacity-75">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration and Location */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      <Clock className="w-5 h-5 mr-2" />
                      Duration
                    </label>
                    <p className="text-sm text-gray-500 mb-2">How long will the session be?</p>
                    <div className="relative">
                      <input
                        id="duration"
                        type="range"
                        min="15"
                        max="180"
                        step="15"
                        value={formData.proposedDuration}
                        onChange={(e) => handleInputChange('proposedDuration', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center mt-2 font-medium text-blue-600">
                        {formData.proposedDuration} minutes
                      </div>
                    </div>
                  </div>

                  {formData.sessionType === 'in-person' && (
                    <div>
                      <label className="text-lg font-semibold text-gray-800 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Location (for in-person)
                      </label>
                      <p className="text-sm text-gray-500 mb-2">
                        Only required if you&apos;re meeting in person.
                      </p>
                      <input
                        id="location"
                        type="text"
                        placeholder="e.g. 'Central Park Cafe' or 'Online'"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={formData.sessionType !== 'in-person'}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferred Times */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Your Session</h2>
                <p className="text-gray-600">When are you available for the exchange?</p>
              </div>
              
              <div className="space-y-6">
                {formData.preferredTimes.map((timeSlot, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Time Option {index + 1}
                      </h3>
                      {formData.preferredTimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={timeSlot.date}
                          onChange={(e) => handleTimeSlotChange(index, 'date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={timeSlot.startTime}
                          onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <input
                          type="time"
                          value={timeSlot.endTime}
                          onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Time Option
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Message */}
          {currentStep === 5 && (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Write Your Proposal</h2>
                <p className="text-gray-600">Introduce yourself and explain your exchange idea</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Hi! I'd love to exchange skills with you. I can teach you [your skill] and would love to learn [their skill] from you. Here's what I'm thinking..."
                    rows={8}
                    maxLength={1000}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none text-lg"
                  />
                  <div className="absolute bottom-4 right-6 text-sm text-gray-400">
                    {formData.message.length}/1000
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Minimum 10 characters required
                  </span>
                  <div className={`text-sm font-medium ${
                    formData.message.length >= 10 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {formData.message.length >= 10 ? '✓ Good to go!' : 'Keep writing...'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex gap-3">
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepComplete(currentStep)}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg"
                >
                  Next Step
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !isStepComplete(5)}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg text-lg"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Proposal 🚀
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}