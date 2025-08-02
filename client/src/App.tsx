
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Explore from '@/pages/Explore';
import CreatorProfile from '@/pages/CreatorProfile';
import VideoWatch from '@/pages/VideoWatch';
import PaymentCallback from '@/pages/PaymentCallback';
import NotFound from '@/pages/NotFound';

// Fan pages
import FanDashboard from '@/pages/fan/FanDashboard';
import FeedPage from '@/pages/fan/FeedPage';
import FanMessages from '@/pages/fan/Messages';
import FanNotifications from '@/pages/fan/Notifications';
import FanSettings from '@/pages/fan/FanSettings';
import ManageSubscriptions from '@/pages/fan/ManageSubscriptions';
import PaymentMethod from '@/pages/fan/PaymentMethod';

// Creator pages
import CreatorDashboard from '@/pages/creator/CreatorDashboard';
import Analytics from '@/pages/creator/Analytics';
import CreatePost from '@/pages/creator/CreatePost';
import EditPost from '@/pages/creator/EditPost';
import ManageContent from '@/pages/creator/ManageContent';
import Schedule from '@/pages/creator/Schedule';
import CreatorMessages from '@/pages/creator/Messages';
import Subscribers from '@/pages/creator/Subscribers';
import ManageTiers from '@/pages/creator/ManageTiers';
import Earnings from '@/pages/creator/Earnings';
import CreatorSettings from '@/pages/creator/CreatorSettings';

// Admin pages
import AdminRedirect from '@/pages/admin/AdminRedirect';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ManageUsers from '@/pages/admin/ManageUsers';
import ReviewContent from '@/pages/admin/ReviewContent';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import Reports from '@/pages/admin/Reports';
import AdminSettings from '@/pages/admin/AdminSettings';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/creator/:id" element={<CreatorProfile />} />
                <Route path="/watch/:id" element={<VideoWatch />} />
                
                {/* Payment callback - CRITICAL: This must be accessible without authentication */}
                <Route path="/payment/callback" element={<PaymentCallback />} />

                {/* Fan routes */}
                <Route path="/fan/dashboard" element={
                  <ProtectedRoute allowedRoles={['fan']}>
                    <FanDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/fan/feed" element={
                  <ProtectedRoute allowedRoles={['fan']}>
                    <FeedPage />
                  </ProtectedRoute>
                } />
                <Route path="/fan/messages" element={
                  <ProtectedRoute allowedRoles={['fan']}>
                    <FanMessages />
                  </ProtectedRoute>
                } />
                <Route path="/fan/notifications" element={
                  <ProtectedRoute allowedRoles={['fan']}>
                    <FanNotifications />
                  </ProtectedRoute>
                } />
                <Route path="/fan/settings" element={
                  <ProtectedRoute allowedRoles={['fan']}>
                    <FanSettings />
                  </ProtectedRoute>
                } />
                <Route path="/fan/subscriptions" element={
                  <ProtectedRoute allowedRoles={['fan']}>
                    <ManageSubscriptions />
                  </ProtectedRoute>
                } />
                <Route path="/fan/payment-methods" element={
                  <ProtectedRoute allowedRoles={['fan']}>
                    <PaymentMethod />
                  </ProtectedRoute>
                } />

                {/* Creator routes */}
                <Route path="/creator/dashboard" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <CreatorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/creator/analytics" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/creator/create" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <CreatePost />
                  </ProtectedRoute>
                } />
                <Route path="/creator/edit/:id" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <EditPost />
                  </ProtectedRoute>
                } />
                <Route path="/creator/content" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <ManageContent />
                  </ProtectedRoute>
                } />
                <Route path="/creator/schedule" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <Schedule />
                  </ProtectedRoute>
                } />
                <Route path="/creator/messages" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <CreatorMessages />
                  </ProtectedRoute>
                } />
                <Route path="/creator/subscribers" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <Subscribers />
                  </ProtectedRoute>
                } />
                <Route path="/creator/tiers" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <ManageTiers />
                  </ProtectedRoute>
                } />
                <Route path="/creator/earnings" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <Earnings />
                  </ProtectedRoute>
                } />
                <Route path="/creator/settings" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <CreatorSettings />
                  </ProtectedRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminRedirect />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageUsers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/content" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ReviewContent />
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAnalytics />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
