import { SkillLevel } from '@/types/profile';
import { Category } from '@/types/practice';
import { ArrowRightLeft, Award, Camera, Code, FileText, Globe, Image as ImageIcon, MessageSquare, Music, Palette, Plus, Target, TrendingUp, Trophy, Users, Zap, File as FileIcon, Search, Calendar } from 'lucide-react';

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

export const quickActions = [
  {
    title: 'Browse Skills',
    description: 'Discover new skills to exchange',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    count: '2.5k+ skills',
    action: 'browse',
    href: '/browse-skills'
  },
  {
    title: 'Messages',
    description: 'Check your conversations',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
    count: '3 new',
    action: 'messages',
    href: '/messages'
  },
  {
    title: 'Exchanges',
    description: 'Track your learning journey',
    icon: ArrowRightLeft,
    color: 'from-green-500 to-emerald-500',
    count: '85% complete',
    action: 'exchanges',
    href: '/exchanges'
  },
  {
    title: 'Community',
    description: 'Connect with skill exchangers',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    count: '120 members',
    action: 'community',
    href: '/community'
  }
];

export const achievements = [
  { name: 'First Exchange', icon: Trophy, unlocked: true },
  { name: 'Skill Master', icon: Award, unlocked: true },
  { name: 'Community Builder', icon: Users, unlocked: false },
  { name: 'Learning Streak', icon: Zap, unlocked: true },
];

export const upcomingSessions = [
  {
    skill: 'UI/UX Design',
    teacher: 'Sarah Chen',
    time: 'Today, 2:00 PM',
    type: 'learning',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    skill: 'React.js',
    student: 'Mike Torres',
    time: 'Tomorrow, 4:00 PM',
    type: 'teaching',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

export const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const DashboardSkillCategories = [
  { id: 'All', name: 'All', icon: Globe },
  { id: 'Technology', name: 'Tech', icon: Code },
  { id: 'Design', name: 'Design', icon: Palette },
  { id: 'Music', name: 'Music', icon: Music },
  { id: 'Photography', name: 'Photo', icon: Camera },
  { id: 'Business', name: 'Business', icon: TrendingUp },
  { id: 'Languages', name: 'Languages', icon: Globe },
  { id: 'Arts', name: 'Arts', icon: Target },
];

export const DashboardSkillSortOptions = [
  { id: 'popularity', name: 'Most Popular' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest' }
];
  
export const quickReplies = [
  'Sounds great! 👍',
  'Let me check my calendar',
  'Can we reschedule?',
  'Thanks for the session!',
  'I\'m available',
  'Looking forward to it!'
];

export const menuItems = [
  {
    id: 'image',
    icon: ImageIcon,
    label: 'Image',
    description: 'JPG, PNG, GIF, WebP',
    color: 'from-purple-500 to-pink-500',
    hoverColor: 'hover:from-purple-600 hover:to-pink-600'
  },
  {
    id: 'pdf',
    icon: FileText,
    label: 'PDF',
    description: 'PDF documents',
    color: 'from-red-500 to-orange-500',
    hoverColor: 'hover:from-red-600 hover:to-orange-600'
  },
  {
    id: 'doc',
    icon: FileIcon,
    label: 'Document',
    description: 'DOC, DOCX, TXT',
    color: 'from-blue-500 to-cyan-500',
    hoverColor: 'hover:from-blue-600 hover:to-cyan-600'
  },
  {
    id: 'all',
    icon: Plus,
    label: 'Any File',
    description: 'All file types',
    color: 'from-green-500 to-emerald-500',
    hoverColor: 'hover:from-green-600 hover:to-emerald-600'
  }
];


export const CommunityQuickActions = [
  { icon: Plus, label: 'Share Knowledge', color: 'bg-blue-500', href: 'community/create-post' },
  { icon: Search, label: 'Find Skills', color: 'bg-green-500', href: '/browse-skills' },
  { icon: Users, label: 'Join Groups', color: 'bg-purple-500', href: '/groups' },
  { icon: Calendar, label: 'Schedule Exchange', color: 'bg-orange-500', href: '/schedule' }
];