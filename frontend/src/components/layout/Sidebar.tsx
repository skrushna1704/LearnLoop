'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Home,
  Code,
  MessageSquare,
  Users,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Bell,
  Search,
  Star,
  Award,
  Zap,
  BookOpen,
  Calendar,
  Heart,
  TrendingUp,
  Target,
  Globe,
  Crown,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';

interface NavigationItem {
  readonly title: string;
  readonly href: string;
  readonly icon: string;
  readonly badge?: number;
  readonly isNew?: boolean;
  readonly isPremium?: boolean;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  navigation: readonly NavigationItem[];
  currentPath: string;
}

const iconMap = {
  Home,
  Code,
  MessageSquare,
  Users,
  Settings,
  User,
  Exchange: GitBranch,
  BookOpen,
  Calendar,
  Bell,
  Search,
  TrendingUp,
  Target
};

// Sample navigation data with enhanced properties
const enhancedNavigation = [
  { title: 'Dashboard', href: '/dashboard', icon: 'Home' },
  { title: 'My Exchanges', href: '/exchanges', icon: 'Exchange', badge: 3 },
  { title: 'Messages', href: '/messages', icon: 'MessageSquare', badge: 12 },
  { title: 'Community', href: '/community', icon: 'Users', isNew: true },
  { title: 'Find Teachers', href: '/teachers', icon: 'Search' },
  { title: 'My Skills', href: '/skills', icon: 'Code' },
  { title: 'Calendar', href: '/calendar', icon: 'Calendar' },
  { title: 'Resources', href: '/resources', icon: 'BookOpen' },
  { title: 'Analytics', href: '/analytics', icon: 'TrendingUp', isPremium: true },
  { title: 'Profile', href: '/profile', icon: 'User' },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  navigation = enhancedNavigation,
  currentPath = '/dashboard',
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();
  const { logout } = useAuth();
  const { profile: user, loading } = useProfile();

  const cn = (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  if (loading) {
    return <div className="w-72 p-8 text-center">Loading...</div>;
  }
  if (!user) {
    return <div className="w-72 p-8 text-center text-red-500">User not found.</div>;
  }

  return (
    <div
      className={cn(
        'flex flex-col bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/80 backdrop-blur-sm transition-all duration-300 ease-in-out shadow-lg',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className={cn(
          'flex items-center h-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div onClick={() => router.push('/')} className='cursor-pointer'>
                <h1 className="text-lg font-bold">LearnLoop</h1>
                <p className="text-xs text-blue-100">Learn & Teach</p>
              </div>
            </div>
          )}
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          )}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 pointer-events-none" />
      </div>

      {/* Quick Stats (when expanded) */}
      {!isCollapsed && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3">
              <div className="text-lg font-bold text-blue-600">{user.skills_offered?.length || 0}</div>
              <div className="text-xs text-gray-600">Teaching</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-lg font-bold text-gray-900">{user.skills_needed?.length || 0}</span>
              </div>
              <div className="text-xs text-gray-600">Learning</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold text-orange-600">0</span>
              </div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <ul className="space-y-2 px-3">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = currentPath === item.href;
            const isHovered = hoveredItem === item.href;

            return (
              <li key={item.href}>
                <div
                  className={cn(
                    'relative group cursor-pointer',
                    'transition-all duration-300 ease-out transform',
                    isHovered && 'scale-[1.02]'
                  )}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => router.push(item.href)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push(item.href); }}
                >
                  <div
                    className={cn(
                      'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                      'relative overflow-hidden',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-700 hover:bg-white hover:shadow-md hover:shadow-gray-200/50',
                      isCollapsed ? 'justify-center' : 'justify-start'
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 opacity-100" />
                    )}
                    
                    {/* Hover effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    
                    <div className="relative flex items-center w-full">
                      <div className={cn(
                        'flex items-center justify-center rounded-lg transition-all duration-300',
                        isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600',
                        isCollapsed ? 'w-6 h-6' : 'w-6 h-6 mr-3',
                        item.isPremium && !isActive && 'text-purple-600'
                      )}>
                        <Icon className={cn(
                          'transition-all duration-300',
                          isActive && 'scale-110',
                          'group-hover:scale-110'
                        )} />
                      </div>
                      
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className={cn(
                            'transition-colors duration-300',
                            isActive ? 'text-white font-semibold' : 'text-gray-700 group-hover:text-gray-900'
                          )}>
                            {item.title}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {/* Badge */}
                            {item.badge && item.badge > 0 && (
                              <span className={cn(
                                'px-2 py-1 text-xs rounded-full font-bold transition-all duration-300',
                                isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-red-500 text-white animate-pulse'
                              )}>
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                            
                            {/* New indicator */}
                            {item.isNew && (
                              <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full font-bold animate-pulse">
                                New
                              </span>
                            )}
                            
                            {/* Premium indicator */}
                            {item.isPremium && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && isHovered && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                      {item.title}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200/80 bg-gradient-to-r from-gray-50 to-white">
        {isCollapsed ? (
          <div className="relative group">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
              <Image
                src={user.profile?.profilePicture || 'https://i.pravatar.cc/150?img=1'}
                alt={user.profile?.name || user.email}
                width={48}
                height={48}
                className="w-full h-full rounded-xl object-cover"
              />
              {/* Online status can be re-added when available in API */}
              {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" /> */}
              {/* Premium status can be re-added when available in API */}
              {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div> */}
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                  <Image
                    src={user.profile?.profilePicture || 'https://i.pravatar.cc/150?img=1'}
                    alt={user.profile?.name || user.email}
                    width={48}
                    height={48}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
                {/* Online status can be re-added when available in API */}
                {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" /> */}
                {/* Premium status can be re-added when available in API */}
                {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div> */}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.profile?.name || user.email}
                  </p>
                  <span className={cn(
                    'px-2 py-1 text-xs rounded-full font-medium',
                    user.skills_offered?.[0]?.level === 'Expert' ? 'bg-green-100 text-green-800' :
                    user.skills_offered?.[0]?.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  )}>
                    {user.skills_offered?.[0]?.level || 'Beginner'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  Learner
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Level Progress</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: '85%' }} />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center p-2 rounded-lg hover:bg-white/80 transition-colors duration-200 group">
                <Heart className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs text-gray-600 mt-1">Favorites</span>
              </button>
              <button className="flex flex-col items-center p-2 rounded-lg hover:bg-white/80 transition-colors duration-200 group">
                <Award className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs text-gray-600 mt-1">Badges</span>
              </button>
              <button className="flex flex-col items-center p-2 rounded-lg hover:bg-white/80 transition-colors duration-200 group">
                <Globe className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs text-gray-600 mt-1">Global</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200/80">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors duration-200"
          onClick={async () => {
            await logout();
            router.push('/');
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;