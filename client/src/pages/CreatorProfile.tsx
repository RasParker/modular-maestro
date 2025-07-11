import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/shared/Navbar';
import { CommentSection } from '@/components/fan/CommentSection';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Users, 
  DollarSign, 
  Check, 
  Eye, 
  EyeOff, 
  Settings, 
  BarChart3, 
  TrendingUp,
  MessageSquare,
  Heart,
  Pin,
  Edit,
  Calendar,
  Crown,
  Gift,
  Bell
} from 'lucide-react';

// Mock creator data with recent posts
const MOCK_CREATOR = {
  id: '2',
  username: 'artisticmia',
  display_name: 'Artistic Mia',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face',
  cover: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=300&fit=crop',
  bio: 'Digital artist creating stunning fantasy worlds and characters. Join me for exclusive art tutorials, behind-the-scenes content, and early access to my latest creations.',
  subscribers: 2840,
  verified: true,
  tiers: [
    { 
      id: '1',
      name: 'Supporter', 
      price: 5,
      description: 'Access to basic content and community posts',
      features: ['Weekly art posts', 'Community access', 'Behind-the-scenes content']
    },
    { 
      id: '2',
      name: 'Fan', 
      price: 15,
      description: 'Everything in Supporter plus exclusive tutorials',
      features: ['Everything in Supporter', 'Monthly tutorials', 'Process videos', 'High-res downloads']
    },
    { 
      id: '3',
      name: 'Superfan', 
      price: 25,
      description: 'Ultimate access with personal interaction',
      features: ['Everything in Fan', 'Direct messaging', '1-on-1 feedback', 'Custom artwork requests']
    }
  ],
  recentPosts: [
    {
      id: '1',
      title: 'New Digital Art Collection',
      content: 'Check out my latest digital artwork featuring cyberpunk themes...',
      mediaType: 'image',
      tier: 'Fan',
      createdAt: '2024-02-19T10:30:00',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Behind the Scenes Process',
      content: 'Here\'s how I create my digital masterpieces...',
      mediaType: 'video',
      tier: 'Superfan',
      createdAt: '2024-02-18T15:20:00',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    }
  ]
};

// Mock data for creator analytics and engagement
const CREATOR_ANALYTICS = {
  monthlyEarnings: 4200,
  totalEarnings: 18500,
  growthRate: 15.2,
  engagementRate: 78,
  tierBreakdown: [
    { name: 'Supporter', price: 5, subscribers: 1200, revenue: 6000 },
    { name: 'Fan', price: 15, subscribers: 980, revenue: 14700 },
    { name: 'Superfan', price: 25, subscribers: 660, revenue: 16500 }
  ],
  recentSubscribers: [
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
  ]
};

// Mock posts with enhanced data for creator view
const ENHANCED_POSTS = [
  {
    id: '1',
    title: 'New Digital Art Collection',
    content: 'Check out my latest digital artwork featuring cyberpunk themes. This piece took me over 20 hours to complete and includes some new techniques I\'ve been experimenting with.',
    mediaType: 'image',
    tier: 'Fan',
    createdAt: '2024-02-19T10:30:00',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    likes: 847,
    comments: 23,
    views: 1250,
    isPinned: true
  },
  {
    id: '2',
    title: 'Behind the Scenes Process',
    content: 'Here\'s how I create my digital masterpieces. From initial sketch to final render, this video shows my complete workflow.',
    mediaType: 'video',
    tier: 'Superfan',
    createdAt: '2024-02-18T15:20:00',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    likes: 156,
    comments: 8,
    views: 350,
    isPinned: false
  },
  {
    id: '3',
    title: 'Tutorial: Character Design Basics',
    content: 'Learn the fundamentals of character design in this comprehensive tutorial.',
    mediaType: 'video',
    tier: 'Fan',
    createdAt: '2024-02-17T09:15:00',
    thumbnail: 'https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=400&h=300&fit=crop',
    likes: 423,
    comments: 15,
    views: 890,
    isPinned: false
  }
];

export const CreatorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for creator view management
  const [isCreatorView, setIsCreatorView] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [announcementText, setAnnouncementText] = useState('');
  
  // In real app, would fetch creator data based on username
  const creator = MOCK_CREATOR;
  const isOwner = user?.role === 'creator' && (user?.username === creator.username || user?.email === 'creator@example.com');

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      window.location.href = `/login?redirect=/creator/${username}`;
      return;
    }
    console.log(`Subscribing to tier ${tierId}`);
    toast({
      title: "Subscription initiated",
      description: `You're subscribing to the ${creator.tiers.find(t => t.id === tierId)?.name} tier.`,
    });
  };

  const handlePinPost = (postId: string) => {
    console.log(`Pinning post ${postId}`);
    toast({
      title: "Post pinned",
      description: "This post will appear at the top of your profile.",
    });
  };

  const handleUnpinPost = (postId: string) => {
    console.log(`Unpinning post ${postId}`);
    toast({
      title: "Post unpinned",
      description: "This post will appear in chronological order.",
    });
  };

  const handlePostAnnouncement = () => {
    if (!announcementText.trim()) return;
    console.log(`Posting announcement: ${announcementText}`);
    toast({
      title: "Announcement posted",
      description: "Your announcement has been shared with all subscribers.",
    });
    setAnnouncementText('');
  };

  const handleWelcomeSubscriber = (subscriberId: string) => {
    console.log(`Welcoming subscriber ${subscriberId}`);
    toast({
      title: "Welcome message sent",
      description: "Your personal welcome has been sent to the new subscriber.",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Creator Header */}
      <div className="relative">
        <div className="h-48 md:h-64 overflow-hidden">
          <img 
            src={creator.cover} 
            alt={creator.display_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-6xl mx-auto flex items-end gap-4">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={creator.avatar} alt={creator.username} />
              <AvatarFallback className="text-2xl">{creator.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{creator.display_name}</h1>
                {creator.verified && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {isOwner && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <Crown className="w-3 h-3 mr-1" />
                    Your Profile
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{creator.username}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {creator.subscribers.toLocaleString()} subscribers
                </div>
                {isOwner && isCreatorView && (
                  <div className="flex items-center gap-1 text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    +{CREATOR_ANALYTICS.growthRate}% this month
                  </div>
                )}
              </div>
            </div>

            {/* Creator View Toggle */}
            {isOwner && (
              <div className="flex items-center gap-4 pb-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="creator-view"
                    checked={isCreatorView}
                    onCheckedChange={setIsCreatorView}
                  />
                  <Label htmlFor="creator-view" className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isCreatorView ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {isCreatorView ? 'Creator View' : 'Public View'}
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/settings">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Creator Analytics Bar - Only visible in creator view */}
      {isOwner && isCreatorView && (
        <div className="border-b border-border/50 bg-gradient-card">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">${CREATOR_ANALYTICS.monthlyEarnings.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{CREATOR_ANALYTICS.engagementRate}%</div>
                <div className="text-xs text-muted-foreground">Engagement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{CREATOR_ANALYTICS.recentSubscribers.length}</div>
                <div className="text-xs text-muted-foreground">New This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{ENHANCED_POSTS.reduce((acc, post) => acc + post.views, 0).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Views</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="tiers">Subscription Tiers</TabsTrigger>
            {isOwner && isCreatorView && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Creator Announcement Tool */}
                {isOwner && isCreatorView && (
                  <Card className="bg-gradient-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Post Announcement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Share an update with all your subscribers..."
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button 
                        onClick={handlePostAnnouncement}
                        disabled={!announcementText.trim()}
                        className="w-full"
                      >
                        Post Announcement
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* About Section */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>
                  </CardContent>
                </Card>
                
                {/* Enhanced Posts */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ENHANCED_POSTS.map((post) => (
                      <Card key={post.id} className="bg-background/50 border-border/30 relative">
                        {post.isPinned && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={post.thumbnail} 
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h3 className="font-medium text-foreground">{post.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {post.content}
                                  </p>
                                  <div className="flex items-center gap-4 mt-3">
                                    <Badge variant="outline" className="text-xs">
                                      {post.tier}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {getTimeAgo(post.createdAt)}
                                    </span>
                                    {(isOwner && isCreatorView) && (
                                      <>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Eye className="w-3 h-3" />
                                          {post.views}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Heart className="w-3 h-3" />
                                          {post.likes}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <MessageSquare className="w-3 h-3" />
                                          {post.comments}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {isOwner && isCreatorView && (
                                  <div className="flex flex-col gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => post.isPinned ? handleUnpinPost(post.id) : handlePinPost(post.id)}
                                    >
                                      <Pin className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Comments Section */}
                          <div className="mt-4">
                            <CommentSection postId={post.id} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {!isOwner && (
                      <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                          <div className="text-center py-4">
                            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Subscribe to view more content</h3>
                            <p className="text-muted-foreground text-sm">
                              Subscribe to {creator.display_name} to see their exclusive posts and content.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Subscribers - Creator View */}
                {isOwner && isCreatorView && (
                  <Card className="bg-gradient-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {CREATOR_ANALYTICS.recentSubscribers.map((subscriber) => (
                        <div key={subscriber.id} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={subscriber.avatar} alt={subscriber.username} />
                            <AvatarFallback>{subscriber.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{subscriber.username}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{subscriber.tier}</Badge>
                              <span className="text-xs text-muted-foreground">{subscriber.joined}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWelcomeSubscriber(subscriber.id)}
                          >
                            <Gift className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* About Section for Non-Owner */}
                {!isOwner && (
                  <Card className="bg-gradient-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">About {creator.display_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">{creator.bio}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6 mt-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Community Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Community features coming soon! This will show recent comments, top fans, and community highlights.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tiers Tab */}
          <TabsContent value="tiers" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creator.tiers.map((tier, index) => {
                const analytics = CREATOR_ANALYTICS.tierBreakdown[index];
                return (
                  <Card key={tier.id} className="bg-gradient-card border-border/50">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{tier.name}</h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-accent">${tier.price}</div>
                            <div className="text-sm text-muted-foreground">per month</div>
                          </div>
                        </div>
                        
                        {/* Tier Performance - Creator View */}
                        {isOwner && isCreatorView && analytics && (
                          <div className="space-y-2 p-3 bg-background/50 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span>Subscribers:</span>
                              <span className="font-medium">{analytics.subscribers}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Monthly Revenue:</span>
                              <span className="font-medium text-green-500">${analytics.revenue.toLocaleString()}</span>
                            </div>
                            <Progress 
                              value={(analytics.subscribers / creator.subscribers) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                        
                        <ul className="space-y-2">
                          {tier.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-accent" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {!isOwner && (
                          <Button 
                            variant="premium" 
                            className="w-full"
                            onClick={() => handleSubscribe(tier.id)}
                          >
                            Subscribe
                          </Button>
                        )}

                        {isOwner && isCreatorView && (
                          <Button variant="outline" className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Tier
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab - Creator Only */}
          {isOwner && isCreatorView && (
            <TabsContent value="analytics" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Revenue Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Earnings</span>
                        <span className="font-semibold">${CREATOR_ANALYTICS.monthlyEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Earnings</span>
                        <span className="font-semibold">${CREATOR_ANALYTICS.totalEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Growth Rate</span>
                        <span className="font-semibold text-green-500">+{CREATOR_ANALYTICS.growthRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Engagement Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Engagement Rate</span>
                        <span className="font-semibold">{CREATOR_ANALYTICS.engagementRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Views</span>
                        <span className="font-semibold">{ENHANCED_POSTS.reduce((acc, post) => acc + post.views, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Likes</span>
                        <span className="font-semibold">{ENHANCED_POSTS.reduce((acc, post) => acc + post.likes, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};
