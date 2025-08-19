import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { sidebarUtils } from '../../utils/sidebarUtils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(sidebarUtils.getSidebarState());

  useEffect(() => {
    sidebarUtils.setSidebarState(isCollapsed);
  }, [isCollapsed]);

  return (
    <div className="min-h-screen bg-brand-blue-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Header isCollapsed={isCollapsed} />
      
      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        } pt-20`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};