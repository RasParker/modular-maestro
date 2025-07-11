import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/shared/Navbar';
import { CreatorPostActions } from '@/components/creator/CreatorPostActions';
import { CommentSection } from '@/components/fan/CommentSection';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Users, DollarSign, Check, Settings, Eye, MessageSquare, Heart, Share2, Image, Video, FileText, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedModalCaption, setExpandedModalCaption] = useState(false);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [postLikes, setPostLikes] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

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
      const newProfilePhotoUrl = localStorage.getItem('profilePhotoUrl');
      const newCoverPhotoUrl = localStorage.getItem('coverPhotoUrl');
      const newDisplayName = localStorage.getItem('displayName');
      const newBio = localStorage.getItem('bio');

      // Only update state if the values are different
      if (newProfilePhotoUrl !== profilePhotoUrl) setProfilePhotoUrl(newProfilePhotoUrl);
      if (newCoverPhotoUrl !== coverPhotoUrl) setCoverPhotoUrl(newCoverPhotoUrl);
      if (newDisplayName !== displayName) setDisplayName(newDisplayName);
      if (newBio !== bio) setBio(newBio);

      // Load custom tiers from localStorage
      const savedTiers = localStorage.getItem('subscriptionTiers');
      if (savedTiers) {
        try {
          const parsedTiers = JSON.parse(savedTiers);
          setCustomTiers(parsedTiers);
        } catch (error) {
          console.error('Error parsing saved tiers:', error);
        }
      }
    };

    // Initial load
    updateProfileData();

    // Listen for localStorage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profilePhotoUrl' || e.key === 'coverPhotoUrl' || 
          e.key === 'displayName' || e.key === 'bio' || e.key === 'subscriptionTiers') {
        updateProfileData();
        
        // Also trigger a re-fetch of creator data to update the UI
        if (username) {
          const fetchCreatorData = async () => {
            try {
              const response = await fetch(`/api/users/username/${username}`);
              if (response.ok) {
                const userData = await response.json();
                setCreator(prev => prev ? {
                  ...prev,
                  display_name: displayName || userData.display_name || userData.username,
                  avatar: profilePhotoUrl || userData.avatar || prev.avatar,
                  cover: coverPhotoUrl || userData.cover_image || prev.cover,
                  bio: bio || userData.bio || prev.bio,
                } : null);
              }
            } catch (error) {
              console.error('Error re-fetching creator data:', error);
            }
          };
          fetchCreatorData();
        }
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = (e: CustomEvent) => {
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
  }, [username]); // Remove user dependency to prevent infinite loops

  // Separate useEffect for fetching user posts
  useEffect(() => {
    if (user && user.username === username) {
      fetchUserPosts(user.id);
    }
  }, [user?.id, username]); // Only depend on user.id and username

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
  }, [username]); // Only depend on username to prevent infinite loops

  // Update creator data when localStorage values change
  useEffect(() => {
    if (creator) {
      setCreator(prev => prev ? {
        ...prev,
        display_name: displayName || prev.display_name,
        avatar: profilePhotoUrl || prev.avatar,
        cover: coverPhotoUrl || prev.cover,
        bio: bio || prev.bio,
        tiers: customTiers.length > 0 ? customTiers : prev.tiers,
        recentPosts: userPosts
      } : null);
    }
  }, [displayName, bio, customTiers, userPosts, profilePhotoUrl, coverPhotoUrl]);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'public':
        return 'outline';
      case 'supporter':
        return 'secondary';
      case 'fan':
        return 'secondary';
      case 'premium':
        return 'default';
      case 'superfan':
        return 'default';
      default:
        return 'outline';
    }
  };

  const handleContentClick = (post: any) => {
    // Transform the post data to match the content manager modal structure
    const modalData = {
      ...post,
      mediaPreview: post.media_urls?.[0]?.startsWith('/uploads/') ? post.media_urls[0] : `/uploads/${post.media_urls?.[0]}`,
      type: post.media_type === 'image' ? 'Image' : post.media_type === 'video' ? 'Video' : 'Text',
      caption: post.content || post.title
    };
    setSelectedContent(modalData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
    setExpandedModalCaption(false);
  };

  // Handler functions for post interactions
  const handleLike = (postId: string) => {
    setPostLikes(prev => {
      const currentLike = prev[postId] || { liked: false, count: 0 };
      return {
        ...prev,
        [postId]: {
          liked: !currentLike.liked,
          count: currentLike.liked ? currentLike.count - 1 : currentLike.count + 1
        }
      };
    });
  };

  const handleCommentClick = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentCountChange = (postId: string, newCount: number) => {
    setUserPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments_count: newCount }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    toast({
      title: "Link copied",
      description: "Post link has been copied to your clipboard.",
    });
  };

  const handleEdit = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setEditCaption(post.content || post.title);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;

    try {
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editCaption,
          content: editCaption,
        })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setUserPosts(prev => prev.map(post => 
          post.id === editingPost.id 
            ? { ...post, title: editCaption, content: editCaption }
            : post
        ));
        setIsEditModalOpen(false);
        setEditingPost(null);
        toast({
          title: "Post updated",
          description: "Your post has been successfully updated.",
        });
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
    setEditCaption('');
  };

  const handleDelete = (postId: string) => {
    // Show confirmation dialog and delete post
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (confirmDelete) {
      // Here you would typically make an API call to delete the post
      setUserPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Creator Header */}
      <div className="relative">
        <div className="h-48 md:h-64 overflow-hidden">
          {creator.cover ? (
            <img 
              src={creator.cover} 
              alt={creator.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-muted-foreground">No cover photo</span>
            </div>
          )}
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
              {(creator.recentPosts.length > 0 || userPosts.length > 0) ? (
                <div className="space-y-6">
                  {(userPosts.length > 0 ? userPosts : creator.recentPosts).map((post) => (
                    <Card key={post.id} className="bg-gradient-card border-border/50">
                      <CardContent className="p-0">
                        <div className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={creator.avatar} alt={creator.username} />
                                <AvatarFallback>{creator.display_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-foreground">{creator.display_name}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-muted-foreground">@{creator.username}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {post.tier === 'public' ? 'Free' : 
                                     post.tier === 'supporter' ? 'Supporter' :
                                     post.tier === 'fan' ? 'Fan' :
                                     post.tier === 'premium' ? 'Premium' :
                                     post.tier === 'superfan' ? 'Superfan' : 'Free'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {getTimeAgo(post.created_at || post.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {post.media_type || post.mediaType}
                            </Badge>
                          </div>
                        </div>

                        <div className="px-4 pb-4 space-y-4">
                          <div>
                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {post.content || post.title}
                            </p>
                          </div>

                          {post.media_urls && post.media_urls[0] && (
                            <div 
                              className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity active:opacity-80"
                              onClick={() => handleContentClick(post)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleContentClick(post);
                                }
                              }}
                            >
                              {post.media_type === 'video' ? (
                                <video 
                                  src={`/uploads/${post.media_urls[0]}`}
                                  className="w-full h-64 object-cover"
                                  muted
                                  preload="metadata"
                                />
                              ) : (
                                <img 
                                  src={`/uploads/${post.media_urls[0]}`}
                                  alt={post.title}
                                  className="w-full h-64 object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEgxMTJWMTI1SDg4VjEwMEg3NUwxMDAgNzVaIiBmaWxsPSIjOWNhM2FmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                                    target.className = "w-full h-64 object-cover opacity-50";
                                  }}
                                />
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`${postLikes[post.id]?.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                                onClick={() => handleLike(post.id)}
                              >
                                <Heart className={`w-4 h-4 mr-1 ${postLikes[post.id]?.liked ? 'fill-current' : ''}`} />
                                {postLikes[post.id]?.count || post.likes_count || post.likes || 0}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-muted-foreground"
                                onClick={() => handleCommentClick(post.id)}
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                {post.comments_count || (post.comments ? post.comments.length : 0)}
                              </Button>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                0
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground h-8 w-8 p-0"
                                onClick={() => handleShare(post.id)}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              {isOwnProfile && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-muted-foreground h-8 w-8 p-0 hover:bg-muted"
                                    onClick={() => handleEdit(post.id)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-muted-foreground h-8 w-8 p-0 hover:bg-muted"
                                    onClick={() => handleDelete(post.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      {/* Comments Section */}
                      {showComments[post.id] && (
                        <div className="border-t border-border/30">
                          <div className="p-4">
                            <CommentSection
                              postId={post.id}
                              initialComments={post.comments || []}
                              onCommentCountChange={(count) => handleCommentCountChange(post.id, count)}
                            />
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    <div className="text-center py-4">
                      <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                      <p className="text-muted-foreground text-sm">
                        {isOwnProfile ? 'Start creating content to build your audience.' : `${creator.display_name} hasn't posted any content yet.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
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

      {/* Instagram-style Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vh] max-h-[95vh] p-0 overflow-hidden border-0 [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedContent?.type} Content</DialogTitle>
            <DialogDescription>View content</DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div className="relative bg-black">
              {/* Back Arrow Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full text-white hover:bg-white/10"
                onClick={closeModal}
              >
                <ArrowLeft className="w-7 h-7" />
              </Button>

              {/* Use AspectRatio component like the postcard */}
              <AspectRatio ratio={1} className="overflow-hidden">
                {selectedContent.mediaPreview ? (
                  <div className="relative w-full h-full">
                    {/* Blurred background layer */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
                      style={{ backgroundImage: `url(${selectedContent.mediaPreview})` }}
                    />
                    {/* Main media content - Square container */}
                    <div className="relative z-10 w-full h-full">
                      {selectedContent.type === 'Video' ? (
                        <video 
                          src={selectedContent.mediaPreview} 
                          className="w-full h-full object-contain"
                          controls
                          autoPlay
                          muted
                        />
                      ) : (
                        <img 
                          src={selectedContent.mediaPreview} 
                          alt={selectedContent.caption}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-primary/10">
                    <div className="text-center text-white">
                      {getTypeIcon(selectedContent.type)}
                      <p className="mt-2">{selectedContent.type} Content</p>
                    </div>
                  </div>
                )}
              </AspectRatio>

              {/* Vertical Action Icons - Instagram Style */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white">
                    <Heart className="w-7 h-7" />
                  </div>
                  <span className="text-xs text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                    {selectedContent.likes_count || selectedContent.likes || 0}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <span className="text-xs text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                    {selectedContent.comments_count || (selectedContent.comments ? selectedContent.comments.length : 0)}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white">
                    <Eye className="w-7 h-7" />
                  </div>
                  <span className="text-xs text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>0</span>
                </div>
              </div>

              {/* Bottom Content Overlay - Instagram style with text shadows */}
              <div className="absolute bottom-4 left-4 right-16 p-4 z-20">
                <p className="text-white text-sm leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                  {expandedModalCaption ? (selectedContent.content || selectedContent.title) : (
                    (selectedContent.content || selectedContent.title).length > 80 ? (
                      <>
                        {(selectedContent.content || selectedContent.title).substring(0, 80)}
                        <span 
                          className="cursor-pointer text-white/80 hover:text-white ml-1"
                          onClick={() => setExpandedModalCaption(true)}
                        >
                          ...
                        </span>
                      </>
                    ) : (selectedContent.content || selectedContent.title)
                  )}
                  {expandedModalCaption && (selectedContent.content || selectedContent.title).length > 80 && (
                    <span 
                      className="cursor-pointer text-white/80 hover:text-white ml-2"
                      onClick={() => setExpandedModalCaption(false)}
                    >
                      Show less
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Make changes to your post content below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="editCaption" className="block text-sm font-medium mb-2">
                Caption
              </label>
              <Textarea
                id="editCaption"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="w-full min-h-[120px]"
                placeholder="Write your post caption here..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};