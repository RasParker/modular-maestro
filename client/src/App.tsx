
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { Explore } from '@/pages/Explore';
import { CreatorProfile } from '@/pages/CreatorProfile';
import { VideoWatch } from '@/pages/VideoWatch';
import { FeedPage } from '@/pages/fan/FeedPage';
import { FanDashboard } from '@/pages/fan/FanDashboard';
import { CreatorDashboard } from '@/pages/creator/CreatorDashboard';
import { CreatePost } from '@/pages/creator/CreatePost';
import { Analytics } from '@/pages/creator/Analytics';
import { Subscribers } from '@/pages/creator/Subscribers';
import { CreatorSettings } from '@/pages/creator/CreatorSettings';
import { EditPost } from '@/pages/creator/EditPost';
import { ManageTiers } from '@/pages/creator/ManageTiers';
import { ManageContent } from '@/pages/creator/ManageContent';
import { Earnings } from '@/pages/creator/Earnings';
import { Messages as CreatorMessages } from '@/pages/creator/Messages';

// Fan pages
import { ManageSubscriptions } from '@/pages/fan/ManageSubscriptions';
import { Messages } from '@/pages/fan/Messages';
import { PaymentMethod } from '@/pages/fan/PaymentMethod';
import { FanSettings } from '@/pages/fan/FanSettings';
import { Notifications } from '@/pages/fan/Notifications';

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { AdminRedirect } from '@/pages/admin/AdminRedirect';
import { ManageUsers } from '@/pages/admin/ManageUsers';
import { ReviewContent } from '@/pages/admin/ReviewContent';
import { Reports } from '@/pages/admin/Reports';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';

// Payment pages  
import PaymentCallback from '@/pages/PaymentCallback';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <AppLayout>
              <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Public Routes */}
              <Route path="/explore" element={<Explore />} />

              {/* Public Creator Profile Route - Must be accessible to everyone */}
              <Route path="/creator/:username" element={<CreatorProfile />} />

              {/* Public Post Viewing Route - Must be accessible to everyone */}
              <Route path="/creator/posts/:id" element={<CreatorProfile />} />
                
                {/* Fan Routes */}
              <Route path="/fan/dashboard" element={<ProtectedRoute allowedRoles={['fan']}><FanDashboard /></ProtectedRoute>} />
              <Route path="/fan/feed" element={<ProtectedRoute allowedRoles={['fan']}><FeedPage /></ProtectedRoute>} />
              <Route path="/fan/subscriptions" element={<ProtectedRoute allowedRoles={['fan']}><ManageSubscriptions /></ProtectedRoute>} />
              <Route path="/fan/messages" element={<ProtectedRoute allowedRoles={['fan']}><Messages /></ProtectedRoute>} />
              <Route path="/fan/notifications" element={<ProtectedRoute allowedRoles={['fan']}><Notifications /></ProtectedRoute>} />
              <Route path="/fan/payment" element={<ProtectedRoute allowedRoles={['fan']}><PaymentMethod /></ProtectedRoute>} />
              <Route path="/fan/settings" element={<ProtectedRoute allowedRoles={['fan']}><FanSettings /></ProtectedRoute>} />

              {/* Payment Routes */}
              <Route path="/payment/callback" element={<PaymentCallback />} />

              {/* Creator Routes */}
              <Route path="/creator/dashboard" element={<ProtectedRoute allowedRoles={['creator']}><CreatorDashboard /></ProtectedRoute>} />
              <Route path="/creator/upload" element={<ProtectedRoute allowedRoles={['creator']}><CreatePost /></ProtectedRoute>} />
              <Route path="/creator/manage-content" element={<ProtectedRoute allowedRoles={['creator']}><ManageContent /></ProtectedRoute>} />
              <Route path="/creator/earnings" element={<ProtectedRoute allowedRoles={['creator']}><Earnings /></ProtectedRoute>} />
              <Route path="/creator/analytics" element={<ProtectedRoute allowedRoles={['creator']}><Analytics /></ProtectedRoute>} />
              <Route path="/creator/subscribers" element={<ProtectedRoute allowedRoles={['creator']}><Subscribers /></ProtectedRoute>} />
              <Route path="/creator/schedule" element={<ProtectedRoute allowedRoles={['creator']}><Navigate to="/creator/manage-content" replace /></ProtectedRoute>} />
              <Route path="/creator/settings" element={<ProtectedRoute allowedRoles={['creator']}><CreatorSettings /></ProtectedRoute>} />
              <Route path="/creator/tiers" element={<ProtectedRoute allowedRoles={['creator']}><ManageTiers /></ProtectedRoute>} />
              <Route path="/creator/messages" element={<ProtectedRoute allowedRoles={['creator']}><CreatorMessages /></ProtectedRoute>} />
              <Route path="/creator/notifications" element={<ProtectedRoute allowedRoles={['creator']}><Notifications /></ProtectedRoute>} />
              <Route path="/creator/edit-post/:id" element={<ProtectedRoute allowedRoles={['creator']}><EditPost /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRedirect />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute allowedRoles={['admin']}><ReviewContent /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><Notifications /></ProtectedRoute>} />

              {/* Default route */}
              <Route path="/" element={<Login />} />
              <Route path="/video/:id" element={<VideoWatch />} />

              {/* Catch-all route for undefined paths */}
              <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </AppLayout>
          </Router>
          <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
