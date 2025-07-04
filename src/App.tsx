import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { PricingPage } from '@/pages/PricingPage';
import { ContactPage } from '@/pages/ContactPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { FanDashboard } from '@/pages/fan/FanDashboard';
import { FanMessages } from '@/pages/fan/FanMessages';
import { CreatorProfile } from '@/pages/CreatorProfile';
import { FeedPage } from '@/pages/fan/FeedPage';
import { CreatorDashboard } from '@/pages/creator/CreatorDashboard';
import { CreatePost } from '@/pages/creator/CreatePost';
import { Analytics } from '@/pages/creator/Analytics';
import { Subscribers } from '@/pages/creator/Subscribers';
import { CreatorMessages } from '@/pages/creator/CreatorMessages';
import { Schedule } from '@/pages/creator/Schedule';
import { CreatorSettings } from '@/pages/creator/CreatorSettings';
import { EditPost } from '@/pages/creator/EditPost';
import { ManageTiers } from '@/pages/creator/ManageTiers';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="xclusive-theme">
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Fan Routes */}
              <Route path="/fan/dashboard" element={<ProtectedRoute role="fan"><FanDashboard /></ProtectedRoute>} />
              <Route path="/fan/messages" element={<ProtectedRoute role="fan"><FanMessages /></ProtectedRoute>} />
              <Route path="/feed" element={<ProtectedRoute role="fan"><FeedPage /></ProtectedRoute>} />
              <Route path="/creator/:username" element={<CreatorProfile />} />

              {/* Creator Routes */}
              <Route path="/creator/dashboard" element={<ProtectedRoute role="creator"><CreatorDashboard /></ProtectedRoute>} />
              <Route path="/creator/upload" element={<ProtectedRoute role="creator"><CreatePost /></ProtectedRoute>} />
              <Route path="/creator/analytics" element={<ProtectedRoute role="creator"><Analytics /></ProtectedRoute>} />
              <Route path="/creator/subscribers" element={<ProtectedRoute role="creator"><Subscribers /></ProtectedRoute>} />
              <Route path="/creator/messages" element={<ProtectedRoute role="creator"><CreatorMessages /></ProtectedRoute>} />
              <Route path="/creator/schedule" element={<ProtectedRoute role="creator"><Schedule /></ProtectedRoute>} />
              <Route path="/creator/settings" element={<ProtectedRoute role="creator"><CreatorSettings /></ProtectedRoute>} />
              <Route path="/creator/tiers" element={<ProtectedRoute role="creator"><ManageTiers /></ProtectedRoute>} />
              <Route path="/creator/edit-post/:id" element={<ProtectedRoute role="creator"><EditPost /></ProtectedRoute>} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
