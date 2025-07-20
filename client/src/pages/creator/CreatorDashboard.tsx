import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EdgeToEdgeContainer } from '@/components/layout/EdgeToEdgeContainer';
import { DashboardHeader } from '@/components/creator/DashboardHeader';
import { QuickActionsGrid } from '@/components/creator/QuickActionsGrid';
import { ContentScheduleCard } from '@/components/creator/ContentScheduleCard';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  Settings,
  User,
  Crown,
  FileText,
  Eye,
  Heart,
  MessageSquare,
  Image,
  Video,
  Clock,
  CreditCard,
  Activity,
  Star
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();

  // Real posts will be fetched from API
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [scheduledContent, setScheduledContent] = useState<any[]>([]);
  const [recentSubscribers, setRecentSubscribers] = useState<any[]>([]);
  const [tierPerformance, setTierPerformance] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    subscribers: 0,
    monthlyEarnings: 0,
    totalEarnings: 0,
    growthRate: 0,
    engagementRate: 0,
    postsThisMonth: 0
  });
  const [monthlyGoals, setMonthlyGoals] = useState({
    subscriberGoal: 0,
    revenueGoal: 0,
    postsGoal: 0,
    currentSubscribers: 0,
    currentRevenue: 0,
    currentPosts: 0
  });

  // Use React Query for monthly goals
  const { data: goalsData, refetch: refetchGoals } = useQuery({
    queryKey: ['creator', user?.id, 'goals'],
    queryFn: async () => {
      if (!user) return null;
      const response = await fetch(`/api/creator/${user.id}/goals`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched goals data:', data);
        return data;
      }
      return null;
    },
    enabled: !!user
  });

  const fetchUserPosts = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/creator/${user.id}/content`);
      if (response.ok) {
        const posts = await response.json();
        console.log('Fetched user content:', posts);


        // Filter for scheduled content - check for both status and scheduled_for date
        const scheduled = posts.filter((post: any) => 
          post.status === 'scheduled' || 
          (post.scheduled_for && new Date(post.scheduled_for) > new Date())
        );
        console.log('Filtered scheduled content:', scheduled);
        setScheduledContent(scheduled);

        // Filter for published posts only for Recent Posts section
        const publishedPosts = posts.filter((post: any) => 
          post.status === 'published'
        );
        setUserPosts(publishedPosts);
      }

      // Fetch real analytics data first
      const analyticsResponse = await fetch(`/api/creator/${user.id}/analytics`);
      let analyticsData = { subscribers: 0, monthlyEarnings: 0, totalEarnings: 0, growthRate: 0, engagementRate: 0, postsThisMonth: 0 };
      if (analyticsResponse.ok) {
        analyticsData = await analyticsResponse.json();
        setAnalytics({
          subscribers: analyticsData.subscribers || 0,
          monthlyEarnings: analyticsData.monthlyEarnings || 0,
          totalEarnings: analyticsData.totalEarnings || 0,
          growthRate: analyticsData.growthRate || 0,
          engagementRate: analyticsData.engagementRate || 0,
          postsThisMonth: analyticsData.postsThisMonth || 0
        });
      }

      // Fetch recent subscribers
      try {
        const subscribersResponse = await fetch(`/api/creators/${user.id}/subscribers?limit=3&recent=true`);
        if (subscribersResponse.ok) {
          const subscribers = await subscribersResponse.json();
          setRecentSubscribers(subscribers);
        }
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }

      // Fetch tier performance data
      try {
        console.log('About to fetch tier performance for user:', user.id);
        const tierPerformanceResponse = await fetch(`/api/creator/${user.id}/tier-performance`);
        console.log('Tier performance response status:', tierPerformanceResponse.status);
        if (tierPerformanceResponse.ok) {
          const tierData = await tierPerformanceResponse.json();
          console.log('Fetched tier performance data:', tierData);
          setTierPerformance(tierData);
        } else {
          console.error('Failed to fetch tier performance:', tierPerformanceResponse.status);
        }
      } catch (error) {
        console.error('Error fetching tier performance:', error);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  // Separate useEffect for goals data
  useEffect(() => {
    if (goalsData) {
      console.log('Updating monthly goals with:', goalsData);
      setMonthlyGoals({
        subscriberGoal: goalsData.subscriberGoal || 30,
        revenueGoal: goalsData.revenueGoal || 1000, 
        postsGoal: goalsData.postsGoal || 15,
        currentSubscribers: analytics.subscribers || 0,
        currentRevenue: analytics.monthlyEarnings || 0,
        currentPosts: analytics.postsThisMonth || 0
      });
    }
  }, [goalsData, analytics]);

  // Refetch data when window gains focus (when user comes back from settings)
  useEffect(() => {
    const handleFocus = () => {
      fetchUserPosts();
      refetchGoals();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, refetchGoals]);

  return (
    <EdgeToEdgeContainer>
      {/* Hero Section - Full Width */}
      <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 border-b border-border">
        <EdgeToEdgeContainer maxWidth="7xl" enablePadding enableTopPadding>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-10 h-10 text-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Creator Dashboard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Welcome back, {user?.username}! Here's your creator overview
            </p>
          </div>
        </EdgeToEdgeContainer>
      </div>

      {/* Main Content */}
      <EdgeToEdgeContainer maxWidth="7xl" enablePadding className="py-6 sm:py-8">

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Key Metrics */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Subscribers</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{analytics.subscribers.toLocaleString()}</p>
                    <p className="text-xs text-success">+{analytics.growthRate}% this month</p>
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
                    <p className="text-xl sm:text-2xl font-bold text-foreground">GHS {analytics.monthlyEarnings.toLocaleString()}</p>
                    <p className="text-xs text-success">+{analytics.growthRate}% vs last month</p>
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
                    <p className="text-xl sm:text-2xl font-bold text-foreground">GHS {analytics.totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-success">All time</p>
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
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{analytics.engagementRate}%</p>
                    <p className="text-xs text-success">Above average</p>
                  </div>
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Your Subscriptions - Center aligned title */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-base sm:text-xl">Your Subscriptions</CardTitle>
                <CardDescription className="text-sm">Revenue breakdown by tier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {console.log('Rendering tier performance, length:', tierPerformance.length, 'data:', tierPerformance)}
                {tierPerformance.length > 0 ? (
                  tierPerformance.map((tier) => (
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
                        value={analytics.subscribers > 0 ? (tier.subscribers / analytics.subscribers) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No subscription tiers found</p>
                    <p className="text-xs text-muted-foreground mb-4">Create subscription tiers to start earning revenue</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link to="/creator/tiers">Create Tiers</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions - Center aligned title and button text */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-base sm:text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-sm">Manage your content and grow your audience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Button asChild className="h-16 flex-col gap-2">
                    <Link to="/creator/upload" className="text-center">
                      <FileText className="w-5 h-5" />
                      <span className="text-xs">Create Post</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-16 flex-col gap-2">
                    <Link to="/creator/manage-content" className="text-center">
                      <Calendar className="w-5 h-5" />
                      <span className="text-xs">Schedule Content</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-16 flex-col gap-2">
                    <Link to="/creator/analytics" className="text-center">
                      <BarChart3 className="w-5 h-5" />
                      <span className="text-xs">View Analytics</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-16 flex-col gap-2">
                    <Link to="/creator/subscribers" className="text-center">
                      <Users className="w-5 h-5" />
                      <span className="text-xs">Subscribers</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info - Center aligned title */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-base sm:text-xl flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Info
                </CardTitle>
                <CardDescription className="text-sm">Your earnings and payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-foreground">GHS {analytics.monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                    <p className="text-2xl font-bold text-foreground">GHS {analytics.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/creator/earnings">View Detailed Earnings</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity - Center aligned title */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-base sm:text-xl flex items-center justify-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-sm">Latest updates from your content</CardDescription>
              </CardHeader>
              <CardContent>
                {userPosts.length > 0 ? (
                  <div className="space-y-4">
                    {userPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                        <div className="flex-shrink-0">
                          {post.media_urls && post.media_urls.length > 0 ? (
                            (() => {
                              const mediaUrl = post.media_urls[0].startsWith('/uploads/') 
                                ? post.media_urls[0] 
                                : `/uploads/${post.media_urls[0]}`;

                              return post.media_type === 'video' ? (
                                <video
                                  src={mediaUrl}
                                  className="w-12 h-12 object-cover rounded-lg"
                                  muted
                                  preload="metadata"
                                />
                              ) : (
                                <img
                                  src={mediaUrl}
                                  alt={post.title || 'Post'}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              );
                            })()
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{post.caption || post.title || 'Untitled Post'}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Eye className="w-3 h-3" />
                              <span>{post.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Heart className="w-3 h-3" />
                              <span>{post.likes || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link to="/creator/upload">Create Your First Post</Link>
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
                {recentSubscribers.length > 0 ? (
                  <>
                    {recentSubscribers.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center gap-3">
                        <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                          <AvatarImage 
                            src={subscriber.fan?.avatar || subscriber.avatar} 
                            alt={subscriber.fan?.username || subscriber.username} 
                          />
                          <AvatarFallback className="text-xs">
                            {(subscriber.fan?.username || subscriber.username)?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {subscriber.fan?.username || subscriber.username}
                          </p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <Badge variant="outline" className="text-xs">
                              {subscriber.tier_name || subscriber.tier || 'Subscriber'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {subscriber.created_at 
                                ? new Date(subscriber.created_at).toLocaleDateString() === new Date().toLocaleDateString()
                                  ? 'Today'
                                  : new Date(subscriber.created_at).toLocaleDateString()
                                : 'Recently'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/creator/subscribers">View All</Link>
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No subscribers yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Share your profile to start gaining subscribers</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link to={`/creator/${user?.username}`}>View Profile</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Goals */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">Monthly Goals</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/settings?tab=goals">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Goals
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subscriber Goal</span>
                    <span>{monthlyGoals.currentSubscribers.toLocaleString()} / {monthlyGoals.subscriberGoal.toLocaleString()}</span>
                  </div>
                  <Progress value={(monthlyGoals.currentSubscribers / monthlyGoals.subscriberGoal) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Revenue Goal</span>
                    <span>GHS {monthlyGoals.currentRevenue.toLocaleString()} / {monthlyGoals.revenueGoal.toLocaleString()}</span>
                  </div>
                  <Progress value={(monthlyGoals.currentRevenue / monthlyGoals.revenueGoal) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Posts Goal</span>
                    <span>{monthlyGoals.currentPosts} / {monthlyGoals.postsGoal}</span>
                  </div>
                  <Progress value={(monthlyGoals.currentPosts / monthlyGoals.postsGoal) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recommended for You - Center aligned title */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-base sm:text-lg flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  Recommended for You
                </CardTitle>
                <CardDescription className="text-sm">Tips to grow your audience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-sm font-medium">Upload consistently</p>
                  <p className="text-xs text-muted-foreground">Regular posting helps build audience engagement</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-sm font-medium">Engage with subscribers</p>
                  <p className="text-xs text-muted-foreground">Respond to comments and messages</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-sm font-medium">Create tier content</p>
                  <p className="text-xs text-muted-foreground">Offer exclusive content for different tiers</p>
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

      </EdgeToEdgeContainer>
    </EdgeToEdgeContainer>
  );
};