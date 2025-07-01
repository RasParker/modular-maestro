import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public pages
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Explore } from "./pages/Explore";
import { About } from "./pages/About";
import { CreatorProfile } from "./pages/CreatorProfile";
import { ForgotPassword } from "./pages/ForgotPassword";

// Fan pages
import { FanDashboard } from "./pages/fan/FanDashboard";
import { FanSettings } from "./pages/fan/FanSettings";

// Creator pages
import { CreatorDashboard } from "./pages/creator/CreatorDashboard";
import { CreatorSettings } from "./pages/creator/CreatorSettings";
import { CreatePost } from "./pages/creator/CreatePost";
import { Analytics } from "./pages/creator/Analytics";
import { Subscribers } from "./pages/creator/Subscribers";
import { Messages } from "./pages/creator/Messages";
import { Schedule } from "./pages/creator/Schedule";

// Admin pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminSettings } from "./pages/admin/AdminSettings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<About />} />
            <Route path="/creator/:username" element={<CreatorProfile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Fan routes */}
            <Route
              path="/fan/dashboard"
              element={
                <ProtectedRoute allowedRoles={['fan']}>
                  <FanDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fan/settings"
              element={
                <ProtectedRoute allowedRoles={['fan']}>
                  <FanSettings />
                </ProtectedRoute>
              }
            />
            
            {/* Creator routes */}
            <Route
              path="/creator/dashboard"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/settings"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <CreatorSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/upload"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/analytics"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/subscribers"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <Subscribers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/messages"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/schedule"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            
            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
