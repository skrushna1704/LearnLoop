// src/components/layout/index.ts

// Main layout components
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as Sidebar } from './Sidebar';
export { default as DashboardLayout } from './DashboardLayout';

// Navigation components
export { 
  default as Navigation,
  HeaderNavigation,
  SidebarNavigation,
  MobileNavigation,
  FooterNavigation,
  navigationItems,
  footerNavigationItems
} from './Navigation';

// Additional layout utilities (if you have them in DashboardLayout)
export { 
  PageLayout, 
  CardLayout 
} from './DashboardLayout';

// Re-export types
export type { NavigationItem } from './Navigation';