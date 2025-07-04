
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { FanDashboard } from '@/pages/fan/FanDashboard';
import { CreatorProfile } from '@/pages/CreatorProfile';
import { FeedPage } from '@/pages/fan/FeedPage';
import { CreatorDashboard } from '@/pages/creator/CreatorDashboard';
import { CreatePost } from '@/pages/creator/CreatePost';
import { Analytics } from '@/pages/creator/Analytics';
import { Subscribers } from '@/pages/creator/Subscribers';
import { Schedule } from '@/pages/creator/Schedule';
import { CreatorSettings } from '@/pages/creator/CreatorSettings';
import { EditPost } from '@/pages/creator/EditPost';
import { ManageTiers } from '@/pages/creator/ManageTiers';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" enableSystem>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Fan Routes */}
              <Route path="/fan/dashboard" element={<ProtectedRoute allowedRoles={['fan']}><FanDashboard /></ProtectedRoute>} />
              <Route path="/feed" element={<ProtectedRoute allowedRoles={['fan']}><FeedPage /></ProtectedRoute>} />
              <Route path="/creator/:username" element={<CreatorProfile />} />

              {/* Creator Routes */}
              <Route path="/creator/dashboard" element={<ProtectedRoute allowedRoles={['creator']}><CreatorDashboard /></ProtectedRoute>} />
              <Route path="/creator/upload" element={<ProtectedRoute allowedRoles={['creator']}><CreatePost /></ProtectedRoute>} />
              <Route path="/creator/analytics" element={<ProtectedRoute allowedRoles={['creator']}><Analytics /></ProtectedRoute>} />
              <Route path="/creator/subscribers" element={<ProtectedRoute allowedRoles={['creator']}><Subscribers /></ProtectedRoute>} />
              <Route path="/creator/schedule" element={<ProtectedRoute allowedRoles={['creator']}><Schedule /></ProtectedRoute>} />
              <Route path="/creator/settings" element={<ProtectedRoute allowedRoles={['creator']}><CreatorSettings /></ProtectedRoute>} />
              <Route path="/creator/tiers" element={<ProtectedRoute allowedRoles={['creator']}><ManageTiers /></ProtectedRoute>} />
              <Route path="/creator/edit-post/:id" element={<ProtectedRoute allowedRoles={['creator']}><EditPost /></ProtectedRoute>} />
              
              {/* Default route */}
              <Route path="/" element={<CreatorDashboard />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
