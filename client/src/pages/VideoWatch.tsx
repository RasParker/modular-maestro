
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CommentSection } from '@/components/fan/CommentSection';
import { Heart, MessageSquare, Share2, ArrowLeft, Maximize2, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const VideoWatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isImmersive, setIsImmersive] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'landscape' | 'portrait' | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const postData = await response.json();
          setPost(postData);
          
          // Check if user has liked this post
          if (user) {
            const likeResponse = await fetch(`/api/posts/${id}/like/${user.id}`);
            if (likeResponse.ok) {
              const likeData = await likeResponse.json();
              setLiked(likeData.liked);
            }
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load video.",
            variant: "destructive"
          });
          navigate('/fan/feed');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error",
          description: "Failed to load video.",
          variant: "destructive"
        });
        navigate('/fan/feed');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, toast, navigate]);

  const handleLike = async () => {
    if (!user || !post) return;

    try {
      if (liked) {
        await fetch(`/api/posts/${post.id}/like`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
      } else {
        await fetch(`/api/posts/${post.id}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
      }

      setLiked(!liked);
      setPost(prev => ({
        ...prev,
        likes_count: liked ? prev.likes_count - 1 : prev.likes_count + 1
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Video link has been copied to your clipboard.",
    });
  };

  const toggleImmersive = () => {
    if (videoAspectRatio === 'portrait') {
      setIsImmersive(!isImmersive);
    }
  };

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const aspectRatio = video.videoWidth / video.videoHeight;
    
    if (aspectRatio > 1) {
      setVideoAspectRatio('landscape');
      video.setAttribute('data-aspect-ratio', 'landscape');
    } else {
      setVideoAspectRatio('portrait');
      video.setAttribute('data-aspect-ratio', 'portrait');
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImmersive) {
        setIsImmersive(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isImmersive]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Video not found</h2>
          <Button onClick={() => navigate('/fan/feed')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  const mediaUrl = Array.isArray(post.media_urls) ? post.media_urls[0] : post.media_urls;
  const fullMediaUrl = mediaUrl?.startsWith('http') ? mediaUrl : `/uploads/${mediaUrl}`;

  return (
    <div className={`min-h-screen bg-background ${isImmersive ? 'is-immersive' : ''}`}>
      {/* Video Player Wrapper */}
      <div className="video-player-wrapper relative bg-black aspect-video w-full">
        {/* Back Button */}
        {!isImmersive && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
            onClick={() => navigate('/fan/feed')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        {/* Close Immersive Button */}
        {isImmersive && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={() => setIsImmersive(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        )}

        {/* Immersive Toggle Button */}
        {videoAspectRatio === 'portrait' && !isImmersive && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={toggleImmersive}
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
        )}

        {/* Video Element */}
        {post.media_type === 'video' ? (
          <video
            src={fullMediaUrl}
            className="w-full h-full video-element"
            controls
            playsInline
            onLoadedMetadata={handleVideoLoad}
            style={{
              objectFit: videoAspectRatio === 'landscape' ? 'cover' : 'contain',
              backgroundColor: videoAspectRatio === 'portrait' ? 'black' : 'transparent'
            }}
          />
        ) : (
          <img
            src={fullMediaUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content Wrapper */}
      <div className="content-wrapper bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Video Title */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {post.title || post.content}
          </h1>

          {/* Creator Info and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.creator_avatar} alt={post.creator_username} />
                <AvatarFallback>{post.creator_display_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {post.creator_display_name || post.creator_username}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 1000) + 100} views</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={post.tier === 'public' ? 'outline' : 'default'}>
                {post.tier === 'public' ? 'Free' : post.tier}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 mb-6 p-4 bg-muted/30 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${liked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{post.likes_count || 0}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>{post.comments_count || 0}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </Button>
          </div>

          {/* Description */}
          {post.content && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <CommentSection
              postId={post.id.toString()}
              initialComments={[]}
              onCommentCountChange={(count) => setPost(prev => ({ ...prev, comments_count: count }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
