// src/components/layout/Navigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/helpers';
import {
  Home,
  Search,
  Users,
  BookOpen,
  MessageCircle,
  Calendar,
  Settings,
  HelpCircle,
  Star,
  TrendingUp,
  User,
  Gift
} from 'lucide-react';

// Navigation item interface
interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  isNew?: boolean;
  requiresAuth?: boolean;
  isExternal?: boolean;
}

// Navigation component props
interface NavigationProps {
  variant?: 'header' | 'sidebar' | 'mobile' | 'footer';
  isAuthenticated?: boolean;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  onItemClick?: (item: NavigationItem) => void;
  showIcons?: boolean;
  showBadges?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

// Navigation items configuration
const navigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    requiresAuth: false,
  },
  {
    name: 'How it Works',
    href: '/how-it-works',
    icon: HelpCircle,
    requiresAuth: false,
  },
  {
    name: 'Browse Skills',
    href: '/skills/browse',
    icon: Search,
    requiresAuth: false,
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: TrendingUp,
    requiresAuth: true,
  },
  {
    name: 'My Profile',
    href: '/profile',
    icon: User,
    requiresAuth: true,
  },
  {
    name: 'Skills',
    href: '/skills',
    icon: BookOpen,
    requiresAuth: true,
    isNew: true,
  },
  {
    name: 'Exchanges',
    href: '/exchanges',
    icon: Gift,
    requiresAuth: true,
    badge: 3,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageCircle,
    requiresAuth: true,
    badge: 5,
  },
  {
    name: 'Schedule',
    href: '/schedule',
    icon: Calendar,
    requiresAuth: true,
  },
  {
    name: 'Community',
    href: '/community',
    icon: Users,
    requiresAuth: false,
  },
];

// Footer-specific navigation items
const footerNavigationItems: NavigationItem[] = [
  {
    name: 'About Us',
    href: '/about',
    requiresAuth: false,
  },
  {
    name: 'Contact',
    href: '/contact',
    requiresAuth: false,
  },
  {
    name: 'Privacy Policy',
    href: '/privacy',
    requiresAuth: false,
  },
  {
    name: 'Terms of Service',
    href: '/terms',
    requiresAuth: false,
  },
  {
    name: 'Help Center',
    href: '/help',
    requiresAuth: false,
  },
];

const Navigation: React.FC<NavigationProps> = ({
  variant = 'header',
  isAuthenticated = false,
  className,
  itemClassName,
  activeClassName,
  onItemClick,
  showIcons = true,
  showBadges = true,
  orientation = 'horizontal',
}) => {
  const pathname = usePathname();

  // Get appropriate navigation items based on variant
  const getNavigationItems = (): NavigationItem[] => {
    if (variant === 'footer') {
      return footerNavigationItems;
    }
    
    return navigationItems.filter(item => {
      if (item.requiresAuth && !isAuthenticated) {
        return false;
      }
      
      // Hide dashboard-specific items in header for non-authenticated users
      if (variant === 'header' && !isAuthenticated) {
        const dashboardItems = ['/dashboard', '/profile', '/skills', '/exchanges', '/messages', '/schedule'];
        return !dashboardItems.includes(item.href);
      }
      
      return true;
    });
  };

  // Check if link is active
  const isActiveLink = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Get base styles for different variants
  const getVariantStyles = () => {
    const baseStyles = {
      header: {
        container: 'flex items-center space-x-8',
        item: 'text-sm font-medium transition-colors hover:text-blue-600',
        active: 'text-blue-600',
        inactive: 'text-gray-700',
      },
      sidebar: {
        container: 'flex flex-col space-y-1',
        item: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group',
        active: 'bg-blue-50 text-blue-700 border-r-2 border-blue-700',
        inactive: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
      },
      mobile: {
        container: 'flex flex-col space-y-1',
        item: 'flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors',
        active: 'text-blue-600 bg-blue-50',
        inactive: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
      },
      footer: {
        container: orientation === 'horizontal' ? 'flex flex-wrap gap-6' : 'flex flex-col space-y-2',
        item: 'text-sm text-gray-600 hover:text-gray-900 transition-colors',
        active: 'text-gray-900',
        inactive: 'text-gray-600',
      },
    };

    return baseStyles[variant];
  };

  const styles = getVariantStyles();
  const items = getNavigationItems();

  // Handle item click
  const handleItemClick = (item: NavigationItem) => {
    onItemClick?.(item);
  };

  return (
    <nav className={cn(styles.container, className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveLink(item.href);

        const itemContent = (
          <>
            {/* Icon */}
            {showIcons && Icon && (
              <Icon 
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  variant === 'sidebar' && 'mr-3',
                  variant === 'mobile' && 'mr-3',
                  isActive 
                    ? 'text-blue-700' 
                    : 'text-gray-500 group-hover:text-gray-700'
                )}
              />
            )}

            {/* Label */}
            <span className={variant === 'sidebar' ? 'flex-1' : undefined}>
              {item.name}
            </span>

            {/* Badges and indicators */}
            {showBadges && (variant === 'sidebar' || variant === 'mobile') && (
              <div className="flex items-center space-x-2">
                {item.isNew && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    New
                  </span>
                )}
                
                {item.badge && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </>
        );

        // Render as external link if needed
        if (item.isExternal) {
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                styles.item,
                isActive ? (activeClassName || styles.active) : styles.inactive,
                itemClassName
              )}
              onClick={() => handleItemClick(item)}
            >
              {itemContent}
            </a>
          );
        }

        // Render as Next.js Link
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              styles.item,
              isActive ? (activeClassName || styles.active) : styles.inactive,
              itemClassName
            )}
            onClick={() => handleItemClick(item)}
          >
            {itemContent}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;

// Specialized navigation components for common use cases
export const HeaderNavigation: React.FC<{
  isAuthenticated?: boolean;
  className?: string;
}> = ({ isAuthenticated, className }) => (
  <Navigation
    variant="header"
    isAuthenticated={isAuthenticated}
    className={className}
    showBadges={false}
  />
);

export const SidebarNavigation: React.FC<{
  isAuthenticated?: boolean;
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
}> = ({ isAuthenticated = true, className, onItemClick }) => (
  <Navigation
    variant="sidebar"
    isAuthenticated={isAuthenticated}
    className={className}
    onItemClick={onItemClick}
    showIcons={true}
    showBadges={true}
  />
);

export const MobileNavigation: React.FC<{
  isAuthenticated?: boolean;
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
}> = ({ isAuthenticated, className, onItemClick }) => (
  <Navigation
    variant="mobile"
    isAuthenticated={isAuthenticated}
    className={className}
    onItemClick={onItemClick}
    showIcons={true}
    showBadges={true}
  />
);

export const FooterNavigation: React.FC<{
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}> = ({ className, orientation = 'horizontal' }) => (
  <Navigation
    variant="footer"
    className={className}
    showIcons={false}
    showBadges={false}
    orientation={orientation}
  />
);

// Export navigation items for use in other components
export { navigationItems, footerNavigationItems };
export type { NavigationItem };