// src/components/layout/DashboardLayout.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { cn } from '@/utils/helpers';
import { dashboardNavigation } from '@/config/routes';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  navigation: typeof dashboardNavigation;
  currentPath: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className,
  navigation,
  currentPath,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            navigation={navigation}
            currentPath={currentPath}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={closeMobileSidebar}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
              <Sidebar 
                navigation={navigation}
                currentPath={currentPath}
                onMobileItemClick={closeMobileSidebar}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <main 
            className={cn(
              'flex-1 relative z-0 overflow-y-auto focus:outline-none',
              className
            )}
          >
            <ErrorBoundary>
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </div>
            </ErrorBoundary>
          </main>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => setIsMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export default DashboardLayout;

// Alternative: Simple Page Layout (without sidebar)
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  actions,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-gray-600">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex space-x-3">{actions}</div>
          )}
        </div>
      )}

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
};

// Card Layout Component
interface CardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  title,
  description,
  actions,
  className,
}) => {
  return (
    <div className={cn('bg-white shadow rounded-lg', className)}>
      {(title || description || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};