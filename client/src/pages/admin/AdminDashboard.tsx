import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  FileText,
  Settings,
  BarChart3,
  Crown,
  Flag
} from 'lucide-react';

// Mock admin data
const PLATFORM_STATS = {
  totalUsers: 125000,
  totalCreators: 8500,
  totalFans: 116500,
  monthlyRevenue: 285000,
  platformFees: 42750, // 15% commission
  activeSubscriptions: 45000,
  contentModeration: {
    pending: 23,
    approved: 1240,
    rejected: 45
  }
};

const RECENT_REPORTS = [
  {
    id: '1',
    type: 'content',
    reason: 'Inappropriate content',
    reported_by: 'user123',
    target: 'artisticmia',
    status: 'pending',
    created_at: '2 hours ago'
  },
  {
    id: '2',
    type: 'user',
    reason: 'Spam behavior',
    reported_by: 'fan456',
    target: 'spamuser',
    status: 'under_review',
    created_at: '4 hours ago'
  },
  {
    id: '3',
    type: 'payment',
    reason: 'Chargeback dispute',
    reported_by: 'system',
    target: 'transaction_789',
    status: 'resolved',
    created_at: '1 day ago'
  }
];

const TOP_CREATORS = [
  {
    id: '1',
    username: 'artisticmia',
    display_name: 'Artistic Mia',
    subscribers: 2840,
    monthly_revenue: 12500,
    status: 'verified'
  },
  {
    id: '2',
    username: 'fitnessking',
    display_name: 'Fitness King',
    subscribers: 5120,
    monthly_revenue: 18900,
    status: 'verified'
  },
  {
    id: '3',
    username: 'musicmaker',
    display_name: 'Music Maker',
    subscribers: 1890,
    monthly_revenue: 7200,
    status: 'pending'
  }
];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="w-full pt-6 pb-8">
        <div className="content-container safe-area py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.username}! Platform overview and management tools
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
          {/* Key Metrics */}
          <div className="lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{PLATFORM_STATS.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-success">+8.5% this month</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Platform Revenue</p>
                    <p className="text-2xl font-bold text-foreground">GHS {PLATFORM_STATS.platformFees.toLocaleString()}</p>
                    <p className="text-xs text-success">+15% vs last month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Creators</p>
                    <p className="text-2xl font-bold text-foreground">{PLATFORM_STATS.totalCreators.toLocaleString()}</p>
                    <p className="text-xs text-success">+12% growth</p>
                  </div>
                  <Crown className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
                    <p className="text-2xl font-bold text-foreground">{PLATFORM_STATS.contentModeration.pending}</p>
                    <p className="text-xs text-warning">Needs attention</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Manage platform operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button size="lg" className="h-20 flex-col gap-2" asChild>
                    <Link to="/admin/users">
                      <Users className="w-6 h-6" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-20 flex-col gap-2" asChild>
                    <Link to="/admin/content">
                      <FileText className="w-6 h-6" />
                      Review Content
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-20 flex-col gap-2" asChild>
                    <Link to="/admin/reports">
                      <Flag className="w-6 h-6" />
                      Reports
                      {PLATFORM_STATS.contentModeration.pending > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {PLATFORM_STATS.contentModeration.pending}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-20 flex-col gap-2" asChild>
                    <Link to="/admin/analytics">
                      <BarChart3 className="w-6 h-6" />
                      Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Moderation Overview */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review status and pending items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg border border-border/50">
                    <p className="text-2xl font-bold text-warning">{PLATFORM_STATS.contentModeration.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border border-border/50">
                    <p className="text-2xl font-bold text-success">{PLATFORM_STATS.contentModeration.approved}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border border-border/50">
                    <p className="text-2xl font-bold text-destructive">{PLATFORM_STATS.contentModeration.rejected}</p>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/admin/content">Review Pending Content</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Top Creators */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Top Performing Creators</CardTitle>
                <CardDescription>Highest earning creators this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TOP_CREATORS.map((creator, index) => (
                  <div key={creator.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{creator.display_name}</p>
                        <p className="text-sm text-muted-foreground">@{creator.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">GHS {creator.monthly_revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{creator.subscribers} subscribers</p>
                        <Badge variant={creator.status === 'verified' ? 'default' : 'outline'}>
                          {creator.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reports */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {RECENT_REPORTS.map((report) => (
                  <div key={report.id} className="p-3 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        report.status === 'pending' ? 'destructive' :
                        report.status === 'under_review' ? 'secondary' : 'default'
                      }>
                        {report.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{report.created_at}</span>
                    </div>
                    <p className="text-sm font-medium">{report.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      Target: {report.target}
                    </p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin/reports">View All Reports</Link>
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Server Performance</span>
                    <span>98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Content Delivery</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Payment Processing</span>
                    <span>99%</span>
                  </div>
                  <Progress value={99} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Platform Settings */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure platform-wide settings and policies
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};