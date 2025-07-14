import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { SubscriptionCard } from '@/components/fan/SubscriptionCard';
import { ArrowLeft, Heart, CreditCard, Calendar } from 'lucide-react';
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
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/fan/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            Manage Subscriptions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage all your creator subscriptions
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {subscriptions.filter(sub => sub.status === 'active').length}
                  </p>
                </div>
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Spending</p>
                  <p className="text-2xl font-bold text-foreground">GHS {totalMonthlySpend}</p>
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
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">Your Subscriptions ({subscriptions.length})</h2>
          </div>
          
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onPauseResume={handlePauseResume}
              onCancel={handleCancel}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
