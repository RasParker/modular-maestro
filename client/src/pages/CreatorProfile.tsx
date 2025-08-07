import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CreatorPostActions } from '@/components/creator/CreatorPostActions';
import { PostActions } from '@/components/creator/PostActions';
import { CommentSection } from '@/components/fan/CommentSection';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { TierDetailsModal } from '@/components/subscription/TierDetailsModal';
import { OnlineStatusIndicator } from '@/components/OnlineStatusIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Users, DollarSign, Check, Settings, Eye, MessageSquare, Heart, Share2, Share, Image, Video, FileText, Edit, Trash2, ArrowLeft, Plus, ChevronDown, ChevronUp, User } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BioDisplay } from '@/lib/text-utils';

export const CreatorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State variables
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
  const [creator, setCreator] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedModalCaption, setExpandedModalCaption] = useState(false);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [postLikes, setPostLikes] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [isSubscriptionTiersExpanded, setIsSubscriptionTiersExpanded] = useState(false);
  const [tierDetailsModalOpen, setTierDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatorLiked, setIsCreatorLiked] = useState(false);
  const [isCreatorFavorited, setIsCreatorFavorited] = useState(false);
  const [likingCreator, setLikingCreator] = useState(false);
  const [favoritingCreator, setFavoritingCreator] = useState(false);

  // Define isOwnProfile early to avoid initialization issues
  const isOwnProfile = user?.username === username;

  // Function to fetch user's posts from database
  const fetchUserPosts = async (userId: string | number) => {
    try {
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;

      // Build query parameters based on who's viewing
      let queryParams = `creatorId=${userIdNum}`;

      const response = await fetch(`/api/posts?${queryParams}`);
      if (response.ok) {
        const filteredPosts = await response.json();

        // Sort posts by creation date (newest first)
        filteredPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setUserPosts(filteredPosts);

        // Initialize like status for current user
        if (user) {
          await fetchLikeStatuses(filteredPosts, Number(user.id));
        }

        console.log('Fetched user posts:', filteredPosts);
        console.log('User ID:', userIdNum, 'Is own profile:', isOwnProfile);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  // Function to fetch like statuses for posts
  const fetchLikeStatuses = async (posts: any[], userId: number) => {
    try {
      const likeStatuses: Record<string, { liked: boolean; count: number }> = {};

      for (const post of posts) {
        const response = await fetch(`/api/posts/${post.id}/like/${userId}`);
        if (response.ok) {
          const { liked } = await response.json();
          likeStatuses[post.id] = {
            liked: liked,
            count: post.likes_count || 0
          };
        } else {
          likeStatuses[post.id] = {
            liked: false,
            count: post.likes_count || 0
          };
        }
      }

      setPostLikes(likeStatuses);
    } catch (error) {
      console.error('Error fetching like statuses:', error);
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
    };

    updateProfileData();

    // Listen for localStorage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profilePhotoUrl' || e.key === 'coverPhotoUrl' || e.key === 'displayName' || e.key === 'bio') {
        updateProfileData();
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
  }, [username]);

  // Fetch creator data
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!username) return;

      try {
        setLoading(true);
        const decodedUsername = decodeURIComponent(username);
        const response = await fetch(`/api/users/username/${encodeURIComponent(decodedUsername)}`);
        if (response.ok) {
          const userData = await response.json();
          console.log('Creator data loaded:', userData);

          // Check localStorage for profile customizations
          const profilePhotoUrl = localStorage.getItem('profilePhotoUrl');
          const coverPhotoUrl = localStorage.getItem('coverPhotoUrl');
          const displayName = localStorage.getItem('displayName');
          const bio = localStorage.getItem('bio');

          // Handle tiers - fetch from API
          let tiers = [];
          if (userData?.id) {
            try {
              const tiersResponse = await fetch(`/api/creators/${userData.id}/tiers`);
              if (tiersResponse.ok) {
                tiers = await tiersResponse.json();
              }
            } catch (error) {
              console.error('Error fetching tiers:', error);
            }
          }

          setCreator({
            ...userData,
            display_name: (displayName && displayName.trim()) || userData.display_name || userData.username,
            avatar: (profilePhotoUrl && profilePhotoUrl.trim()) || userData.avatar || null,
            cover: (coverPhotoUrl && coverPhotoUrl.trim()) || userData.cover_image || null,
            bio: (bio && bio.trim()) || userData.bio || null,
            subscribers: userData.total_subscribers || 0,
            tiers: tiers
          });
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
  }, [username, user?.username, profilePhotoUrl, coverPhotoUrl, displayName, bio]);

  // Separate useEffect for fetching user posts
  useEffect(() => {
    if (creator && creator.id) {
      fetchUserPosts(creator.id);
    }
  }, [creator?.id]);

  // Fetch user's subscription to this creator
  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (!user || !creator || isOwnProfile) return;

      try {
        setSubscriptionLoading(true);
        const response = await fetch(`/api/subscriptions/user/${user.id}/creator/${creator.id}`);
        if (response.ok) {
          const subscriptionData = await response.json();
          setUserSubscription(subscriptionData);
        } else {
          setUserSubscription(null);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setUserSubscription(null);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchUserSubscription();
  }, [user, creator, isOwnProfile]);

  // Check if user has access to content based on subscription tier
  const hasAccessToTier = (postTier: string): boolean => {
    // Own profile - can see all content
    if (isOwnProfile) {
      console.log('Access granted: Own profile');
      return true;
    }

    // Public content - everyone can see
    if (postTier === 'public') {
      console.log('Access granted: Public content');
      return true;
    }

    // If user is not logged in, no access to premium content
    if (!user) {
      console.log('Access denied: User not logged in');
      return false;
    }

    // If user has no active subscription to this creator, no access to premium content
    if (!userSubscription || userSubscription.status !== 'active') {
      console.log('Access denied: No active subscription', { 
        userSubscription: userSubscription,
        hasSubscription: !!userSubscription,
        subscriptionStatus: userSubscription?.status
      });
      return false;
    }

    // Verify subscription is to this specific creator
    if (userSubscription.creator_id !== creator?.id) {
      console.log('Access denied: Subscription not for this creator', { 
        subscriptionCreatorId: userSubscription.creator_id, 
        currentCreatorId: creator?.id 
      });
      return false;
    }

    // Define tier hierarchy - higher tiers include lower tier content
    const tierHierarchy: Record<string, number> = {
      'supporter': 1,
      'starter pump': 1,
      'fan': 2,
      'premium': 2,
      'power gains': 2,
      'superfan': 3,
      'elite beast mode': 3
    };

    const userTierLevel = tierHierarchy[userSubscription.tier_name?.toLowerCase()] || 0;
    const postTierLevel = tierHierarchy[postTier.toLowerCase()] || 1;

    const hasAccess = userTierLevel >= postTierLevel;
    console.log('Tier access check:', { 
      postTier, 
      userTierLevel, 
      postTierLevel, 
      userTierName: userSubscription.tier_name,
      hasAccess,
      creatorId: creator?.id,
      userId: user?.id
    });

    return hasAccess;
  };

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    if (!userPosts) return [];

    switch (activeTab) {
      case 'public':
        return userPosts.filter(post => post.tier === 'public');
      case 'subscription':
        return userPosts.filter(post => post.tier !== 'public');
      case 'all':
      default:
        return userPosts;
    }
  };

  // Get post counts for each tab
  const getPostCounts = () => {
    if (!userPosts) return { all: 0, subscription: 0, public: 0 };

    return {
      all: userPosts.length,
      subscription: userPosts.filter(post => post.tier !== 'public').length,
      public: userPosts.filter(post => post.tier === 'public').length
    };
  };

  const handleContentClick = (post: any) => {
    // Check access control first
    if (!hasAccessToTier(post.tier)) {
      console.log('Access denied for post tier:', post.tier);
      // Show subscription prompt and scroll to tiers section
      const tiersSection = document.getElementById('subscription-tiers');
      if (tiersSection) {
        tiersSection.scrollIntoView({ behavior: 'smooth' });
        // Expand tiers if they're collapsed
        if (!isSubscriptionTiersExpanded) {
          setIsSubscriptionTiersExpanded(true);
        }
      }
      return;
    }

    // Navigate to video watch page for all content
    navigate(`/video/${post.id}`);
  };

  const getTimeAgo = (dateString: string) => {
    if (dateString === "CURRENT_TIMESTAMP") {
      return 'Just now';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Just now';
    }

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

  const getMediaOverlayIcon = (mediaType: string) => {
    switch (mediaType?.toLowerCase()) {
      case 'image':
        return <Image className="w-4 h-4 text-white" />;
      case 'video':
        return <Video className="w-4 h-4 text-white" />;
      case 'text':
        return <FileText className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  // Handler functions for post interactions
  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const currentLike = postLikes[postId] || { liked: false, count: 0 };

      if (currentLike.liked) {
        await fetch(`/api/posts/${postId}/like`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
      } else {
        await fetch(`/api/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
      }

      setPostLikes(prev => ({
        ...prev,
        [postId]: {
          liked: !currentLike.liked,
          count: currentLike.liked ? currentLike.count - 1 : currentLike.count + 1
        }
      }));

      if (creator?.id) {
        fetchUserPosts(creator.id);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
      });
    }
  };

  const handleCommentClick = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentCountChange = (postId: string | number, newCount: number) => {
    setUserPosts(prev => prev.map(post => 
      post.id.toString() === postId.toString() 
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

  const handleEditPost = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setEditCaption(post.content || post.title);
      setIsEditModalOpen(true);
    }
  };

  const handleDeletePost = (postId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (confirmDelete) {
      setUserPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
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

  const renderPostContent = (post: any) => {
    const hasAccess = hasAccessToTier(post.tier);

    if (!hasAccess) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="text-center z-10 p-4">
            <div className="mb-3">
              <svg className="w-8 h-8 mx-auto text-accent md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mb-2 md:text-sm md:mb-3">
              {post.tier === 'supporter' ? 'Supporter' : 
               post.tier === 'fan' ? 'Fan' : 
               post.tier === 'premium' ? 'Premium' : 
               post.tier === 'superfan' ? 'Superfan' : 'Premium'} Content
            </p>
            <Button 
              size="sm" 
              className="bg-accent hover:bg-accent/90 text-black text-xs px-2 py-1 md:text-sm md:px-4"
              onClick={(e) => {
                e.stopPropagation();
                if (!user) {
                  window.location.href = `/login?redirect=/creator/${username}`;
                } else {
                  document.getElementById('subscription-tiers')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {!user ? 'Login' : 'Subscribe'}
            </Button>
          </div>
        </div>
      );
    }

    const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls];
    const mediaUrl = mediaUrls[0];

    if (mediaUrl) {
      const fullUrl = mediaUrl.startsWith('/uploads/') ? mediaUrl : `/uploads/${mediaUrl}`;

      return post.media_type === 'video' ? (
        <video 
          src={fullUrl}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
          onError={(e) => {
            const target = e.target as HTMLVideoElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<div class="w-full h-full bg-gray-800 flex items-center justify-center">
                <div class="text-white text-sm">Video unavailable</div>
              </div>`;
            }
          }}
        />
      ) : (
        <img 
          src={fullUrl}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEgxMTJWMTI1SDg4VjEwMEg3NUwxMDAgNzVaIiBmaWxsPSIjOWNhM2FmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
            target.className = "w-full h-full object-cover opacity-50";
          }}
        />
      );
    } else {
      return (
        <img 
          src={`https://placehold.co/1280x720/6366F1/FFFFFF?text=Creator+Post+${post.id}`}
          alt={`${creator.display_name}'s post`}
          className="w-full h-full object-cover"
        />
      );
    }
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Creator Not Found</h1>
          <p className="text-muted-foreground">The creator profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Creator Header */}
      <div className="relative">
        <div className="h-48 md:h-64 overflow-hidden relative">
          {creator.cover ? (
            <img 
              src={creator.cover.startsWith('/uploads/') ? creator.cover : `/uploads/${creator.cover}`} 
              alt={creator.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-muted-foreground hidden md:block">No cover photo</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={creator.avatar ? (creator.avatar.startsWith('/uploads/') ? creator.avatar : `/uploads/${creator.avatar}`) : undefined} alt={creator.username} />
                <AvatarFallback className="text-2xl">{(creator?.display_name || creator?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              {creator.activity_status_visible && creator.is_online && (
                <div className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-lg z-30" style={{ bottom: '3px', right: '3px' }}></div>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-foreground">{creator?.display_name || creator?.username}</h1>
                {creator.verified && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">@{creator.username}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                {(creator?.total_subscribers || 0).toLocaleString()} subscribers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div>
              <BioDisplay 
                bio={creator.bio || (isOwnProfile ? 'Add a bio to tell people about yourself.' : 'No bio available.')}
                context="profile"
                className="text-muted-foreground leading-tight text-sm line-clamp-2"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwnProfile ? (
          <div className="flex items-center gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0"
              title="Edit Profile"
              asChild
            >
              <Link to="/creator/settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0"
              title="Create Post"
              asChild
            >
              <Link to="/creator/upload">
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0"
              title="Share profile"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Profile link copied",
                  description: "Creator profile link has been copied to your clipboard.",
                });
              }}
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Subscription Tiers */}
      {creator?.tiers && creator.tiers.length > 0 && (
        <div id="subscription-tiers" className="mx-4 mb-6 max-w-4xl md:mx-auto md:px-6">
          <div className="bg-gradient-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">SUBSCRIPTION TIERS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {creator.tiers.map((tier: any) => (
                  <div 
                    key={tier.id} 
                    className="flex flex-col p-4 border border-border/30 rounded-lg"
                  >
                    <div className="flex-1 mb-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-sm font-medium uppercase leading-tight">{tier.name}</span>
                      </div>
                      <div className="min-h-[3rem]">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {tier.description || 'Access to exclusive content and connect directly with the creator'}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/20 pt-3">
                      <div className="text-lg font-bold text-accent">GHS {tier.price}</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto md:px-6 py-8">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-sm">
                All ({getPostCounts().all})
              </TabsTrigger>
              <TabsTrigger value="subscription" className="text-sm">
                Subscription ({getPostCounts().subscription})
              </TabsTrigger>
              <TabsTrigger value="public" className="text-sm">
                Public ({getPostCounts().public})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {getFilteredPosts().length > 0 ? (
                <div className="space-y-6">
                  {getFilteredPosts().map((post) => (
                    <Card key={post.id} className="bg-gradient-card border-border/50 overflow-hidden">
                      <CardContent className="p-4">
                        <div 
                          className="relative aspect-video bg-black cursor-pointer rounded-lg overflow-hidden mb-4"
                          onClick={() => handleContentClick(post)}
                          role="button"
                          tabIndex={0}
                        >
                          {renderPostContent(post)}

                          {/* Duration overlay for videos */}
                          {post.media_type === 'video' && hasAccessToTier(post.tier) && (
                            <div className="absolute bottom-4 right-4">
                              <div className="px-2 py-1 bg-black/80 rounded text-white text-sm font-medium">
                                {Math.floor(Math.random() * 10) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                              </div>
                            </div>
                          )}

                          {/* Tier badge */}
                          <div className="absolute top-4 left-4">
                            <Badge variant={getTierColor(post.tier)} className="text-sm">
                              {post.tier === 'public' ? 'Free' : post.tier}
                            </Badge>
                          </div>

                          {/* Content type overlay */}
                          {post.media_type !== 'video' && (
                            <div className="absolute top-4 right-4">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm">
                                {getMediaOverlayIcon(post.media_type)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Creator Info and Content */}
                        <div className="flex gap-3">
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={creator.avatar ? (creator.avatar.startsWith('/uploads/') ? creator.avatar : `/uploads/${creator.avatar}`) : undefined} alt={creator.username} />
                            <AvatarFallback className="text-sm">{(creator?.display_name || creator?.username || 'U').charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                              {post.content || post.title || 'Untitled Post'}
                            </h4>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="truncate">{creator.display_name}</span>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Eye className="w-3 h-3" />
                                <span>{Math.floor(Math.random() * 2000) + 100}</span>
                                <span>•</span>
                                <span>{getTimeAgo(post.created_at || post.createdAt)}</span>
                              </div>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center justify-between mt-2 overflow-hidden -ml-3">
                              <div className="flex items-center gap-6 flex-1 min-w-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`flex items-center gap-2 h-auto py-2 px-3 ${postLikes[post.id]?.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike(post.id);
                                  }}
                                >
                                  <Heart className={`w-5 h-5 ${postLikes[post.id]?.liked ? 'fill-current' : ''}`} />
                                  <span className="text-sm">{postLikes[post.id]?.count || 0}</span>
                                </Button>

                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCommentClick(post.id);
                                  }}
                                >
                                  <MessageSquare className="w-5 h-5" />
                                  <span className="text-sm">{post.comments_count || 0}</span>
                                </Button>

                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare(post.id);
                                  }}
                                >
                                  <Share2 className="w-5 h-5" />
                                  <span className="text-sm">Share</span>
                                </Button>
                              </div>

                              {/* Creator Edit/Delete Actions */}
                              {isOwnProfile && (
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditPost(post.id);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span className="text-sm">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-2 h-auto py-2 px-3 text-red-500 hover:text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePost(post.id);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm">Delete</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {showComments[post.id] && (
                          <div className="mt-4 pt-4 border-t border-border/20">
                            <CommentSection
                              postId={post.id}
                              onCommentCountChange={handleCommentCountChange}
                            />
                          </div>
                        )}
                      </CardContent>
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
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              {getFilteredPosts().length > 0 ? (
                <div className="space-y-6">
                  {getFilteredPosts().map((post) => (
                    <Card key={post.id} className="bg-gradient-card border-border/50 overflow-hidden">
                      <CardContent className="p-4">
                        <div 
                          className="relative aspect-video bg-black cursor-pointer rounded-lg overflow-hidden mb-4"
                          onClick={() => handleContentClick(post)}
                          role="button"
                          tabIndex={0}
                        >
                          {renderPostContent(post)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    <div className="text-center py-4">
                      <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No subscription posts yet</h3>
                      <p className="text-muted-foreground text-sm">
                        {isOwnProfile ? 'Create premium posts to engage your subscribers.' : `${creator.display_name} hasn't posted any subscription content yet.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="public" className="space-y-6">
              {getFilteredPosts().length > 0 ? (
                <div className="space-y-6">
                  {getFilteredPosts().map((post) => (
                    <Card key={post.id} className="bg-gradient-card border-border/50 overflow-hidden">
                      <CardContent className="p-4">
                        <div 
                          className="relative aspect-video bg-black cursor-pointer rounded-lg overflow-hidden mb-4"
                          onClick={() => handleContentClick(post)}
                          role="button"
                          tabIndex={0}
                        >
                          {renderPostContent(post)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    <div className="text-center py-4">
                      <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No public posts yet</h3>
                      <p className="text-muted-foreground text-sm">
                        {isOwnProfile ? 'Create some free content to attract new fans.' : `${creator.display_name} hasn't posted any public content yet.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

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