
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageSquare, Calendar, CreditCard, TrendingUp, Star } from 'lucide-react';

// Mock data for subscriptions
const MOCK_SUBSCRIPTIONS = [
  {
    id: '1',
    creator: {
      username: 'artisticmia',
      display_name: 'Artistic Mia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
    },
    tier: 'Fan',
    price: 15,
    status: 'active',
    next_billing: '2024-02-15',
    joined: '2024-01-15'
  },
  {
    id: '2',
    creator: {
      username: 'fitnessking',
      display_name: 'Fitness King',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    tier: 'Basic',
    price: 10,
    status: 'active',
    next_billing: '2024-02-20',
    joined: '2024-01-20'
  }
];

const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'new_post',
    creator: 'Artistic Mia',
    message: 'shared a new digital artwork',
    time: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    type: 'live_stream',
    creator: 'Fitness King',
    message: 'started a live workout session',
    time: '4 hours ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    type: 'message',
    creator: 'Music Maker',
    message: 'sent you a message',
    time: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
  }
];

export const FanDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your favorite creators
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-foreground">{MOCK_SUBSCRIPTIONS.length}</p>
                    </div>
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Spending</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${MOCK_SUBSCRIPTIONS.reduce((sum, sub) => sum + sub.price, 0)}
                      </p>
                    </div>
                    <CreditCard className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">New Content</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Subscriptions */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Your Subscriptions
                </CardTitle>
                <CardDescription>
                  Manage your active creator subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_SUBSCRIPTIONS.map((subscription) => (
                  <div key={subscription.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={subscription.creator.avatar} alt={subscription.creator.username} />
                        <AvatarFallback>{subscription.creator.display_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-foreground">{subscription.creator.display_name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{subscription.tier}</Badge>
                          <span className="text-sm text-muted-foreground">
                            ${subscription.price}/month
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Next billing</p>
                      <p className="text-sm font-medium">{subscription.next_billing}</p>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/fan/subscriptions">Manage All Subscriptions</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/feed">
                        <Calendar className="w-4 h-4 mr-2" />
                        View My Feed
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/explore">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Discover Creators
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/fan/messages">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Payment Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next billing</span>
                      <span className="font-medium">Feb 15, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment method</span>
                      <span className="font-medium">•••• 4242</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/fan/payment">Update Payment Method</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} alt={activity.creator} />
                      <AvatarFallback>{activity.creator.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.creator}</span>{' '}
                        <span className="text-muted-foreground">{activity.message}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover new creators based on your interests
                </p>
                <Button variant="premium" size="sm" className="w-full" asChild>
                  <Link to="/explore">Explore Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
