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
                  const isBlurred = index > 0; // First post partially visible, rest blurred
                  
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
                          <div className={`relative ${isBlurred ? 'h-48' : 'h-auto'} overflow-hidden`}>
                            <div className="p-4">
                              <h3 className="font-semibold text-lg mb-3">{post.title}</h3>
                              
                              {/* Media Preview */}
                              <div className="mb-4 rounded-lg overflow-hidden">
                                <img 
                                  src={post.thumbnail} 
                                  alt={post.title}
                                  className="w-full h-48 object-cover"
                                />
                                {post.mediaType === 'video' && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                      <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1"></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-muted-foreground leading-relaxed">
                                {isBlurred ? post.content.substring(0, 100) + '...' : post.content}
                              </p>
                              
                              {/* Engagement Preview */}
                              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
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
                            
                            {/* Blur Overlay for Premium Content */}
                            {isBlurred && (
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background flex items-end justify-center">
                                <div className="p-6 text-center w-full">
                                  <div className="bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                                    <h4 className="font-semibold mb-2 text-foreground">Unlock exclusive content</h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      Subscribe to {post.tier} tier to see this post and more
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
                
                {/* Enhanced CTA Card */}
                <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-primary/20 relative overflow-hidden">
                  <CardContent className="p-8 text-center relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50"></div>
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                        <DollarSign className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-foreground">Join {creator.subscribers.toLocaleString()} subscribers</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Get exclusive access to {creator.display_name}'s content, behind-the-scenes updates, and direct communication.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Button 
                          variant="premium" 
                          size="lg"
                          onClick={() => handleSubscribe('1')}
                          className="min-w-48"
                        >
                          Start from ${Math.min(...creator.tiers.map(t => t.price))}/month
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Cancel anytime • Secure payment
                        </span>
                      </div>
                      
                      {/* Social Proof */}
                      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>4.9/5 rating</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>98% retention rate</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional Content Teasers */}
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4 text-center">What subscribers get access to:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/20">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Star className="w-6 h-6 text-primary" />
                        </div>
                        <h5 className="font-medium mb-2">Exclusive Content</h5>
                        <p className="text-sm text-muted-foreground">Behind-the-scenes and premium posts</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/20">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-6 h-6 text-accent" />
                        </div>
                        <h5 className="font-medium mb-2">Community Access</h5>
                        <p className="text-sm text-muted-foreground">Join the private community</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/20">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                        <h5 className="font-medium mb-2">Direct Messages</h5>
                        <p className="text-sm text-muted-foreground">Personal interaction with creator</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
