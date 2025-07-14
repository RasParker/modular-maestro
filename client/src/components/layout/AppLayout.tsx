import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MinimalNavbar } from './MinimalNavbar';
import { BottomNavigation } from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Always shown */}
      <MinimalNavbar />
      
      {/* Main Content - Edge to Edge */}
      <main className={`${isMobile ? 'pb-16' : ''} pt-16`}>
        {children}
      </main>
      
      {/* Bottom Navigation - Mobile Only */}
      {isMobile && user && <BottomNavigation />}
    </div>
  );
};