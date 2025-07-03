import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Heart, CreditCard, Calendar, Pause, Play, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_SUBSCRIPTIONS = [
  {
    id: '1',
    creator: {
      username: 'artisticmia',
      display_name: 'Artistic Mia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face',
      category: 'Art'
    },
    tier: 'Fan',
    price: 15,
    status: 'active',
    next_billing: '2024-02-15',
    joined: '2024-01-15',
    auto_renew: true
  },
  {
    id: '2',
    creator: {
      username: 'fitnessking',
      display_name: 'Fitness King',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      category: 'Fitness'
    },
    tier: 'Basic',
    price: 10,
    status: 'active',
    next_billing: '2024-02-20',
    joined: '2024-01-20',
    auto_renew: true
  },
  {
    id: '3',
    creator: {
      username: 'musicmaker',
      display_name: 'Music Maker',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face',
      category: 'Music'
    },
    tier: 'Producer',
    price: 18,
    status: 'paused',
    next_billing: '2024-03-01',
    joined: '2024-01-10',
    auto_renew: false
  }
];

export const ManageSubscriptions: React.FC = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);

  const handlePauseResume = (subscriptionId: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscriptionId 
        ? { 
            ...sub, 
            status: sub.status === 'active' ? 'paused' : 'active',
            auto_renew: sub.status === 'paused'
          }
        : sub
    ));
    
    const subscription = subscriptions.find(sub => sub.id === subscriptionId);
    toast({
      title: subscription?.status === 'active' ? "Subscription paused" : "Subscription resumed",
      description: subscription?.status === 'active' 
        ? "Your subscription has been paused and will not renew." 
        : "Your subscription has been resumed.",
    });
  };

  const handleCancel = (subscriptionId: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
    toast({
      title: "Subscription cancelled",
      description: "Your subscription has been cancelled successfully.",
      variant: "destructive",
    });
  };

  const totalMonthlySpend = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/fan/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            Manage Subscriptions
          </h1>
          <p className="text-muted-foreground">
            View and manage all your creator subscriptions
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {subscriptions.filter(sub => sub.status === 'active').length}
                  </p>
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
                  <p className="text-2xl font-bold text-foreground">${totalMonthlySpend}</p>
                </div>
                <CreditCard className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-2xl font-bold text-foreground">Jan 2024</p>
                </div>
                <Calendar className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Your Subscriptions ({subscriptions.length})</CardTitle>
            <CardDescription>Manage your creator subscriptions and billing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="p-6 rounded-lg border border-border/50 bg-muted/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={subscription.creator.avatar} alt={subscription.creator.username} />
                        <AvatarFallback>{subscription.creator.display_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{subscription.creator.display_name}</h3>
                        <p className="text-sm text-muted-foreground">@{subscription.creator.username}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{subscription.creator.category}</Badge>
                          <Badge variant="outline">{subscription.tier}</Badge>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">${subscription.price}/month</p>
                      <p className="text-sm text-muted-foreground">
                        Next billing: {subscription.next_billing}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {new Date(subscription.joined).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Auto-renew:</span>
                      <Badge variant={subscription.auto_renew ? 'default' : 'outline'}>
                        {subscription.auto_renew ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePauseResume(subscription.id)}
                      >
                        {subscription.status === 'active' ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleCancel(subscription.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};