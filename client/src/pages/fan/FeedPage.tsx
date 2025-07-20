import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EdgeToEdgeContainer } from '@/components/layout/EdgeToEdgeContainer';
import { CommentSection } from '@/components/fan/CommentSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Heart, MessageSquare, Calendar, Eye, Share2, ArrowLeft, Image, Video, Music, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const MOCK_FEED = [
  {
    id: '1',
    creator: {
      username: 'artisticmia',
      display_name: 'Artistic Mia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Just finished my latest series of fantasy warrior illustrations! This collection took me 3 weeks to complete and features 12 unique characters.',
    type: 'image',
    tier: 'Fan',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    posted: '2024-02-19T10:30:00',
    likes: 142,
    comments: 28,
    views: 1250,
    liked: false,
    initialComments: [
      {
        id: '1',
        user: {
          id: '2',
          username: 'artlover123',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Amazing work! The detail in these characters is incredible. How long did each one take?',
        likes: 5,
        liked: false,
        createdAt: '2024-02-19T11:00:00',
        replies: [
          {
            id: '2',
            user: {
              id: '1',
              username: 'artisticmia',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
            },
            content: 'Thank you! Each character took about 6-8 hours. The armor details were the most time-consuming part.',
            likes: 2,
            liked: false,
            createdAt: '2024-02-19T11:30:00',
            replies: []
          },
          {
            id: '5',
            user: {
              id: '3',
              username: 'digitalart_fan',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
            },
            content: 'The armor textures look so realistic! What software do you use for the detail work?',
            likes: 1,
            liked: false,
            createdAt: '2024-02-19T12:15:00',
            replies: []
          }
        ]
      },
      {
        id: '6',
        user: {
          id: '4',
          username: 'fantasy_enthusiast',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Love the fantasy theme! The character designs remind me of classic D&D artwork. Are you planning to create a whole campaign setting?',
        likes: 8,
        liked: true,
        createdAt: '2024-02-19T13:00:00',
        replies: [
          {
            id: '7',
            user: {
              id: '1',
              username: 'artisticmia',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
            },
            content: 'That\'s actually a great idea! I\'ve been thinking about creating a comprehensive world with these characters. Maybe I should start working on background lore and maps.',
            likes: 4,
            liked: false,
            createdAt: '2024-02-19T13:30:00',
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: '2',
    creator: {
      username: 'fitnessking',
      display_name: 'Fitness King',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Starting the week strong with an intense upper body workout! Follow along for maximum gains. Remember to warm up properly!',
    type: 'video',
    tier: 'Supporter',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    posted: '2024-02-19T07:00:00',
    likes: 89,
    comments: 15,
    views: 892,
    liked: true,
    initialComments: [
      {
        id: '3',
        user: {
          id: '3',
          username: 'fitnessfan',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Great workout! Following along now. My arms are already burning! 💪',
        likes: 8,
        liked: true,
        createdAt: '2024-02-19T07:30:00',
        replies: [
          {
            id: '8',
            user: {
              id: '2',
              username: 'fitnessking',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            },
            content: 'That\'s the spirit! Remember to keep proper form even when it gets tough. Results come from consistency, not just intensity.',
            likes: 3,
            liked: false,
            createdAt: '2024-02-19T08:00:00',
            replies: []
          }
        ]
      },
      {
        id: '9',
        user: {
          id: '5',
          username: 'morningworkout',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Perfect timing! Just what I needed for my morning routine. How often do you recommend doing this specific workout?',
        likes: 2,
        liked: false,
        createdAt: '2024-02-19T08:15:00',
        replies: []
      }
    ]
  },
  {
    id: '3',
    creator: {
      username: 'musicmaker',
      display_name: 'Music Maker',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Working on a new beat for my upcoming album. Here\'s a sneak peek at my creative process. What genre should I explore next?',
    type: 'audio',
    tier: 'Superfan',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    posted: '2024-02-18T20:15:00',
    likes: 56,
    comments: 12,
    views: 423,
    liked: false,
    initialComments: [
      {
        id: '4',
        user: {
          id: '4',
          username: 'beathead',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        },
        content: 'This sounds fire! 🔥 Have you considered exploring some drill or UK garage elements?',
        likes: 3,
        liked: false,
        createdAt: '2024-02-18T21:00:00',
        replies: [
          {
            id: '10',
            user: {
              id: '3',
              username: 'musicmaker',
              avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
            },
            content: 'UK garage is definitely something I want to experiment with! The syncopated rhythms would work perfectly with my style.',
            likes: 1,
            liked: false,
            createdAt: '2024-02-18T21:30:00',
            replies: []
          }
        ]
      },
      {
        id: '11',
        user: {
          id: '6',
          username: 'producer_pro',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        content: 'The layering in this beat is amazing! What DAW are you using? The mixing sounds really clean.',
        likes: 6,
        liked: false,
        createdAt: '2024-02-18T22:00:00',
        replies: [
          {
            id: '12',
            user: {
              id: '3',
              username: 'musicmaker',
              avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
            },
            content: 'Thanks! I\'m using Logic Pro X with some custom plugins. The secret is in the compression chain I\'ve built over the years.',
            likes: 2,
            liked: false,
            createdAt: '2024-02-18T22:15:00',
            replies: []
          },
          {
            id: '13',
            user: {
              id: '4',
              username: 'beathead',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
            },
            content: 'Would love to hear more about your compression setup! Maybe you could do a tutorial on your production process?',
            likes: 4,
            liked: false,
            createdAt: '2024-02-18T22:45:00',
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: '4',
    creator: {
      username: 'artisticmia',
      display_name: 'Artistic Mia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Here\'s a sneak peek at my upcoming digital painting. Still working on the lighting effects and color balance. What do you think so far?',
    type: 'image',
    tier: 'Supporter',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    posted: '2024-02-20T14:15:00',
    likes: 78,
    comments: 12,
    views: 456,
    liked: false,
    initialComments: []
  }
];

export const FeedPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});
  const [expandedModalCaption, setExpandedModalCaption] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  // Fetch real posts from API
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        if (response.ok) {
          const posts = await response.json();
          
          // Transform posts to match the expected format
          const transformedPosts = posts.map((post: any) => ({
            id: post.id.toString(),
            creator: {
              username: post.username || 'Unknown',
              display_name: post.username || 'Unknown',
              avatar: post.avatar || ''
            },
            content: post.content || post.title || '',
            type: post.media_type || 'image',
            tier: post.tier || 'public',
            thumbnail: post.media_urls && post.media_urls.length > 0 
              ? `/uploads/${post.media_urls[0]}` 
              : '',
            posted: post.created_at || new Date().toISOString(),
            likes: post.likes_count || 0,
            comments: post.comments_count || 0,
            views: Math.floor(Math.random() * 1000) + 100, // Placeholder until views tracking is implemented
            liked: false, // Will be updated when user interactions are implemented
            initialComments: [] // Will be populated when comments are fetched
          }));
          
          setFeed(transformedPosts);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
        toast({
          title: "Error",
          description: "Failed to load feed. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user, toast]);

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    try {
      const currentPost = feed.find(post => post.id === postId);
      if (!currentPost) return;
      
      if (currentPost.liked) {
        // Unlike the post
        await fetch(`/api/posts/${postId}/like`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
      } else {
        // Like the post
        await fetch(`/api/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
      }
      
      // Update local state immediately for responsive UI
      setFeed(feed.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1
            }
          : post
      ));
      
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentClick = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentCountChange = (postId: string, newCount: number) => {
    setFeed(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: newCount }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    toast({
      title: "Link copied",
      description: "Post link has been copied to your clipboard.",
    });
  };

  const handleThumbnailClick = (post: any) => {
    setSelectedContent(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
    setExpandedModalCaption(false);
  };

  const toggleCaptionExpansion = (postId: string) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const truncateText = (text: string, maxLines: number = 1) => {
    const words = text.split(' ');
    // Reserve space for "... Read more" by reducing available words
    const wordsPerLine = window.innerWidth < 640 ? 8 : 14; // Reduced to leave space for "Read more"
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return { truncated: text, needsExpansion: false };
    }
    
    return {
      truncated: words.slice(0, maxWords).join(' '),
      needsExpansion: true
    };
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'public':
        return 'outline';
      case 'supporter':
      case 'starter pump':
        return 'secondary';
      case 'fan':
      case 'power gains':
        return 'secondary';
      case 'premium':
      case 'superfan':
      case 'elite beast mode':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <EdgeToEdgeContainer>
      {/* Hero Section - Full Width */}
      <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 border-b border-border">
        <EdgeToEdgeContainer maxWidth="4xl" enablePadding enableTopPadding>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Your Feed
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Latest content from creators you follow
            </p>
          </div>
        </EdgeToEdgeContainer>
      </div>

      {/* Feed Content */}
      <EdgeToEdgeContainer maxWidth="4xl" enablePadding className="py-6 sm:py-8">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
                      <div className="w-24 h-3 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-full h-48 bg-muted rounded-lg animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : feed.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Follow some creators to see their content in your feed
            </p>
            <Button asChild>
              <Link to="/explore">Discover Creators</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-0 -mx-4">
            {feed.map((post) => (
              <div key={post.id} className="mb-6">{/* Instagram-style borderless post - mobile optimized */}
                {/* Post Header - Mobile Instagram style */}
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.creator.avatar} alt={post.creator.username} />
                    <AvatarFallback>{post.creator.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 flex-1">
                    <p className="font-semibold text-foreground text-sm">{post.creator.display_name}</p>
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(post.posted)}
                    </span>
                  </div>
                </div>
                <Badge variant={getTierColor(post.tier)} className="text-xs px-1 py-0 h-4">
                  {post.tier === 'public' ? 'Free' : 
                   post.tier.toLowerCase() === 'starter pump' ? 'Starter Pump' :
                   post.tier.toLowerCase() === 'power gains' ? 'Power Gains' :
                   post.tier.toLowerCase() === 'elite beast mode' ? 'Elite Beast Mode' :
                   post.tier.toLowerCase().includes('starter') ? 'Starter Pump' :
                   post.tier.toLowerCase().includes('power') ? 'Power Gains' :
                   post.tier.toLowerCase().includes('elite') ? 'Elite Beast Mode' :
                   post.tier.toLowerCase().includes('beast') ? 'Elite Beast Mode' :
                   post.tier}
                </Badge>
              </div>
              {/* Post Media - Full width mobile Instagram style */}
              <div className="w-full">
                <div 
                  className="relative cursor-pointer active:opacity-90 transition-opacity"
                  onClick={() => handleThumbnailClick(post)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleThumbnailClick(post);
                    }
                  }}
                >
                  <img 
                    src={post.thumbnail} 
                    alt={`${post.creator.display_name}'s post`}
                    className="w-full aspect-[16/10] object-cover"
                  />
                  {/* Content type overlay - smaller for mobile */}
                  <div className="absolute top-2 left-2 z-20">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm">
                      {getTypeIcon(post.type)}
                    </div>
                  </div>
                </div>
              </div>
                
              {/* Action Buttons - Mobile Instagram style with inline stats */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${post.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`w-6 h-6 ${post.liked ? 'fill-current' : ''}`} />
                      </Button>
                      <span className="text-sm font-medium text-foreground">
                        {post.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-muted-foreground"
                        onClick={() => handleCommentClick(post.id)}
                      >
                        <MessageSquare className="w-6 h-6" />
                      </Button>
                      <span className="text-sm font-medium text-foreground">
                        {post.comments}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground"
                        onClick={() => handleShare(post.id)}
                      >
                        <Share2 className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Post Caption - Mobile Instagram style */}
                <div className="mb-1">
                  {(() => {
                    const { truncated, needsExpansion } = truncateText(post.content);
                    const isExpanded = expandedCaptions[post.id];
                    
                    return (
                      <p className="text-sm leading-relaxed text-foreground">
                        {isExpanded ? post.content : (
                          <>
                            {truncated}
                            {needsExpansion && !isExpanded && (
                              <>
                                {'... '}
                                <button
                                  onClick={() => toggleCaptionExpansion(post.id)}
                                  className="text-muted-foreground hover:text-foreground font-normal"
                                >
                                  more
                                </button>
                              </>
                            )}
                          </>
                        )}
                        {isExpanded && needsExpansion && (
                          <>
                            {' '}
                            <button
                              onClick={() => toggleCaptionExpansion(post.id)}
                              className="text-muted-foreground hover:text-foreground font-normal"
                            >
                              less
                            </button>
                          </>
                        )}
                      </p>
                    );
                  })()}
                </div>
                
                {/* View comments link */}
                {post.comments > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground text-sm font-normal"
                    onClick={() => handleCommentClick(post.id)}
                  >
                    View all {post.comments} comments
                  </Button>
                )}
              </div>
              {/* Comments Section - Mobile optimized */}
              {showComments[post.id] && (
                <div className="px-3 pb-3 border-t border-border/30 mx-3">
                  <div className="pt-3">
                    <CommentSection
                      postId={post.id}
                      initialComments={post.initialComments || []}
                      onCommentCountChange={(count) => handleCommentCountChange(post.id, count)}
                    />
                  </div>
                </div>
              )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && feed.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Posts
            </Button>
          </div>
        )}
      </EdgeToEdgeContainer>

      {/* Instagram-style Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[85vh] max-h-[85vh] aspect-square p-0 overflow-hidden border-0 [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedContent?.type} Content</DialogTitle>
            <DialogDescription>View content from {selectedContent?.creator?.display_name}</DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              {/* Back Arrow Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full text-white hover:bg-white/10"
                onClick={closeModal}
              >
                <ArrowLeft className="w-7 h-7" />
              </Button>

              {/* Square container that fills the entire modal */}
              <div className="relative w-full h-full overflow-hidden">
                {/* Blurred background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-md scale-110"
                  style={{
                    backgroundImage: `url(${selectedContent.thumbnail})`,
                  }}
                />
                
                {/* Main Media with object-contain */}
                <img 
                  src={selectedContent.thumbnail} 
                  alt={`${selectedContent.creator.display_name}'s post`}
                  className="relative z-10 w-full h-full object-contain"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              
            </div>
          )}
        </DialogContent>
      </Dialog>
    </EdgeToEdgeContainer>
  );
};
