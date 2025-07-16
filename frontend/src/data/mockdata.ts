import { 
  Users, 
  BookOpen, 
  TrendingUp,
  PlayCircle,
  Gift,
  Shield,
  Calendar,
  Camera,
  Music,
  Code,
  Palette,
  Coffee
} from 'lucide-react';

export const features = [
  {
    icon: Users,
    title: 'Connect with Experts',
    description: 'Find skilled professionals in your area and learn from the best',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Gift,
    title: 'Skill Exchange',
    description: 'Trade your expertise for new knowledge without spending money',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Learn at your own pace with flexible timing options',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Verified profiles and secure messaging keep you protected',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export const skills = [
  { icon: Code, name: 'Programming', count: '2.5k+' },
  { icon: Palette, name: 'Design', count: '1.8k+' },
  { icon: Music, name: 'Music', count: '1.2k+' },
  { icon: Camera, name: 'Photography', count: '980+' },
  { icon: Coffee, name: 'Cooking', count: '750+' },
  { icon: BookOpen, name: 'Languages', count: '1.5k+' },
];

export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'UI/UX Designer',
    avatar: '/api/placeholder/40/40',
    content: 'I learned Python from an amazing developer while teaching him design principles. LearnLoop made it so easy to connect!',
    rating: 5,
    skill: 'Python & Design Exchange',
  },
  {
    name: 'Mike Rodriguez',
    role: 'Chef & Food Blogger',
    avatar: '/api/placeholder/40/40',
    content: 'Found a photography expert who helped me take stunning food photos. In return, I taught him some cooking techniques!',
    rating: 5,
    skill: 'Photography & Cooking',
  },
  {
    name: 'Emma Thompson',
    role: 'Marketing Manager',
    avatar: '/api/placeholder/40/40',
    content: 'The platform is incredibly user-friendly. I&apos;ve made lasting connections and learned so much!',
    rating: 5,
    skill: 'Digital Marketing',
  },
  {
    name: 'David Kim',
    role: 'Software Engineer',
    avatar: '/api/placeholder/40/40',
    content: 'Teaching React while learning guitar has been amazing. LearnLoop creates perfect skill exchanges!',
    rating: 5,
    skill: 'React & Guitar',
  },
  {
    name: 'Lisa Wang',
    role: 'Photographer',
    avatar: '/api/placeholder/40/40',
    content: 'I taught photography and learned Spanish. The community is so supportive and genuine!',
    rating: 5,
    skill: 'Photography & Spanish',
  },
  {
    name: 'Alex Johnson',
    role: 'Music Producer',
    avatar: '/api/placeholder/40/40',
    content: 'Exchanged music production skills for web development. Both of us grew professionally!',
    rating: 5,
    skill: 'Music & Web Dev',
  },
  {
    name: 'Maria Garcia',
    role: 'Language Teacher',
    avatar: '/api/placeholder/40/40',
    content: 'Teaching Spanish while learning coding. LearnLoop makes skill sharing feel natural and rewarding!',
    rating: 5,
    skill: 'Spanish & Coding',
  },
  {
    name: 'Tom Wilson',
    role: 'Graphic Designer',
    avatar: '/api/placeholder/40/40',
    content: 'Found a cooking expert who helped me with meal prep while I taught him design basics!',
    rating: 5,
    skill: 'Design & Cooking',
  },
  {
    name: 'Anna Lee',
    role: 'Data Scientist',
    avatar: '/api/placeholder/40/40',
    content: 'Teaching data analysis while learning yoga has been the perfect work-life balance exchange!',
    rating: 5,
    skill: 'Data Science & Yoga',
  },
];

export const stats = [
  { number: '50k+', label: 'Active Learners & Teachers' },
  { number: '25k+', label: 'Skills Exchanges' },
  { number: '500+', label: 'Skill Categories' },
  { number: '98%', label: 'Satisfaction Rate' },
];

export const howItWorks = [
  {
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up and showcase your skills. Tell us what you can teach and what you want to learn.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Find Your Match',
    description: 'Browse through profiles and find someone whose expertise complements your skills.',
    icon: TrendingUp,
  },
  {
    step: '03',
    title: 'Start Learning',
    description: 'Connect, schedule sessions, and begin your skill exchange journey!',
    icon: PlayCircle,
  },
];


