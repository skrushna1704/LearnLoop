// src/app/(dashboard)/profile/edit/page.tsx - EDIT PROFILE PAGE
'use client';
import React, { useState, useEffect } from 'react';
import { Save, Upload, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Skill = { name: string; level: string; type: string; experience?: string; description?: string; endorsements?: number };

type UserSkill = {
  name?: string;
  level?: string;
  students?: number;
  rating?: number;
  hours?: number;
  experience?: string;
  description?: string;
  endorsements?: number;
  teachers?: number;
  progress?: number;
};

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    profilePicture: ''
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', type: 'teaching', experience: '', description: '', endorsements: 0 });

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.profile?.name || '',
        email: user.email || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        website: user.profile?.website || '',
        linkedin: '',
        github: '',
        profilePicture: user.profile?.profilePicture || ''
      });

      // Initialize skills from user data
      const teachingSkills = (user.skills_offered || []).map(s => {
        const skill = s as UserSkill;
        return {
          name: skill.name || '',
          level: skill.level || 'Beginner',
          type: 'teaching' as const,
          experience: skill.experience || '',
          description: skill.description || '',
          endorsements: skill.endorsements || 0
        };
      });
      const learningSkills = (user.skills_needed || []).map(s => {
        const skill = s as UserSkill;
        return {
          name: skill.name || '',
          level: skill.level || 'Beginner',
          type: 'learning' as const,
          experience: skill.experience || '',
          description: skill.description || ''
        };
      });
      setSkills([...teachingSkills, ...learningSkills]);
    }
  }, [user]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save handler
  const handleSaveProfile = async () => {
    try {
      // Prepare payload
      const payload = {
        profile: {
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          profilePicture: formData.profilePicture,
        },
        skills_offered: skills.filter(s => s.type === 'teaching').map(s => ({
          name: s.name,
          level: s.level,
          experience: s.experience,
          description: s.description,
          endorsements: s.endorsements || 0
        })),
        skills_needed: skills.filter(s => s.type === 'learning').map(s => ({
          name: s.name,
          level: s.level,
          experience: s.experience,
          description: s.description
        })),
      };
      
      await updateProfile(payload);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  // Add skill handler
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills([...skills, newSkill]);
    setNewSkill({ name: '', level: 'Beginner', type: 'teaching', experience: '', description: '', endorsements: 0 });
  };

  // Remove skill handler
  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
        <p className="text-gray-600">Update your profile information and skills</p>
      </div>

      {/* Profile Photo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
        <div className="flex items-center space-x-6">
          <img 
            src={formData.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Shrikrushna"}
            alt="Profile" 
            className="w-20 h-20 rounded-full border-4 border-indigo-100"
          />
          <div className="flex-1">
            <label className="inline-flex items-center cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <span className="px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="City, Country"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell us about yourself and what you're passionate about..."
            />
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Social Links</h2>
        <div className="space-y-4">
          <Input
            label="Website"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            placeholder="https://yourwebsite.com"
          />
          <Input
            label="LinkedIn"
            value={formData.linkedin}
            onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
            placeholder="https://linkedin.com/in/yourprofile"
          />
          <Input
            label="GitHub"
            value={formData.github}
            onChange={(e) => setFormData({...formData, github: e.target.value})}
            placeholder="https://github.com/yourusername"
          />
        </div>
      </Card>

      {/* Skills Management */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        {/* Add Skill Form */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            className="border px-2 py-1 rounded"
            placeholder="Skill name"
            value={newSkill.name}
            onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
          />
          <select
            className="border px-2 py-1 rounded"
            value={newSkill.level}
            onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
          <select
            className="border px-2 py-1 rounded"
            value={newSkill.type}
            onChange={e => setNewSkill({ ...newSkill, type: e.target.value })}
          >
            <option value="teaching">Teaching</option>
            <option value="learning">Learning</option>
          </select>
          <input
            className="border px-2 py-1 rounded"
            placeholder="Experience (e.g., 2 years)"
            value={newSkill.experience}
            onChange={e => setNewSkill({ ...newSkill, experience: e.target.value })}
          />
          <input
            className="border px-2 py-1 rounded"
            placeholder="Description"
            value={newSkill.description}
            onChange={e => setNewSkill({ ...newSkill, description: e.target.value })}
          />
          {newSkill.type === 'teaching' && (
            <input
              className="border px-2 py-1 rounded"
              type="number"
              min={0}
              placeholder="Endorsements"
              value={newSkill.endorsements}
              onChange={e => setNewSkill({ ...newSkill, endorsements: Number(e.target.value) })}
            />
          )}
          <Button onClick={handleAddSkill} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        {/* Skills List */}
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    skill.type === 'teaching' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {skill.type === 'teaching' ? 'Teaching' : 'Learning'}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                    {skill.level}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {skill.experience && <span>Experience: {skill.experience}. </span>}
                  {skill.description && <span>Description: {skill.description}. </span>}
                  {skill.type === 'teaching' && skill.endorsements !== undefined && (
                    <span>Endorsements: {skill.endorsements}</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveSkill(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Link href="/profile">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSaveProfile}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}