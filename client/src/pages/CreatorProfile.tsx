import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EdgeToEdgeContainer } from '@/components/layout/EdgeToEdgeContainer';
import { CommentSection } from '@/components/fan/CommentSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Heart, MessageSquare, Calendar, Eye, Share2, ArrowLeft, Image, Video, Music, FileText, Loader2, Users, Star, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { OnlineStatusIndicator } from '@/components/OnlineStatusIndicator';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Creator {
  id: number;
  username: string;
  display_name: string;
  bio: string;
  avatar: string;
  cover_photo: string;
  total_subscribers: number;
  total_posts: number;
  created_at: string;
  is_verified: boolean;
}

interface Post {
  id: number;
  creator_id: number;
  title: string;
  content: string;
  media_url: string;
  media_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  tier_required: string;
  creator: {
    id: number;
    username: string;
    display_name: string;
    avatar: string;
  };
}

interface Tier {
  id: number;
  name: string;
  price: number;
  description: string;
  benefits: string[];
}

interface Subscription {
  id: number;
  tier_name: string;
  status: string;
}

export const CreatorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [creator, setCreator] = useState<Creator | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [onlineStatus, setOnlineStatus] = useState<{ is_online: boolean; last_seen: string | null }>({ is_online: false, last_seen: null });
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchCreator = async () => {
      if (!username) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/users/username/${username}`);
        if (!response.ok) {
          if (response.status === 404) {
            navigate('/404');
            return;
          }
          throw new Error('Failed to fetch creator');
        }
        const creatorData = await response.json();
        setCreator(creatorData);

        // Fetch tiers
        const tiersResponse = await fetch(`/api/creators/${creatorData.id}/tiers`);
        if (tiersResponse.ok) {
          const tiersData = await tiersResponse.json();
          setTiers(tiersData);
        }

        // Fetch subscription status if user is logged in and not the creator
        if (user && user.id !== creatorData.id) {
          try {
            const subResponse = await fetch(`/api/subscriptions/user/${user.id}/creator/${creatorData.id}`);
            if (subResponse.ok) {
              const subData = await subResponse.json();
              setSubscription(subData);
            }
          } catch (error) {
            console.log('No active subscription found');
          }
        }

        // Fetch online status
        const statusResponse = await fetch(`/api/users/${creatorData.id}/online-status`);
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setOnlineStatus(statusData);
        }

      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load creator profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [username, user, navigate, toast]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPostsLoading(true);
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');

        const allPosts = await response.json();
        const creatorPosts = allPosts.filter((post: Post) => 
          post.creator.username === username && post.status === 'published'
        );
        setPosts(creatorPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    if (username) {
      fetchPosts();
    }
  }, [username]);

  const handleSubscribe = (tier: Tier) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe to creators",
        variant: "destructive",
      });
      return;
    }

    if (user.role !== 'fan') {
      toast({
        title: "Access denied",
        description: "Only fans can subscribe to creators",
        variant: "destructive",
      });
      return;
    }

    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  const handlePostClick = (post: Post) => {
    if (post.media_type === 'video') {
      navigate(`/watch/${post.id}`);
    } else {
      setSelectedPost(post);
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Creator not found</h1>
          <p className="text-muted-foreground mb-4">The creator you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/explore">Explore Creators</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <EdgeToEdgeContainer>
      <div className="min-h-screen bg-background">
        {/* Header with Cover Photo */}
        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
          {creator.cover_photo ? (
            <img
              src={creator.cover_photo}
              alt={`${creator.display_name}'s cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20" />
          )}
          <div className="absolute inset-0 bg-black/20" />

          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 text-white hover:bg-white/20 z-10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-20">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background">
                  <AvatarImage src={creator.avatar} alt={creator.display_name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {creator.display_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <OnlineStatusIndicator
                  isOnline={onlineStatus.is_online}
                  lastSeen={onlineStatus.last_seen}
                  className="absolute -bottom-1 -right-1 w-6 h-6 border-2 border-background"
                />
              </div>

              {/* Creator Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {creator.display_name}
                      </h1>
                      {creator.is_verified && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">@{creator.username}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {creator.total_subscribers.toLocaleString()} subscribers
                      </span>
                      <span>{creator.total_posts} posts</span>
                    </div>
                    {creator.bio && (
                      <p className="text-foreground max-w-2xl">{creator.bio}</p>
                    )}
                  </div>

                  {/* Subscribe Button */}
                  {user && user.id !== creator.id && (
                    <div className="flex gap-2">
                      {subscription ? (
                        <Badge variant="secondary" className="px-4 py-2">
                          Subscribed ({subscription.tier_name})
                        </Badge>
                      ) : tiers.length > 0 ? (
                        <Button
                          onClick={() => handleSubscribe(tiers[0])}
                          className="px-6"
                        >
                          Subscribe
                        </Button>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Posts ({posts.length})
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                {postsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-lg aspect-video" />
                        <div className="p-3 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">
                      {creator.display_name} hasn't shared any content yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="feed-card cursor-pointer group"
                        onClick={() => handlePostClick(post)}
                      >
                        <div className="feed-card-thumbnail">
                          {post.media_url && (
                            post.media_type === 'video' ? (
                              <div className="relative">
                                <video
                                  src={post.media_url}
                                  className="w-full h-full object-cover"
                                  muted
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Play className="w-12 h-12 text-white" />
                                </div>
                              </div>
                            ) : (
                              <img
                                src={post.media_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            )
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                            {getMediaIcon(post.media_type)}
                          </div>
                        </div>

                        <div className="feed-card-content">
                          <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatDate(post.created_at)}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {post.likes_count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Bio */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {creator.bio || "No bio available."}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subscribers</span>
                        <span className="font-semibold">{creator.total_subscribers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Posts</span>
                        <span className="font-semibold">{creator.total_posts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-semibold">
                          {new Date(creator.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription Tiers */}
                  {tiers.length > 0 && (
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Subscription Tiers</CardTitle>
                        <CardDescription>
                          Support {creator.display_name} and get exclusive content
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {tiers.map((tier) => (
                            <Card key={tier.id} className="border-2 hover:border-primary/50 transition-colors">
                              <CardHeader>
                                <CardTitle className="text-lg">{tier.name}</CardTitle>
                                <CardDescription className="text-2xl font-bold text-primary">
                                  ${tier.price}/month
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {tier.description}
                                </p>
                                {tier.benefits && tier.benefits.length > 0 && (
                                  <ul className="space-y-1 text-sm mb-4">
                                    {tier.benefits.map((benefit, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-primary rounded-full" />
                                        {benefit}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {user && user.id !== creator.id && (
                                  <Button
                                    onClick={() => handleSubscribe(tier)}
                                    className="w-full"
                                    variant={subscription?.tier_name === tier.name ? "secondary" : "default"}
                                    disabled={subscription?.tier_name === tier.name}
                                  >
                                    {subscription?.tier_name === tier.name ? "Current Plan" : "Subscribe"}
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Post Modal */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedPost.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {selectedPost.media_url && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={selectedPost.media_url}
                        alt={selectedPost.title}
                        className="w-full max-h-96 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-muted-foreground">{selectedPost.content}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatDate(selectedPost.created_at)}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {selectedPost.views_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {selectedPost.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {selectedPost.comments_count}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Modal */}
        {showPaymentModal && selectedTier && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedTier(null);
            }}
            tier={selectedTier}
            creator={creator}
          />
        )}
      </div>
    </EdgeToEdgeContainer>
  );
};