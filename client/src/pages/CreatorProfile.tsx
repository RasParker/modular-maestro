import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

import { CreatorPostActions } from '@/components/creator/CreatorPostActions';
import { CommentSection } from '@/components/fan/CommentSection';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Users, DollarSign, Check, Settings, Eye, MessageSquare, Heart, Share2, Image, Video, FileText, Edit, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BioDisplay } from '@/lib/text-utils';
import { OnlineStatusIndicator } from '@/components/OnlineStatusIndicator';

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
    tiers: [],
    recentPosts: []
  }
};

export const CreatorProfile: React.FC = () => {

  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);

  // Define isOwnProfile early to avoid initialization issues
  const isOwnProfile = user?.username === username;

  // Function to fetch user's posts from database
  const fetchUserPosts = async (userId: string | number) => {
    try {
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;

      // Build query parameters based on who's viewing
      let queryParams = `creatorId=${userIdNum}`;

      // For public profile page, only show published posts regardless of who's viewing
      // Draft posts should only be managed in the Content Manager, not on the profile page

      const response = await fetch(`/api/posts?${queryParams}`);
      if (response.ok) {
        const filteredPosts = await response.json();

        // Sort posts by creation date (newest first)
        filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setUserPosts(filteredPosts);

        // Initialize like status for current user
        if (user) {
          await fetchLikeStatuses(filteredPosts, user.id);
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

      // Load custom tiers from localStorage
      const savedTiers = localStorage.getItem('subscriptionTiers');
      if (savedTiers) {
        try {
          const parsedTiers = JSON.parse(savedTiers);
          if (Array.isArray(parsedTiers)) {
            // Check if these are mock tiers and clear them
            const isMockData = parsedTiers.some(tier => 
              tier.name === 'Supporter' || tier.name === 'Fan' || tier.name === 'Superfan'
            );

            if (isMockData) {
              // Clear mock data and start fresh
              localStorage.removeItem('subscriptionTiers');
              setCustomTiers([]);
            } else {
              setCustomTiers(parsedTiers);
            }
          } else {
            setCustomTiers([]);
          }
        } catch (error) {
          console.error('Error parsing saved tiers:', error);
          setCustomTiers([]);
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
        if (username && user?.username === username) {
          const fetchCreatorData = async () => {
            try {
              const response = await fetch(`/api/users/username/${username}`);
              if (response.ok) {
                const userData = await response.json();
                const newProfilePhotoUrl = localStorage.getItem('profilePhotoUrl');
                const newCoverPhotoUrl = localStorage.getItem('coverPhotoUrl');
                const newDisplayName = localStorage.getItem('displayName');
                const newBio = localStorage.getItem('bio');

                setCreator(prev => prev ? {
                  ...prev,
                  display_name: (newDisplayName && newDisplayName.trim()) || userData.display_name || userData.username,
                  avatar: (newProfilePhotoUrl && newProfilePhotoUrl.trim()) || userData.avatar || prev.avatar,
                  cover: (newCoverPhotoUrl && newCoverPhotoUrl.trim()) || userData.cover_image || prev.cover,
                  bio: (newBio && newBio.trim()) || userData.bio || prev.bio,
                } : null);

                console.log('Updated creator from storage event:', {
                  profilePhoto: newProfilePhotoUrl,
                  coverPhoto: newCoverPhotoUrl,
                  displayName: newDisplayName,
                  bio: newBio
                });
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

  // Fetch user data from database

  // Separate useEffect for fetching user posts
  useEffect(() => {
    if (creator && creator.id) {
      fetchUserPosts(creator.id);
    }
  }, [creator?.id]); // Fetch posts for the profile being viewed

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

  // Check if current user is subscribed to this creator
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user || !creator || isOwnProfile) {
        setUserSubscription(null);
        return;
      }

      try {
        console.log(`Checking subscription for user ${user.id} to creator ${creator.id}`);
        const response = await fetch(`/api/subscriptions/user/${user.id}/creator/${creator.id}`);
        if (response.ok) {
          const subscription = await response.json();
          console.log('Subscription API response:', subscription);

          // Only set subscription if it exists, is active, and is for this creator
          if (subscription && 
              subscription.status === 'active' && 
              subscription.creator_id === creator.id) {
            setUserSubscription(subscription);
            console.log(`✓ User ${user.id} has active subscription to creator ${creator.id}:`, subscription);
          } else {
            setUserSubscription(null);
            console.log(`✗ User ${user.id} has no active subscription to creator ${creator.id}`);
          }
        } else {
          setUserSubscription(null);
          console.log(`✗ No subscription found for user ${user.id} to creator ${creator.id} (${response.status})`);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setUserSubscription(null);
      }
    };

    checkSubscription();

    // Listen for subscription changes
    const handleSubscriptionChange = (event: CustomEvent) => {
      if (event.detail && event.detail.type === 'subscriptionCreated') {
        console.log('🔄 Subscription created, refreshing subscription status...');
        checkSubscription();
      }
    };

    window.addEventListener('subscriptionStatusChange', handleSubscriptionChange as EventListener);
    return () => {
      window.removeEventListener('subscriptionStatusChange', handleSubscriptionChange as EventListener);
    };
  }, [user, creator, isOwnProfile]);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!username) return;

      try {
        setLoading(true);
        // Decode the username from URL encoding
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

          console.log('Profile photo URL from localStorage:', profilePhotoUrl);
          console.log('Cover photo URL from localStorage:', coverPhotoUrl);
          console.log('Database avatar:', userData.avatar);
          console.log('Database cover:', userData.cover_image);
          console.log('ProfilePhotoUrl truthy check:', !!(profilePhotoUrl && profilePhotoUrl.trim()));
          console.log('Final avatar choice:', (profilePhotoUrl && profilePhotoUrl.trim()) || userData.avatar || null);

          // Clear invalid localStorage values for this user if they exist
          if (profilePhotoUrl === '' || profilePhotoUrl === 'null' || profilePhotoUrl === 'undefined') {
            localStorage.removeItem('profilePhotoUrl');
          }
          if (coverPhotoUrl === '' || coverPhotoUrl === 'null' || coverPhotoUrl === 'undefined') {
            localStorage.removeItem('coverPhotoUrl');
          }

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
  }, [username, user?.username, profilePhotoUrl, coverPhotoUrl, displayName, bio, customTiers]); // Include necessary dependencies

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      // Redirect to login with return path
      window.location.href = `/login?redirect=/creator/${username}`;
      return;
    }

    // Find the selected tier
    const tier = creator.tiers.find((t: any) => t.id === tierId);
    if (tier) {
      try {
        // Create subscription directly for development/testing
        const response = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fan_id: user.id,
            creator_id: creator.id,
            tier_id: tier.id,
            status: 'active',
            auto_renew: true,
            started_at: new Date().toISOString(),
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        });

        if (response.ok) {
          toast({
            title: "Successfully subscribed!",
            description: `You're now subscribed to ${creator.display_name}'s ${tier.name} tier.`,
          });
        } else {
          const errorData = await response.json();
          toast({
            title: "Subscription failed",
            description: errorData.error || "Failed to create subscription. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create subscription. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const getTimeAgo = (dateString: string) => {
    // Handle CURRENT_TIMESTAMP literal string
    if (dateString === "CURRENT_TIMESTAMP") {
      return 'Just now';
    }

    const date = new Date(dateString);

    // Check if date is invalid
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
    const tierHierarchy = {
      'supporter': 1,
      'starter pump': 1,
      'fan': 2,
      'premium': 2,
      'power gains': 2,
      'superfan': 3,
      'elite beast mode': 3
    };

    const userTierLevel = tierHierarchy[userSubscription.tier_name?.toLowerCase()] || 0;
    const postTierLevel = tierHierarchy[postTier.toLowerCase()] || 1; // Default to tier 1 for premium content

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

  const handleContentClick = (post: any) => {
    // Handle both string and array formats for media_urls
    const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls];
    const mediaUrl = mediaUrls[0];
    const fullUrl = mediaUrl?.startsWith('/uploads/') ? mediaUrl : `/uploads/${mediaUrl}`;

    // Transform the post data to match the content manager modal structure
    const modalData = {
      ...post,
      mediaPreview: fullUrl,
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
  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const currentLike = postLikes[postId] || { liked: false, count: 0 };

      if (currentLike.liked) {
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
      setPostLikes(prev => ({
        ...prev,
        [postId]: {
          liked: !currentLike.liked,
          count: currentLike.liked ? currentLike.count - 1 : currentLike.count + 1
        }
      }));

      // Refetch posts to get updated counts from database
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

  // Chat initiation functionality
  const initiateChatMutation = useMutation({
    mutationFn: async (creatorId: number) => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId: creatorId }),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      return response.json();
    },
    onSuccess: async (data) => {
      // Store the conversation ID in sessionStorage so Messages component can auto-select it
      sessionStorage.setItem('autoSelectConversationId', data.conversationId.toString());

      // Show success message
      toast({
        title: "Chat started!",
        description: `You can now message ${creator?.display_name}.`,
      });

      // Wait a moment to ensure conversation is created, then navigate
      setTimeout(() => {
        // Invalidate conversations query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
        // Navigate to messages page
        window.location.href = '/fan/messages';
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleChatClick = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=/creator/${username}`;
      return;
    }

    if (user.role !== 'fan') {
      toast({
        title: "Access Restricted",
        description: "Only fans can initiate conversations with creators.",
        variant: "destructive"
      });
      return;
    }

    // Force refresh the subscription status before checking
    console.log('🔄 Refreshing subscription status before messaging...');
    if (!creator) {
      console.log('❌ No creator found');
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/user/${user.id}/creator/${creator.id}`);
      if (response.ok) {
        const subscription = await response.json();
        console.log('💬 Fresh subscription check for messaging:', subscription);

        if (subscription && subscription.status === 'active' && subscription.creator_id === creator.id) {
          console.log('✅ Subscription confirmed for messaging');
          setUserSubscription(subscription);
          if (creator?.id) {
            initiateChatMutation.mutate(creator.id);
          }
          return;
        }
      }
    } catch (error) {
      console.error('Error checking subscription for messaging:', error);
    }

    console.log('❌ No valid subscription found for messaging');
    toast({
      title: "Subscription Required",
      description: "You need an active subscription to message this creator.",
      variant: "destructive"
    });
    // Scroll to subscription tiers
    document.getElementById('subscription-tiers')?.scrollIntoView({ behavior: 'smooth' });
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

```text
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
        <div className="h-48 md:h-64 overflow-hidden">
          {creator.cover ? (
            <img 
              src={creator.cover.startsWith('/uploads/') ? creator.cover : '/uploads/' + creator.cover} 
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
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={creator.avatar ? (creator.avatar.startsWith('/uploads/') ? creator.avatar : '/uploads/' + creator.avatar) : undefined} alt={creator.username} />
                <AvatarFallback className="text-2xl">{(creator?.display_name || creator?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {/* Online Status Dot Indicator */}
              <OnlineStatusIndicator userId={creator.id} dotOnly={true} size="lg" />
            </div>

            {/* Desktop Layout - Action buttons on the right */}
            <div className="hidden md:flex w-full items-end justify-between">
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{creator?.display_name || creator?.username}</h1>
                  {creator.verified && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">@{creator.username}</p>
                  <OnlineStatusIndicator userId={creator.id} showLastSeen={true} size="md" isOwnProfile={isOwnProfile} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Users className="w-4 h-4" />
                  {(creator?.total_subscribers || 0).toLocaleString()} subscribers
                </div>
              </div>
              {isOwnProfile ? (
                <div className="flex items-center gap-2 pb-2">
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
              ) : (
                <div className="flex items-center gap-2 pb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleChatClick}
                    disabled={initiateChatMutation.isPending}
                    className="h-10 w-10 p-0 hover:bg-accent/20 transition-colors"
                    title="Start conversation"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Layout - Action buttons below profile info */}
            <div className="md:hidden flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{creator?.display_name || creator?.username}</h1>
                {creator.verified && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {!isOwnProfile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleChatClick}
                    disabled={initiateChatMutation.isPending}
                    className="h-8 w-8 p-0 hover:bg-accent/20 transition-colors ml-auto"
                    title="Start conversation"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground">@{creator.username}</p>
                <OnlineStatusIndicator userId={creator.id} showLastSeen={true} size="md" isOwnProfile={isOwnProfile} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                {(creator?.total_subscribers || 0).toLocaleString()} subscribers
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

      {/* Bio Section */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {(() => {
              const bioText = creator.bio || (isOwnProfile ? 'Add a bio to tell people about yourself.' : 'No bio available.');

              return (
                <div>
                  <BioDisplay 
                    bio={bioText}
                    context="profile"
                    className="text-muted-foreground leading-tight text-sm line-clamp-2"
                  />
                </div>
              );
            })()}
          </div>
          {isOwnProfile && (
            <Button 
              size="sm" 
              variant="ghost" 
              asChild
              className="p-1 h-auto flex-shrink-0"
            >
              <Link to="/creator/settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recent Posts Preview */}
            <div>
              <div className="mb-4"></div>
              {userPosts.length > 0 ? (
                <div className="space-y-0 -mx-4">
                  {userPosts.map((post) => (
                    <div key={post.id} className="mb-6">{/* Instagram-style borderless post - mobile optimized */}
                      {/* Post Header - Mobile Instagram style */}
                      <div className="flex items-center justify-between px-3 py-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative inline-block">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={creator.avatar ? (creator.avatar.startsWith('/uploads/') ? creator.avatar : '/uploads/' + creator.avatar) : null} alt={creator.username} />
                              <AvatarFallback>{(creator?.display_name || creator?.username || 'U').charAt(0)}</AvatarFallback>
                            </Avatar>
                            <OnlineStatusIndicator userId={creator.id} dotOnly={true} size="sm" />
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <p className="font-semibold text-foreground text-sm">{creator.display_name}</p>
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(post.created_at || post.createdAt)}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs px-1 py-0 h-4 border-accent text-accent">
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
                      {post.media_urls && ((() => {
                        // Handle both string and array formats for media_urls
                        const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls];
                        return mediaUrls[0];
                      })()) && (
                        <div className="w-full">
                          {(() => {
                            const hasAccess = hasAccessToTier(post.tier);
                            console.log('Access check for post ' + post.id + ' (tier: ' + post.tier + '):', {
                              hasAccess,
                              isOwnProfile,
                              user: user?.id,
                              creator: creator?.id,
                              userSubscription: userSubscription ? {
                                status: userSubscription.status,
                                creator_id: userSubscription.creator_id,
                                tier_name: userSubscription.tier_name
                              } : null,
                              postTier: post.tier
                            });
                            return hasAccess;
                          })() ? (
                            <div 
                              className="relative cursor-pointer active:opacity-90 transition-opacity"
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
                              {(() => {
                                // Handle both string and array formats for media_urls
                                const mediaUrls = Array.isArray(post.media_urls) ? Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls] : [];
                                const mediaUrl = mediaUrls[0];
                                const fullUrl = mediaUrl.startsWith('/uploads/') ? mediaUrl : '/uploads/' + mediaUrl;

                                return post.media_type === 'video' ? (
                                  <video 
                                    src={fullUrl}
                                    className="w-full aspect-square object-cover"
                                    muted
                                    preload="metadata"
                                  />
                                ) : (
                                  <img 
                                    src={fullUrl}
                                    alt={post.title}
                                    className="w-full aspect-square object-cover"
                                  onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEgxMTJWMTI1SDg4VjEwMEg3NUwxMDAgNzVaIiBmaWxsPSIjOWNhM2FmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                                      target.className = "w-full aspect-square object-cover opacity-50";
                                    }}
                                  />
                                );
                              })()}
                              {/* Media type icon overlay - smaller for mobile */}
                              <div className="absolute top-2 left-2 z-20">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm">
                                  {getMediaOverlayIcon(post.media_type)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full aspect-square bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                              <div className="text-center z-10 p-4">
                                <div className="mb-3">
                                  <svg className="w-12 h-12 mx-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                </div>
                                <h3 className="text-base font-medium text-foreground mb-2">
                                  {post.tier === 'supporter' ? 'Supporter' : 
                                   post.tier === 'fan' ? 'Fan' : 
                                   post.tier === 'premium' ? 'Premium' : 
                                   post.tier === 'superfan' ? 'Superfan' : 'Premium'} Content
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Subscribe to unlock
                                </p>
                                <Button 
                                  size="sm" 
                                  className="bg-accent hover:bg-accent/90 text-black text-sm px-4"
                                  onClick={() => {
                                    if (!user) {
                                      window.location.href = '/login?redirect=/creator/' + username;
                                    } else {
                                      // Scroll to subscription tiers
                                      document.getElementById('subscription-tiers')?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                  }}
                                >
                                  {!user ? 'Login' : 'Subscribe'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons - Mobile Instagram style */}
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={'h-10 w-10 p-0 ' + (postLikes[post.id]?.liked ? 'text-red-500' : 'text-muted-foreground')}
                                onClick={() => handleLike(post.id)}
                              >
                                <Heart className={'w-7 h-7 ' + (postLikes[post.id]?.liked ? 'fill-current' : '')} />
                              </Button>
                              {(postLikes[post.id]?.count || post.likes_count || post.likes || 0) > 0 && (
                                <span className="text-sm font-medium text-foreground">
                                  {postLikes[post.id]?.count || post.likes_count || post.likes || 0}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-10 w-10 p-0 text-muted-foreground"
                                onClick={() => handleCommentClick(post.id)}
                              >
                                <MessageSquare className="w-7 h-7" />
                              </Button>
                              {post.comments_count > 0 && (
                                <span className="text-sm font-medium text-foreground">
                                  {post.comments_count}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 text-muted-foreground"
                              onClick={() => handleShare(post.id)}
                            >
                              <Share2 className="w-7 h-7" />
                            </Button>
                          </div>
                          {isOwnProfile && (
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-muted-foreground"
                                onClick={() => handleEdit(post.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-muted-foreground"
                                onClick={() => handleDelete(post.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>



                        {/* Post Caption - Mobile Instagram style */}
                        {(post.content || post.title) && (
                          <div className="mb-1">
                            <p className="text-sm leading-relaxed text-foreground">
                              {post.content || post.title}
                            </p>
                          </div>
                        )}

                        {/* View comments link */}
                        {(post.comments_count || 0) > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground text-sm font-normal"
                            onClick={() => handleCommentClick(post.id)}
                          >
                            View all {post.comments_count} comments
                          </Button>
                        )}
                      </div>

                      {/* Comments Section - Mobile optimized */}
                      {showComments[post.id] && (
                        <div className="px-3 pb-3 border-t border-border/30 mx-3">
                          <div className="pt-3">
                            <CommentSection
                              postId={post.id}
                              initialComments={post.comments || []}
                              onCommentCountChange={(count) => handleCommentCountChange(post.id, count)}
                              creatorId={creator?.id?.toString()}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    <div className="text-center py-4">
                      <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                      <p className="text-muted-foreground text-sm">
                        {isOwnProfile ? 'Start creating content to build your audience.' : creator.display_name + " hasn't posted any content yet."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Subscription Tiers */}
          <div id="subscription-tiers" className="space-y-4">
            <h2 className="text-xl font-semibold">Subscription Tiers</h2>

            {creator.tiers && creator.tiers.length > 0 ? (
              creator.tiers.map((tier) => (
                <Card key={tier.id} className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{tier.name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">GHS {tier.price}</div>
                          <div className="text-sm text-muted-foreground">per month</div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{tier.description}</p>

                      <ul className="space-y-2">
                        {(() => {
                          let benefits = tier.benefits || [];

                          // Handle case where benefits might be a JSON string
                          if (typeof benefits === 'string') {
                            try {
                              benefits = JSON.parse(benefits);
                            } catch (e) {
                              console.warn('Failed to parse benefits JSON:', e);
                              benefits = [];
                            }
                          }

                          // Ensure benefits is an array - handle null, undefined, or other non-array types
                          if (!benefits || !Array.isArray(benefits)) {
                            benefits = [];
                          }

                          // If no benefits, show a default message
                          if (benefits.length === 0) {
                            return (
                              <li className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-accent" />
                                <span>Access to exclusive content</span>
                              </li>
                            );
                          }

                          return benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-accent" />
                              <span>{benefit}</span>
                            </li>
                          ));
                        })()}
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
              ))
            ) : (
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="text-center py-4">
                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No subscription tiers</h3>
                    <p className="text-muted-foreground text-sm">
                      {isOwnProfile ? 'Create subscription tiers to start monetizing your content.' : `${creator?.display_name || creator?.username} hasn't created any subscription tiers yet.`}
                    </p>
                    {isOwnProfile && (
                      <Button variant="outline" size="sm" asChild className="mt-4">
                        <Link to="/creator/tiers">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Tiers
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
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

              {/* Clean content view - no overlays */}
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

      {/* Payment Modal */}
      {selectedTier && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedTier(null);
          }}
          tier={selectedTier}
          creatorName={creator.display_name || creator.username}
        />
      )}
    </div>
  );
};