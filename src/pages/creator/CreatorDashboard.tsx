import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  Upload, 
  MessageSquare, 
  Settings,
  BarChart3,
  Crown
} from 'lucide-react';

// Mock analytics data
const ANALYTICS = {
  subscribers: 2840,
  monthlyEarnings: 4200,
  totalEarnings: 18500,
  growthRate: 15.2,
  engagementRate: 78,
  postsThisMonth: 24
};

const RECENT_SUBSCRIBERS = [
  {
    id: '1',
    username: 'johndoe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    tier: 'Fan',
    joined: '2 hours ago'
  },
  {
    id: '2',
    username: 'sarahsmith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face',
    tier: 'Superfan',
    joined: '5 hours ago'
  },
  {
    id: '3',
    username: 'mikejones',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    tier: 'Supporter',
    joined: '1 day ago'
  }
];

const TIER_BREAKDOWN = [
  { name: 'Supporter', price: 5, subscribers: 1200, revenue: 6000 },
  { name: 'Fan', price: 15, subscribers: 980, revenue: 14700 },
  { name: 'Superfan', price: 25, subscribers: 660, revenue: 16500 }
];

export const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Crown className="w-8 h-8 text-accent" />
            Creator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.username}! Here's your creator overview
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Key Metrics */}
          <div className="lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
                    <p className="text-2xl font-bold text-foreground">{ANALYTICS.subscribers.toLocaleString()}</p>
                    <p className="text-xs text-success">+{ANALYTICS.growthRate}% this month</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Earnings</p>
                    <p className="text-2xl font-bold text-foreground">${ANALYTICS.monthlyEarnings.toLocaleString()}</p>
                    <p className="text-xs text-success">+12% vs last month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-foreground">${ANALYTICS.totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                    <p className="text-2xl font-bold text-foreground">{ANALYTICS.engagementRate}%</p>
                    <p className="text-xs text-success">Above average</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild variant="premium" className="h-auto p-6">
                <Link to="/creator/upload" className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8" />
                  <span>Upload Content</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-6">
                <Link to="/creator/analytics" className="flex flex-col items-center gap-2">
                  <BarChart className="w-8 h-8" />
                  <span>View Analytics</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-6">
                <Link to="/creator/subscribers" className="flex flex-col items-center gap-2">
                  <Users className="w-8 h-8" />
                  <span>Manage Subscribers</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-6">
                <Link to="/creator/tiers" className="flex flex-col items-center gap-2">
                  <DollarSign className="w-8 h-8" />
                  <span>Manage Tiers</span>
                </Link>
              </Button>
            </div>

            {/* Subscription Tiers Performance */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Subscription Tiers Performance</CardTitle>
                <CardDescription>Revenue breakdown by tier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TIER_BREAKDOWN.map((tier) => (
                  <div key={tier.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{tier.name}</Badge>
                        <span className="text-sm text-muted-foreground">${tier.price}/month</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{tier.subscribers} subscribers</p>
                        <p className="text-xs text-muted-foreground">${tier.revenue.toLocaleString()}/month</p>
                      </div>
                    </div>
                    <Progress 
                      value={(tier.subscribers / ANALYTICS.subscribers) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Content Schedule */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Content Schedule
                </CardTitle>
                <CardDescription>Your upcoming posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium">New Digital Art Collection</p>
                      <p className="text-sm text-muted-foreground">Superfan tier • Image</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Tomorrow</p>
                      <p className="text-xs text-muted-foreground">2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium">Behind the Scenes Video</p>
                      <p className="text-sm text-muted-foreground">Fan tier • Video</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Feb 20</p>
                      <p className="text-xs text-muted-foreground">6:00 PM</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/creator/schedule">Manage Schedule</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Subscribers */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Subscribers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {RECENT_SUBSCRIBERS.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{subscriber.username}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{subscriber.tier}</Badge>
                        <span className="text-xs text-muted-foreground">{subscriber.joined}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/creator/subscribers">View All</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Goals */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subscriber Goal</span>
                    <span>2,840 / 3,000</span>
                  </div>
                  <Progress value={94.7} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Revenue Goal</span>
                    <span>$4,200 / $5,000</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Posts Goal</span>
                    <span>24 / 30</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Profile Settings */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep your profile updated to attract more subscribers
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/creator/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
