import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { CreatorPostActions } from '@/components/creator/CreatorPostActions';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Users, DollarSign, Check, Settings } from 'lucide-react';

// Mock creators database
const MOCK_CREATORS = {
  'artisticmia': {
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
        thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        likes: 24,
        comments: [
          {
            id: '1',
            author: 'johndoe',
            content: 'Amazing work! Love the color palette.',
            time: '1h ago'
          },
          {
            id: '2',
            author: 'sarahsmith',
            content: 'This is incredible! How long did it take?',
            time: '30m ago'
          }
        ]
      },
      {
        id: '2',
        title: 'Behind the Scenes Process',
        content: 'Here\'s how I create my digital masterpieces...',
        mediaType: 'video',
        tier: 'Superfan',
        createdAt: '2024-02-18T15:20:00',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        likes: 18,
        comments: [
          {
            id: '3',
            author: 'mikejones',
            content: 'Thanks for sharing your process!',
            time: '2h ago'
          }
        ]
      }
    ]
  },
  'original badman': {
    id: '3',
    username: 'original badman',
    display_name: 'Original Badman',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=300&fit=crop',
    bio: 'Welcome to my creative space! I\'m just getting started on this amazing platform. Stay tuned for exciting content coming your way!',
    subscribers: 0,
    verified: false,
    tiers: [
      { 
        id: '1',
        name: 'Supporter', 
        price: 5,
        description: 'Support my creative journey',
        features: ['Access to all posts', 'Community access', 'Monthly updates']
      },
      { 
        id: '2',
        name: 'Premium', 
        price: 15,
        description: 'Get exclusive content and perks',
        features: ['Everything in Supporter', 'Exclusive content', 'Behind-the-scenes access', 'Priority support']
      }
    ],
    recentPosts: []
  }
};

export const CreatorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(
    () => localStorage.getItem('profilePhotoUrl')
  );
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(
    () => localStorage.getItem('coverPhotoUrl')
  );
  const [displayName, setDisplayName] = useState<string | null>(
    () => localStorage.getItem('displayName')
  );
  const [bio, setBio] = useState<string | null>(
    () => localStorage.getItem('bio')
  );
  const [customTiers, setCustomTiers] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  // Function to fetch user's posts from database
  const fetchUserPosts = async (userId: string | number) => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const allPosts = await response.json();
        // Filter posts by current user (convert both to numbers for comparison)
        const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
        const filteredPosts = allPosts.filter((post: any) => post.creator_id === userIdNum);
        setUserPosts(filteredPosts);
        console.log('Fetched user posts:', filteredPosts);
        console.log('User ID:', userIdNum, 'All posts:', allPosts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  // Update profile data from localStorage when component mounts or when navigating
  useEffect(() => {
    const updateProfileData = () => {
      console.log('Updating profile data from localStorage');
      const newProfilePhotoUrl = localStorage.getItem('profilePhotoUrl');
      const newCoverPhotoUrl = localStorage.getItem('coverPhotoUrl');
      const newDisplayName = localStorage.getItem('displayName');
      const newBio = localStorage.getItem('bio');
      
      console.log('Current localStorage values:', {
        profilePhotoUrl: newProfilePhotoUrl,
        coverPhotoUrl: newCoverPhotoUrl,
        displayName: newDisplayName,
        bio: newBio
      });
      
      setProfilePhotoUrl(newProfilePhotoUrl);
      setCoverPhotoUrl(newCoverPhotoUrl);
      setDisplayName(newDisplayName);
      setBio(newBio);
      
      // Load custom tiers from localStorage
      const savedTiers = localStorage.getItem('subscriptionTiers');
      if (savedTiers) {
        try {
          setCustomTiers(JSON.parse(savedTiers));
        } catch (error) {
          console.error('Error parsing saved tiers:', error);
        }
      }
    };

    // Initial load
    updateProfileData();
    
    // Fetch user's posts if viewing own profile
    if (user && user.username === username) {
      fetchUserPosts(user.id);
    }
    
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Storage event received:', e.key, e.newValue);
      if (e.key === 'profilePhotoUrl' || e.key === 'coverPhotoUrl' || 
          e.key === 'displayName' || e.key === 'bio' || e.key === 'subscriptionTiers') {
        updateProfileData();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = (e: CustomEvent) => {
      console.log('Custom storage event received:', e.detail);
      updateProfileData();
      
      // Refresh posts if post-related event
      if (e.detail && e.detail.type === 'postCreated' && user && user.username === username) {
        fetchUserPosts(user.id);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, [username]);

  // Fetch user data from database
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/users/username/${username}`);
        if (response.ok) {
          const userData = await response.json();
          console.log('Fetched user data:', userData);
          // Create creator object with localStorage overrides taking priority
          const creatorData = {
            id: userData.id,
            username: userData.username,
            display_name: displayName || userData.display_name || userData.username,
            avatar: profilePhotoUrl || userData.avatar || `https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face`,
            cover: coverPhotoUrl || userData.cover_image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=300&fit=crop',
            bio: bio || userData.bio || 'Welcome to my profile! I\'m excited to share my content with you.',
            subscribers: userData.total_subscribers || 0,
            verified: userData.verified || false,
            role: userData.role,
            tiers: customTiers.length > 0 ? customTiers : [
              { 
                id: '1',
                name: 'Supporter', 
                price: 5,
                description: 'Support my creative journey',
                features: ['Access to all posts', 'Community access', 'Monthly updates']
              },
              { 
                id: '2',
                name: 'Premium', 
                price: 15,
                description: 'Get exclusive content and perks',
                features: ['Everything in Supporter', 'Exclusive content', 'Behind-the-scenes access', 'Priority support']
              }
            ],
            recentPosts: userPosts
          };
          setCreator(creatorData);
        } else {
          setCreator(null);
        }
      } catch (error) {
        console.error('Error fetching creator data:', error);
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [username, displayName, bio, customTiers, userPosts]);
  const isOwnProfile = user?.username === username;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-2">Creator Not Found</h1>
            <p className="text-muted-foreground">The creator profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

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
                {isOwnProfile && (
                  <Badge variant="outline" className="text-xs">
                    Your Profile
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{creator.username}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                {creator.subscribers.toLocaleString()} subscribers
              </div>
              {isOwnProfile && (
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/upload">Create Post</Link>
                  </Button>
                </div>
              )}
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
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">About</h2>
                {isOwnProfile && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    asChild
                    className="p-1 h-auto"
                  >
                    <Link to="/creator/settings">
                      <Settings className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>
            </div>
            
            {/* Recent Posts Preview */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
              <div className="space-y-4">
                {creator.recentPosts.map((post) => (
                  <Card key={post.id} className="bg-gradient-card border-border/50">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={post.thumbnail || (post.media_urls && post.media_urls[0] ? `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop')} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {post.tier}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {getTimeAgo(post.created_at || post.createdAt)}
                                </span>
                              </div>
                            </div>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                      {isOwnProfile && (
                        <CreatorPostActions
                          postId={post.id}
                          isOwnPost={true}
                          likes={post.likes_count || post.likes || 0}
                          comments={post.comments || []}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
                
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
