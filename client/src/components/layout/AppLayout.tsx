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
  
  // Pages that need edge-to-edge layout (no top padding for mobile)
  const isEdgeToEdgePage = location.pathname.startsWith('/video/') || 
                          (location.pathname === '/fan/feed' && isMobile);
  
  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Always shown, but positioned differently for edge-to-edge pages */}
      <MinimalNavbar />
      
      {/* Main Content - Conditional padding */}
      <main className={`${isMobile ? 'pb-16' : ''} ${isEdgeToEdgePage ? '' : 'pt-16'}`}>
        {children}
      </main>
      
      {/* Bottom Navigation - Mobile Only */}
      {isMobile && user && <BottomNavigation />}
    </div>
  );
};