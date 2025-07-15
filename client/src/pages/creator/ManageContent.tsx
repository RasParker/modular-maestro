import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ContentCard } from '@/components/creator/ContentCard';
import { ContentScheduleCard } from '@/components/creator/ContentScheduleCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Heart,
  MessageCircle,
  Share,
  Image,
  Video
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ContentItem {
  id: string;
  caption: string;
  type: 'Image' | 'Video' | 'Text';
  tier: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  date: string;
  views: number;
  likes: number;
  comments: number;
  mediaPreview?: string;
  category: string;
  scheduledFor?: string;
}

export const ManageContent: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedModalCaption, setExpandedModalCaption] = useState(false);

  // Fetch user's posts
  useEffect(() => {
    const fetchContent = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        if (response.ok) {
          const allPosts = await response.json();

          // Filter posts by current user and transform to match our interface
          const userPosts = allPosts
            .filter((post: any) => post.creator_id === parseInt(user.id))
            .map((post: any) => {
              // Handle both string and array formats for media_urls
              let mediaPreview = null;
              if (post.media_urls) {
                const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls];
                if (mediaUrls.length > 0 && mediaUrls[0]) {
                  const mediaUrl = mediaUrls[0];
                  mediaPreview = mediaUrl.startsWith('/uploads/') ? mediaUrl : `/uploads/${mediaUrl}`;
                }
              }

              return {
                id: post.id.toString(),
                caption: post.content || post.title,
                type: post.media_type === 'image' ? 'Image' as const :
                      post.media_type === 'video' ? 'Video' as const : 'Text' as const,
                tier: post.tier === 'public' ? 'Free' : 
                      post.tier === 'supporter' ? 'Basic Support' :
                      post.tier === 'fan' ? 'Fan Content' :
                      post.tier === 'premium' ? 'Premium Content' :
                      post.tier === 'superfan' ? 'Superfan Content' : 'Free',
                status: post.status === 'draft' ? 'Draft' as const :
                        post.status === 'scheduled' ? 'Scheduled' as const : 'Published' as const,
                date: post.created_at === "CURRENT_TIMESTAMP" ? 
                      new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) :
                      new Date(post.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }),
                views: 0, // Will be implemented later
                likes: post.likes_count || 0,
                comments: post.comments_count || 0,
                mediaPreview: mediaPreview,
                category: 'General',
                scheduledFor: post.scheduled_for || null,
              };
            });

          setContent(userPosts);
          console.log('Fetched user content:', userPosts);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        toast({
          title: "Error",
          description: "Failed to load your content. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    // Listen for new posts
    const handleNewPost = () => {
      fetchContent();
    };

    window.addEventListener('localStorageChange', handleNewPost);
    return () => window.removeEventListener('localStorageChange', handleNewPost);
  }, [user, toast]);

  const publishedContent = content.filter(item => item.status === 'Published');
  const scheduledContent = content.filter(item => item.status === 'Scheduled');
  const draftContent = content.filter(item => item.status === 'Draft');

  const handleEdit = (contentId: string) => {
    navigate(`/creator/edit-post/${contentId}`);
  };

  const handleDelete = (contentId: string) => {
    setContent(prev => prev.filter(item => item.id !== contentId));
    toast({
      title: "Content deleted",
      description: "Your content has been deleted successfully.",
    });
  };

  const handlePublish = (contentId: string) => {
    setContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'Published' as const }
          : item
      )
    );
    toast({
      title: "Content published",
      description: "Your content has been published successfully.",
    });
  };

  const handleContentClick = (item: ContentItem) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
    setExpandedModalCaption(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Image':
        return <Image className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Text':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Free':
        return 'outline';
      case 'Basic Support':
        return 'secondary';
      case 'Fan Content':
        return 'secondary';
      case 'Premium Content':
        return 'default';
      case 'Superfan Content':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getFilteredContent = () => {
    return content;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Content Manager</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage and organize your content
              </p>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/creator/upload">
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="published" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="published" className="flex items-center gap-2">
                Published
                <Badge variant="secondary">{publishedContent.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex items-center gap-2">
                Scheduled
                <Badge variant="secondary">{scheduledContent.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex items-center gap-2">
                Drafts
                <Badge variant="secondary">{draftContent.length}</Badge>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="published" className="space-y-4">
            {publishedContent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {publishedContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    {...item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onClick={() => handleContentClick(item)}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No published content</h3>
                  <p className="text-muted-foreground text-center mb-4">Publish your first post to get started</p>
                  <Button asChild>
                    <Link to="/creator/upload">Create Content</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            {scheduledContent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledContent.map((item) => (
                  <ContentScheduleCard
                    key={item.id}
                    id={item.id}
                    title={item.caption}
                    description={item.caption}
                    date={item.date}
                    time={item.scheduledFor ? new Date(item.scheduledFor).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''}
                    type={item.type}
                    tier={item.tier}
                    status={item.status as 'Scheduled' | 'Draft'}
                    thumbnail={item.mediaPreview}
                    scheduledFor={item.scheduledFor}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No scheduled content</h3>
                  <p className="text-muted-foreground text-center mb-4">Schedule posts to publish them automatically</p>
                  <Button asChild>
                    <Link to="/creator/upload">Create Content</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftContent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {draftContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    {...item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onClick={() => handleContentClick(item)}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No draft content</h3>
                  <p className="text-muted-foreground text-center mb-4">Save drafts to work on them later</p>
                  <Button asChild>
                    <Link to="/creator/upload">Create Content</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        )}
      </div>

      {/* Instagram-style Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vh] max-h-[95vh] p-0 overflow-hidden border-0 [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedContent?.type} Content</DialogTitle>
            <DialogDescription>View and manage your content</DialogDescription>
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
                {selectedContent.status === 'Published' && (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white">
                        <Heart className="w-7 h-7" />
                      </div>
                      <span className="text-xs text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{selectedContent.likes}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white">
                        <MessageCircle className="w-7 h-7" />
                      </div>
                      <span className="text-xs text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{selectedContent.comments}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white">
                        <Eye className="w-7 h-7" />
                      </div>
                      <span className="text-xs text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{selectedContent.views}</span>
                    </div>
                  </>
                )}

                {selectedContent.status === 'Draft' && (
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-green-400 cursor-pointer hover:bg-white/10"
                      onClick={() => handlePublish(selectedContent.id)}
                    >
                      <Share className="w-7 h-7" />
                    </div>
                    <span className="text-xs text-green-400 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>Publish</span>
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-red-400 cursor-pointer hover:bg-white/10"
                    onClick={() => {
                      handleDelete(selectedContent.id);
                      closeModal();
                    }}
                  >
                    <Trash2 className="w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Bottom Content Overlay - Instagram style with text shadows */}
              <div className="absolute bottom-4 left-4 right-16 p-4 z-20">
                <p className="text-white text-sm leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                  {expandedModalCaption ? selectedContent.caption : (
                    selectedContent.caption.length > 80 ? (
                      <>
                        {selectedContent.caption.substring(0, 80)}
                        <span 
                          className="cursor-pointer text-white/80 hover:text-white ml-1"
                          onClick={() => setExpandedModalCaption(true)}
                        >
                          ...
                        </span>
                      </>
                    ) : selectedContent.caption
                  )}
                  {expandedModalCaption && selectedContent.caption.length > 80 && (
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
    </div>
  );
};