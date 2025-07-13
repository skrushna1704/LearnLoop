import { SkillLevel } from '@/types/profile';
import { Category } from '@/types/practice';

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

export const categories: Category[] = [
  {
    name: 'JavaScript',
    icon: '⚡',
    color: 'bg-yellow-500',
    description: 'Master JavaScript fundamentals and advanced concepts'
  },
  {
    name: "ReactJS",
    icon: '⚛️',
    color: 'bg-blue-500',
    description: 'Learn React hooks, components, and best practices'
  },
  {
    name: 'NextJS',
    icon: '▲',
    color: 'bg-black',
    description: 'Master Next.js framework and server-side rendering'
  },
  {
    name: 'Node.js',
    icon: '🟢',
    color: 'bg-green-500',
    description: 'Learn Node.js backend development and APIs'
  },
  {
    name: 'HTML',
    icon: '🌐',
    color: 'bg-orange-500',
    description: 'Master HTML structure and semantic markup'
  },
  {
    name: 'CSS',
    icon: '🎨',
    color: 'bg-purple-500',
    description: 'Learn CSS styling and responsive design'
  },
  {
    name: 'TypeScript',
    icon: '📘',
    color: 'bg-blue-600',
    description: 'Master TypeScript type system and interfaces'
  },
  {
    name: 'DSA',
    icon: '🧮',
    color: 'bg-red-500',
    description: 'Practice Data Structures and Algorithms'
  }
];

export const difficulties = [
  { name: 'Beginner', color: 'bg-green-100 text-green-800' },
  { name: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Advanced', color: 'bg-red-100 text-red-800' }
];