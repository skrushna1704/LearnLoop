'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout';
import { usePathname } from 'next/navigation';
import { dashboardNavigation } from '@/config/routes';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar 
          navigation={dashboardNavigation} 
          currentPath={pathname} 
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>
      {/* Sidebar overlay for mobile */}
      <div className="lg:hidden">
        {isCollapsed && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleToggleCollapse} />
            <Sidebar 
              navigation={dashboardNavigation} 
              currentPath={pathname} 
              isCollapsed={false}
              onToggleCollapse={handleToggleCollapse}
              onMobileItemClick={handleToggleCollapse}
            />
          </div>
        )}
        {/* Hamburger menu button */}
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors lg:hidden"
          onClick={handleToggleCollapse}
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
