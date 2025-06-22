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
      <Sidebar 
        navigation={dashboardNavigation} 
        currentPath={pathname} 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
