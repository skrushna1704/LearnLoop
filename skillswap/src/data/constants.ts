import { SkillLevel } from '@/types/profile';

export const SKILL_CATEGORIES = [
  'All Categories',
  'Technology',
  'Design',
  'Business',
  'Languages',
  'Arts & Crafts',
  'Music',
  'Sports & Fitness',
  'Cooking',
  'Photography',
  'Writing',
  'Marketing',
  'Science',
  'Personal Development',
  'Other'
] as const;

export const SKILL_LEVELS: SkillLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

export const POPULAR_SKILLS = [
  { name: 'JavaScript', category: 'Technology' },
  { name: 'Python', category: 'Technology' },
  { name: 'React', category: 'Technology' },
  { name: 'UX Design', category: 'Design' },
  { name: 'Photography', category: 'Photography' },
  { name: 'Spanish', category: 'Languages' },
  { name: 'Guitar', category: 'Music' },
  { name: 'Cooking', category: 'Cooking' },
  { name: 'Writing', category: 'Writing' },
  { name: 'Digital Marketing', category: 'Marketing' }
] as const;

export const SKILL_LEVEL_COLORS = {
  expert: 'bg-green-100 text-green-700 border-green-200',
  advanced: 'bg-blue-100 text-blue-700 border-blue-200',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  beginner: 'bg-gray-100 text-gray-700 border-gray-200'
} as const; 