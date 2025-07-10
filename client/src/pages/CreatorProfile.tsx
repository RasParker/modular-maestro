import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Users, DollarSign, Check } from 'lucide-react';

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
      content: 'Check out my latest digital artwork featuring cyberpunk themes and neon aesthetics. This collection took me 3 months to complete and represents a new direction in my artistic journey. I\'ve been experimenting with different lighting techniques and color palettes.',
      mediaType: 'image',
      tier: 'Fan',
      createdAt: '2024-02-19T10:30:00',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Behind the Scenes Process',
      content: 'Here\'s how I create my digital masterpieces step by step. From initial sketches to final rendering, I\'ll walk you through my entire creative process. This video includes time-lapse footage of me working on the cyberpunk collection.',
      mediaType: 'video',
      tier: 'Superfan',
      createdAt: '2024-02-18T15:20:00',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Character Design Tutorial',
      content: 'Learn my techniques for creating compelling characters that tell a story. This comprehensive tutorial covers anatomy, expression, costume design, and character development. Perfect for aspiring digital artists.',
      mediaType: 'image',
      tier: 'Fan',
      createdAt: '2024-02-17T09:15:00',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    },
    {
      id: '4',
      title: 'Exclusive Artwork: Dragon Queen',
      content: 'An exclusive piece created just for my subscribers. This detailed fantasy artwork showcases advanced techniques in digital painting. Includes high-resolution downloads and process notes.',
      mediaType: 'image',
      tier: 'Superfan',
      createdAt: '2024-02-16T14:45:00',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
    },
    {
      id: '5',
      title: 'Weekly Art Challenge Results',
      content: 'See the amazing submissions from our community art challenge! This week\'s theme was \'Future Cities\' and the creativity was incredible. I\'ve selected the top 10 entries and provided feedback.',
      mediaType: 'image',
      tier: 'Supporter',
      createdAt: '2024-02-15T11:30:00',
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop'
    },
    {
      id: '6',
      title: 'Live Stream Recap: Digital Painting',
      content: 'Missed my live stream? Here\'s the full recording where I painted a sci-fi landscape from start to finish. Includes chat interactions and real-time tips.',
      mediaType: 'video',
      tier: 'Fan',
      createdAt: '2024-02-14T16:20:00',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'
    }
  ]
};

export const CreatorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  
  // In real app, would fetch creator data based on username
  const creator = MOCK_CREATOR;

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      // Redirect to login with return path
      window.location.href = `/login?redirect=/creator/${username}`;
      return;
    }
    // Handle subscription logic
    console.log(`Subscribing to tier ${tierId}`);
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
          <div className="max-w-4xl mx-auto flex items-end gap-4">
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
              </div>
              <p className="text-muted-foreground">@{creator.username}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                {creator.subscribers.toLocaleString()} subscribers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>
            </div>
            
            {/* Recent Posts Preview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Posts</h2>
                <Badge variant="secondary" className="text-xs">
                  {creator.recentPosts.length} recent posts
                </Badge>
              </div>
              
              <div className="space-y-6">
                {creator.recentPosts.map((post, index) => {
                  const tierPrice = creator.tiers.find(t => t.name === post.tier)?.price || 0;
                  
                  // Smart blur strategy
                  let blurLevel = 'none';
                  let visibility = 100;
                  let heightClass = 'h-auto';
                  
                  if (index === 0) {
                    // First post: fully visible
                    blurLevel = 'none';
                    visibility = 100;
                    heightClass = 'h-auto';
                  } else if (index === 1) {
                    // Second post: 70% visible
                    blurLevel = 'light';
                    visibility = 70;
                    heightClass = 'h-64';
                  } else if (index === 2) {
                    // Third post: 50% visible
                    blurLevel = 'medium';
                    visibility = 50;
                    heightClass = 'h-48';
                  } else {
                    // Rest: heavily blurred
                    blurLevel = 'heavy';
                    visibility = 30;
                    heightClass = 'h-40';
                  }
                  
                  const showBlurOverlay = index > 0;
                  
                  return (
                    <Card key={post.id} className="bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative">
                          {/* Post Header */}
                          <div className="p-4 border-b border-border/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={creator.avatar} alt={creator.username} />
                                  <AvatarFallback className="text-xs">{creator.display_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{creator.display_name}</p>
                                  <p className="text-xs text-muted-foreground">{getTimeAgo(post.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="premium" className="text-xs">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  {post.tier} - ${tierPrice}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className={`relative ${heightClass} overflow-hidden`}>
                            <div className="p-4">
                              <h3 className="font-semibold text-lg mb-3">{post.title}</h3>
                              
                              {/* Media Preview */}
                              <div className="mb-4 rounded-lg overflow-hidden relative">
                                <img 
                                  src={post.thumbnail} 
                                  alt={post.title}
                                  className={`w-full h-48 object-cover transition-all duration-300 ${
                                    blurLevel === 'light' ? 'blur-[1px]' :
                                    blurLevel === 'medium' ? 'blur-[2px]' :
                                    blurLevel === 'heavy' ? 'blur-[4px]' : ''
                                  }`}
                                  style={{ opacity: visibility / 100 }}
                                />
                                {post.mediaType === 'video' && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                      <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1"></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <p className={`text-muted-foreground leading-relaxed transition-all duration-300 ${
                                blurLevel === 'light' ? 'blur-[0.5px]' :
                                blurLevel === 'medium' ? 'blur-[1px]' :
                                blurLevel === 'heavy' ? 'blur-[2px]' : ''
                              }`} style={{ opacity: visibility / 100 }}>
                                {showBlurOverlay && index > 1 ? post.content.substring(0, 80) + '...' : 
                                 showBlurOverlay && index === 1 ? post.content.substring(0, 150) + '...' : 
                                 post.content}
                              </p>
                              
                              {/* Engagement Preview */}
                              <div className={`flex items-center gap-4 mt-4 text-sm text-muted-foreground transition-all duration-300 ${
                                blurLevel === 'light' ? 'blur-[0.5px]' :
                                blurLevel === 'medium' ? 'blur-[1px]' :
                                blurLevel === 'heavy' ? 'blur-[2px]' : ''
                              }`} style={{ opacity: visibility / 100 }}>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  <span>{Math.floor(Math.random() * 50) + 10} likes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{Math.floor(Math.random() * 20) + 5} comments</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Progressive Blur Overlay */}
                            {showBlurOverlay && (
                              <div className={`absolute inset-0 transition-all duration-300 ${
                                index === 1 ? 'bg-gradient-to-b from-transparent via-transparent to-background/60' :
                                index === 2 ? 'bg-gradient-to-b from-transparent via-background/30 to-background/80' :
                                'bg-gradient-to-b from-background/20 via-background/60 to-background/90'
                              } flex items-end justify-center`}>
                                <div className="p-6 text-center w-full">
                                  <div className={`bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all duration-300 ${
                                    index === 1 ? 'bg-background/80' :
                                    index === 2 ? 'bg-background/90' :
                                    'bg-background/95'
                                  }`}>
                                    <h4 className="font-semibold mb-2 text-foreground">
                                      {index === 1 ? 'Preview ending...' :
                                       index === 2 ? 'Subscribe for more' :
                                       'Unlock exclusive content'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      {index === 1 ? `Subscribe to ${post.tier} tier to read the full post` :
                                       `Subscribe to ${post.tier} tier to see this post and more`}
                                    </p>
                                    <Button 
                                      variant="premium" 
                                      size="sm"
                                      onClick={() => handleSubscribe(creator.tiers.find(t => t.name === post.tier)?.id || '1')}
                                      className="w-full"
                                    >
                                      Subscribe from ${tierPrice}/month
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                
              </div>
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Subscription Tiers</h2>
            
            {creator.tiers.map((tier) => (
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
                    
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                    
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant="premium" 
                      className="w-full"
                      onClick={() => handleSubscribe(tier.id)}
                    >
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
