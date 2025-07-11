import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/shared/Navbar';
import { DashboardHeader } from '@/components/creator/DashboardHeader';
import { QuickActionsGrid } from '@/components/creator/QuickActionsGrid';
import { ContentScheduleCard } from '@/components/creator/ContentScheduleCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  Settings,
  User // Added User import
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

const SCHEDULED_CONTENT = [
  {
    id: '1',
    title: 'New Digital Art Collection',
    tier: 'Superfan',
    type: 'Image',
    date: 'Tomorrow',
    time: '2:00 PM'
  },
  {
    id: '2',
    title: 'Behind the Scenes Video',
    tier: 'Fan',
    type: 'Video',
    date: 'Feb 20',
    time: '6:00 PM'
  }
];

export const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <DashboardHeader
          username={user?.username}
          title="Creator Dashboard"
          subtitle="Here's your creator overview"
        />

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Key Metrics */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Subscribers</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{ANALYTICS.subscribers.toLocaleString()}</p>
                    <p className="text-xs text-success">+{ANALYTICS.growthRate}% this month</p>
                  </div>
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Monthly Earnings</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">GHS {ANALYTICS.monthlyEarnings.toLocaleString()}</p>
                    <p className="text-xs text-success">+12% vs last month</p>
                  </div>
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Earnings</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">GHS {ANALYTICS.totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </div>
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Engagement Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{ANALYTICS.engagementRate}%</p>
                    <p className="text-xs text-success">Above average</p>
                  </div>
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <QuickActionsGrid />

            {/* Subscription Tiers Performance */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-base sm:text-xl">Subscription Tiers Performance</CardTitle>
                <CardDescription className="text-sm">Revenue breakdown by tier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TIER_BREAKDOWN.map((tier) => (
                  <div key={tier.name} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">{tier.name}</Badge>
                        <span className="text-sm text-muted-foreground">GHS {tier.price}/month</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-medium">{tier.subscribers} subscribers</p>
                        <p className="text-xs text-muted-foreground">GHS {tier.revenue.toLocaleString()}/month</p>
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

            {/* Scheduled Content */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">Scheduled Content</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/schedule">
                      <Calendar className="w-4 h-4 mr-2" />
                      Manage Schedule
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {SCHEDULED_CONTENT.length > 0 ? (
                  <div className="space-y-3">
                    {SCHEDULED_CONTENT.map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{content.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Badge variant="outline" className="text-xs">{content.tier}</Badge>
                            <span>{content.date} at {content.time}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {content.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No scheduled content</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link to="/creator/upload">Create Content</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Subscribers */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Subscribers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {RECENT_SUBSCRIBERS.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-primary flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{subscriber.username}</p>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
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
                <CardTitle className="text-base sm:text-lg">Monthly Goals</CardTitle>
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
                    <span>GHS 4,200 / 5,000</span>
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
                <CardTitle className="text-base sm:text-lg">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep your profile updated to attract more subscribers
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/creator/${user?.username}`}>
                      <User className="w-4 h-4 mr-2" />
                      View My Profile
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/creator/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};