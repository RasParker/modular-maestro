import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CommentSection } from '@/components/fan/CommentSection';
import { Heart, MessageSquare, Share2, ArrowLeft, Maximize2, X, Eye, ChevronDown, Play } from 'lucide-react';
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
  const [showCommentsSheet, setShowCommentsSheet] = useState(false);
  const [nextVideos, setNextVideos] = useState<any[]>([]);

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

    const fetchNextVideos = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const posts = await response.json();
          // Filter out current video and take next 5
          const filtered = posts.filter((p: any) => p.id.toString() !== id).slice(0, 5);
          setNextVideos(filtered);
        }
      } catch (error) {
        console.error('Error fetching next videos:', error);
      }
    };

    fetchPost();
    fetchNextVideos();
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

  const handleVideoCardClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
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
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Video Player Wrapper - YouTube style for mobile */}
        <div className="video-player-wrapper relative bg-black w-full">
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

          {/* Immersive Toggle Button - only for portrait videos */}
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
                objectFit: videoAspectRatio === 'landscape' ? 'contain' : 'contain',
                backgroundColor: 'black'
              }}
            />
          ) : (
            <img
              src={fullMediaUrl}
              alt={post.title}
              className="w-full h-full object-contain bg-black"
            />
          )}
        </div>

        {/* Content Wrapper - Scrollable area below video */}
        <div className="content-wrapper bg-background">
          <div className="px-4 py-4">
            {/* Video Title */}
            <h1 className="text-lg font-bold text-foreground mb-3 leading-tight">
              {post.content}
            </h1>

            {/* View count and date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{Math.floor(Math.random() * 1000) + 100}K views</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 h-auto py-2 px-3 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
                  onClick={handleLike}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.likes_count || 0}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">{post.comments_count || 0}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </Button>
              </div>
            </div>

            {/* Description */}
            {post.content && (
              <div className="mb-6 bg-muted/30 rounded-lg p-4">
                <p className="text-foreground text-sm leading-relaxed">{post.content}</p>
              </div>
            )}

            {/* Comments Container - YouTube Style */}
            <div 
              className="bg-background border border-border rounded-lg p-4 mb-6 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setShowCommentsSheet(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold">Comments</h3>
                  <span className="text-sm text-muted-foreground">{post.comments_count || 379}</span>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-3 mt-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="text-xs">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted/50 rounded-full px-4 py-2">
                  <span className="text-sm text-muted-foreground">Add a comment...</span>
                </div>
              </div>
            </div>

            {/* Next Videos Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Up next</h3>
              <div className="space-y-3">
                {nextVideos.map((video) => {
                  const videoMediaUrl = Array.isArray(video.media_urls) ? video.media_urls[0] : video.media_urls;
                  const videoFullUrl = videoMediaUrl?.startsWith('http') ? videoMediaUrl : `/uploads/${videoMediaUrl}`;

                  return (
                    <div 
                      key={video.id} 
                      className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
                      onClick={() => handleVideoCardClick(video.id)}
                    >
                      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-3">
                        {video.media_type === 'video' ? (
                          <video
                            src={videoFullUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={videoFullUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {Math.floor(Math.random() * 10) + 5}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-foreground line-clamp-2">
                          {video.title || video.content}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {video.creator_display_name || video.creator_username}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{Math.floor(Math.random() * 500) + 100}K views</span>
                          <span>•</span>
                          <span>{Math.floor(Math.random() * 7) + 1}d ago</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Bottom Sheet - Mobile Only */}
        <Sheet open={showCommentsSheet} onOpenChange={setShowCommentsSheet}>
          <SheetContent 
            side="bottom" 
            className="h-[85vh] p-0 border-t-4 border-border/30 rounded-t-xl bg-background flex flex-col"
          >
            <SheetHeader className="px-4 py-3 border-b border-border/20 bg-background shrink-0">
              <div className="flex items-center justify-center">
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mb-2"></div>
              </div>
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold text-foreground">
                  Comments
                </SheetTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCommentsSheet(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-3 mt-3">
                <Button variant="default" size="sm" className="rounded-full">
                  Top
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  Newest
                </Button>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-hidden">
              <CommentSection
                postId={post.id.toString()}
                initialComments={[]}
                onCommentCountChange={(count) => setPost(prev => ({ ...prev, comments_count: count }))}
                isBottomSheet={true}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen bg-background">
        <div className="flex-1 flex justify-center">
          <div className="max-w-8xl w-full flex gap-6 p-6">
            {/* Main Content */}
            <div className="flex-1 max-w-6xl">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/fan/feed')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>

              {/* Video Player */}
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                {post.media_type === 'video' ? (
                  <video
                    src={fullMediaUrl}
                    className="w-full aspect-video"
                    controls
                    onLoadedMetadata={handleVideoLoad}
                    style={{
                      objectFit: 'contain',
                      backgroundColor: 'black'
                    }}
                  />
                ) : (
                  <img
                    src={fullMediaUrl}
                    alt={post.title}
                    className="w-full aspect-video object-contain bg-black"
                  />
                )}
              </div>

              {/* Creator Profile and Video Title */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.creator_avatar} alt={post.creator_username} />
                    <AvatarFallback>{post.creator_username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">{post.creator_display_name || post.creator_username}</p>
                    <h1 className="text-base font-medium text-foreground">
                      {post.content}
                    </h1>
                  </div>
                </div>
              </div>

              {/* View count and date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>{Math.floor(Math.random() * 1000) + 100}K views</span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-6 mb-6 pb-4 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 h-auto py-2 px-3 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
                  onClick={handleLike}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.likes_count || 0}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">{post.comments_count || 0}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </Button>
              </div>

              {/* Comments Section - Desktop */}
              <CommentSection
                postId={post.id.toString()}
                initialComments={[]}
                onCommentCountChange={(count) => setPost(prev => ({ ...prev, comments_count: count }))}
                isBottomSheet={false}
              />
            </div>

            {/* Sidebar - Next Videos */}
            <div className="w-70 space-y-4">
              <h3 className="text-lg font-semibold">Up next</h3>
              <div className="space-y-3">
                {nextVideos.map((video) => {
                  const videoMediaUrl = Array.isArray(video.media_urls) ? video.media_urls[0] : video.media_urls;
                  const videoFullUrl = videoMediaUrl?.startsWith('http') ? videoMediaUrl : `/uploads/${videoMediaUrl}`;

                  return (
                    <div 
                      key={video.id} 
                      className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
                      onClick={() => handleVideoCardClick(video.id)}
                    >
                      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-2">
                        {video.media_type === 'video' ? (
                          <video
                            src={videoFullUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={videoFullUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" fill="white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {Math.floor(Math.random() * 10) + 5}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-foreground line-clamp-2">
                          {video.title || video.content}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {video.creator_display_name || video.creator_username}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{Math.floor(Math.random() * 500) + 100}K views</span>
                          <span>•</span>
                          <span>{Math.floor(Math.random() * 7) + 1}d ago</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};