import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { SubscriptionCard } from '@/components/fan/SubscriptionCard';
import { ArrowLeft, Heart, CreditCard, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface Subscription {
  id: number;
  creator: {
    id: number;
    username: string;
    display_name: string;
    avatar: string;
  };
  tier: {
    name: string;
    price: number;
  };
  status: string;
  current_period_end: string;
  created_at: string;
  auto_renew: boolean;
}

export const ManageSubscriptions: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/subscriptions/fan/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }
        const data = await response.json();
        setSubscriptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  const handlePauseResume = (subscriptionId: number) => {
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

  const handleCancel = (subscriptionId: number) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
    toast({
      title: "Subscription cancelled",
      description: "Your subscription has been cancelled successfully.",
      variant: "destructive",
    });
  };

  const totalMonthlySpend = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + parseFloat(sub.tier.price.toString()), 0);

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
            <h2 className="text-lg sm:text-xl font-semibold">
              Your Subscriptions ({loading ? '...' : subscriptions.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Error loading subscriptions: {error}</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active subscriptions yet.</p>
              <Button variant="premium" className="mt-4" asChild>
                <Link to="/explore">Discover Creators</Link>
              </Button>
            </div>
          ) : (
            subscriptions.map((subscription) => {
              // Transform the subscription data to match SubscriptionCard expectations
              const transformedSubscription = {
                id: subscription.id.toString(),
                creator: {
                  username: subscription.creator.username,
                  display_name: subscription.creator.display_name || subscription.creator.username,
                  avatar: subscription.creator.avatar || '',
                  category: 'General' // Default category since it's not in our API data
                },
                tier: subscription.tier.name,
                price: parseFloat(subscription.tier.price.toString()),
                status: subscription.status,
                next_billing: new Date(subscription.current_period_end).toLocaleDateString(),
                joined: new Date(subscription.created_at).toLocaleDateString(),
                auto_renew: subscription.auto_renew
              };

              return (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={transformedSubscription}
                  onPauseResume={(id) => handlePauseResume(parseInt(id))}
                  onCancel={(id) => handleCancel(parseInt(id))}
                />
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
};
