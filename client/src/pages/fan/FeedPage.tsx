import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { CommentSection } from '@/components/fan/CommentSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Heart, MessageSquare, Calendar, Eye, Share2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [feed, setFeed] = useState(MOCK_FEED);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const handleLike = (postId: string) => {
    setFeed(feed.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
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
  };

  const toggleCaptionExpansion = (postId: string) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    // Adjust words per line based on screen size - fewer words on mobile
    const wordsPerLine = window.innerWidth < 640 ? 6 : 10; // Reduced to leave space for "Read more"
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return { truncated: text, needsExpansion: false };
    }
    
    return {
      truncated: words.slice(0, maxWords).join(' '),
      needsExpansion: true
    };
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Feed
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Latest content from creators you follow
          </p>
        </div>

        {/* Feed Content */}
        <div className="space-y-6">
          {feed.map((post) => (
            <Card key={post.id} className="bg-gradient-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.creator.avatar} alt={post.creator.username} />
                      <AvatarFallback>{post.creator.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{post.creator.display_name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">@{post.creator.username}</p>
                        <Badge variant="outline" className="text-xs">
                          {post.tier}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(post.posted)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {post.type}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  {(() => {
                    const { truncated, needsExpansion } = truncateText(post.content);
                    const isExpanded = expandedCaptions[post.id];
                    
                    return (
                      <div>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                          {isExpanded ? post.content : (
                            <>
                              {truncated}
                              {needsExpansion && !isExpanded && (
                                <>
                                  {'... '}
                                  <button
                                    onClick={() => toggleCaptionExpansion(post.id)}
                                    className="text-xs sm:text-sm text-primary hover:underline font-medium inline"
                                  >
                                    Read more
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
                                className="text-xs sm:text-sm text-primary hover:underline font-medium inline"
                              >
                                Read less
                              </button>
                            </>
                          )}
                        </p>
                      </div>
                    );
                  })()}
                </div>
                
                <div 
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity active:opacity-80"
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
                  {/* Blurred background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-md scale-110"
                    style={{
                      backgroundImage: `url(${post.thumbnail})`,
                    }}
                  />
                  
                  {/* Main image with object-contain */}
                  <img 
                    src={post.thumbnail} 
                    alt={`${post.creator.display_name}'s post`}
                    className="relative z-10 w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${post.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground"
                      onClick={() => handleCommentClick(post.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {post.views}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => handleShare(post.id)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
              
              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="border-t border-border/30">
                  <div className="p-4">
                    <CommentSection
                      postId={post.id}
                      initialComments={post.initialComments || []}
                      onCommentCountChange={(count) => handleCommentCountChange(post.id, count)}
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">
            Load More Posts
          </Button>
        </div>
      </div>

      {/* Instagram-style Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedContent?.type} Content</DialogTitle>
            <DialogDescription>View content from {selectedContent?.creator?.display_name}</DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
                onClick={closeModal}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Blurred background for modal */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-20"
                style={{
                  backgroundImage: `url(${selectedContent.thumbnail})`,
                }}
              />
              
              {/* Main Media */}
              <img 
                src={selectedContent.thumbnail} 
                alt={`${selectedContent.creator.display_name}'s post`}
                className="relative z-10 max-w-full max-h-full object-contain"
              />

              {/* Vertical Action Icons - Instagram Style */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 ${
                      selectedContent.liked ? 'text-red-500' : 'text-white hover:bg-black/70'
                    }`}
                    onClick={() => handleLike(selectedContent.id)}
                  >
                    <Heart className={`w-5 h-5 ${selectedContent.liked ? 'fill-current' : ''}`} />
                  </Button>
                  <span className="text-xs text-white mt-1 font-medium">{selectedContent.likes}</span>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
                    onClick={() => handleCommentClick(selectedContent.id)}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                  <span className="text-xs text-white mt-1 font-medium">{selectedContent.comments}</span>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
                    onClick={() => handleShare(selectedContent.id)}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-white mt-1 font-medium">{selectedContent.views}</span>
                </div>
              </div>

              {/* Content Info Overlay - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 z-20">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src={selectedContent.creator.avatar} alt={selectedContent.creator.username} />
                    <AvatarFallback>{selectedContent.creator.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{selectedContent.creator.display_name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white/80">@{selectedContent.creator.username}</p>
                      <Badge variant="outline" className="text-xs border-white/20 text-white">
                        {selectedContent.tier}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {selectedContent.content}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
