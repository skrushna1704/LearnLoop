// src/components/profile/SkillsManagement.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Star,
  Users,
  CheckCircle,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  X,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { 
  SkillsManagementProps, 
  AddSkillType, 
  SkillLevel 
} from '@/types/profile';
import { 
  SKILL_CATEGORIES, 
  SKILL_LEVELS, 
  POPULAR_SKILLS, 
  SKILL_LEVEL_COLORS 
} from '@/data/constants';

export default function SkillsManagement({
  skills,
  onAddSkill,
  onDeleteSkill,
  onUpdateSkill,
  onRequestVerification,
  editable = true,
  showEndorsements = true,
  className = '',
  type = 'teaching'
}: SkillsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);

  // New skill form state
  const [newSkill, setNewSkill] = useState<AddSkillType>({
    name: '',
    category: 'Technology',
    level: 'Beginner',
    description: '',
    experience: '',
    isPublic: true,
    type
  });

  // Edit form state
  const [editForm, setEditForm] = useState<{
    level: SkillLevel;
    description: string;
    category: string;
  }>({
    level: 'Beginner',
    description: '',
    category: 'Technology'
  });

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || skill.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All Levels' || skill.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [skills, searchTerm, selectedCategory, selectedLevel]);

  // Get skill level color
  const getSkillLevelColor = (level: string) => {
    return SKILL_LEVEL_COLORS[level.toLowerCase() as keyof typeof SKILL_LEVEL_COLORS] || SKILL_LEVEL_COLORS.beginner;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
        return <BookOpen className="h-4 w-4" />;
      case 'design':
        return <Target className="h-4 w-4" />;
      case 'business':
        return <TrendingUp className="h-4 w-4" />;
      case 'languages':
        return <Users className="h-4 w-4" />;
      case 'music':
        return <Star className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Handle add new skill
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    setIsLoading(true);
    try {
      await onAddSkill({
        ...newSkill,
        name: newSkill.name.trim(),
        description: newSkill.description?.trim() || '',
        experience: newSkill.experience?.trim() || ''
      });
      
      setNewSkill({
        name: '',
        category: 'Technology',
        level: 'Beginner',
        description: '',
        experience: '',
        isPublic: true,
        type
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add skill:', error);
      toast.error('Failed to add skill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete skill
  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    setIsLoading(true);
    try {
      await onDeleteSkill(id);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle request verification
  const handleRequestVerification = async (id: string) => {
    if (!onRequestVerification) return;

    setIsLoading(true);
    try {
      await onRequestVerification(id);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick add popular skill
  const handleQuickAdd = (popularSkill: { name: string; category: string }) => {
    setNewSkill(prev => ({
      ...prev,
      name: popularSkill.name,
      category: popularSkill.category
    }));
    setShowAddForm(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Award className="h-6 w-6 mr-2 text-indigo-600" />
            Skills Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your skills and showcase your expertise to the community
          </p>
        </div>
        
        {editable && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {SKILL_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Level Filter */}
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All Levels">All Levels</option>
          {SKILL_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {/* Add Skill Form */}
      {showAddForm && (
        <Card className="p-6 border-2 border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Skill</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name *
              </label>
              <Input
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., JavaScript, Guitar, Photography"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {SKILL_CATEGORIES.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level
              </label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as SkillLevel }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {SKILL_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <Input
                value={newSkill.experience}
                onChange={(e) => setNewSkill(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 2 years, 5+ years"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={newSkill.description}
              onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your experience and what you can teach..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={newSkill.isPublic}
                onChange={(e) => setNewSkill(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                Make this skill visible to other users
              </label>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSkill}
                disabled={isLoading || !newSkill.name.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? (
                  'Adding...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Skill
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Popular Skills Quick Add */}
      {editable && !showAddForm && skills.length === 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Skills - Quick Add
          </h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.map((skill, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(skill)}
                className="hover:border-indigo-300 hover:text-indigo-600"
              >
                <Plus className="h-3 w-3 mr-1" />
                {skill.name}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(skill.category)}
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {skill.name}
                    {skill.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    )}
                  </h3>
                </div>
                
                {editable && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingSkill(skill.id);
                        setEditForm({
                          level: skill.level,
                          description: skill.description || '',
                          category: skill.category
                        });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={`${getSkillLevelColor(skill.level)} border`}>
                    {skill.level}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {skill.category}
                  </span>
                </div>

                {skill.experience && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Experience:</span> {skill.experience}
                  </div>
                )}

                {skill.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {skill.description}
                  </p>
                )}

                {showEndorsements && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{skill.endorsements} endorsements</span>
                    </div>
                    
                    {!skill.verified && onRequestVerification && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestVerification(skill.id)}
                        className="text-xs"
                      >
                        Request Verification
                      </Button>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Updated {new Date(skill.lastUpdated).toLocaleDateString()}</span>
                  {!skill.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      Private
                    </Badge>
                  )}
                </div>
              </div>

              {editingSkill === skill.id && (
                <div className="mt-4">
                  <Card className="p-4 border-2 border-indigo-200 bg-indigo-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Level
                        </label>
                        <select
                          value={editForm.level}
                          onChange={(e) => setEditForm(prev => ({ ...prev, level: e.target.value as SkillLevel }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {SKILL_LEVELS.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {SKILL_CATEGORIES.slice(1).map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setEditingSkill(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={async () => {
                            try {
                              await onUpdateSkill(skill.id, editForm);
                              setEditingSkill(null);
                              toast.success('Skill updated successfully!');
                            } catch (error) {
                              console.error('Failed to update skill:', error);
                              toast.error('Failed to update skill.');
                            }
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {skills.length === 0 ? 'No skills added yet' : 'No skills match your filters'}
          </h3>
          <p className="text-gray-500 mb-6">
            {skills.length === 0 
              ? 'Start building your profile by adding your first skill!' 
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {editable && skills.length === 0 && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}