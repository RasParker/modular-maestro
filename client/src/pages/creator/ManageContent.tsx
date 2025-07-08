
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Plus, Edit, Trash2, Eye, MessageSquare, Heart, Share, Image, Video, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CONTENT_DATA = [
  {
    id: '1',
    caption: 'Check out my new traditional Ghanaian kente dress! The colors are absolutely stunning...',
    type: 'Image',
    tier: 'Basic Support',
    status: 'Published',
    date: 'Jun 18, 2025',
    views: 1234,
    likes: 89,
    comments: 12,
    mediaPreview: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=800&fit=crop',
    category: 'Art'
  },
  {
    id: '2',
    caption: 'Just finished an amazing photoshoot in Accra. The energy was incredible!',
    type: 'Image',
    tier: 'Free',
    status: 'Published',
    date: 'Jun 18, 2025',
    views: 987,
    likes: 156,
    comments: 23,
    mediaPreview: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=800&fit=crop',
    category: 'Fashion'
  },
  {
    id: '3',
    caption: 'Celebrating the beautiful diversity of Ghana through this vibrant corn display...',
    type: 'Image',
    tier: 'Free',
    status: 'Published',
    date: 'Jun 18, 2025',
    views: 2156,
    likes: 201,
    comments: 45,
    mediaPreview: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=800&fit=crop',
    category: 'Cooking'
  },
  {
    id: '4',
    caption: 'Weekend vibes are here! Time to celebrate another successful week...',
    type: 'Image',
    tier: 'Free',
    status: 'Published',
    date: 'Jun 18, 2025',
    views: 876,
    likes: 134,
    comments: 18,
    mediaPreview: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=800&fit=crop',
    category: 'Fitness'
  },
  {
    id: '5',
    caption: 'Exclusive look at my creative process and workspace setup in Kumasi...',
    type: 'Video',
    tier: 'Premium Content',
    status: 'Scheduled',
    date: 'Jun 20, 2025',
    views: 0,
    likes: 0,
    comments: 0,
    mediaPreview: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=800&fit=crop',
    category: 'Tech'
  },
  {
    id: '6',
    caption: 'Hey everyone! This week has been amazing with so many exciting projects...',
    type: 'Text',
    tier: 'Basic Support',
    status: 'Draft',
    date: 'Jun 22, 2025',
    views: 0,
    likes: 0,
    comments: 0,
    mediaPreview: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=800&fit=crop',
    category: 'Music'
  }
];

export const ManageContent: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [content, setContent] = useState(CONTENT_DATA);
  const [selectedContent, setSelectedContent] = useState<typeof CONTENT_DATA[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleContentClick = (item: typeof CONTENT_DATA[0]) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
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
      case 'Premium Content':
        return 'default';
      default:
        return 'outline';
    }
  };

  const ContentCard = ({ item }: { item: typeof CONTENT_DATA[0] }) => (
    <div className="rounded-xl border border-border/50 bg-gradient-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
      {/* Top Section - Only Tier Badge and Date */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={getTierColor(item.tier)} className="text-xs">{item.tier}</Badge>
          <span className="text-xs text-muted-foreground">{item.date}</span>
        </div>
      </div>

      {/* Middle Section - Image Container */}
      <div className="px-4 pb-3">
        <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
          {item.mediaPreview ? (
            <div 
              className="relative w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleContentClick(item)}
            >
              {/* Blurred background layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
                style={{ backgroundImage: `url(${item.mediaPreview})` }}
              />
              {/* Main image */}
              <div className="relative z-10 w-full h-full flex items-center justify-center bg-black/20">
                <img 
                  src={item.mediaPreview} 
                  alt={item.caption}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {/* Type indicator overlay */}
              <div className="absolute top-2 left-2 z-20">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm">
                  {getTypeIcon(item.type)}
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="w-full h-full bg-gradient-primary/10 flex items-center justify-center rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleContentClick(item)}
            >
              <div className="text-center">
                {getTypeIcon(item.type)}
                <p className="text-xs text-muted-foreground mt-2">{item.type}</p>
              </div>
            </div>
          )}
        </AspectRatio>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.caption}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          {/* Left: Stats */}
          <div className="flex items-center gap-4">
            {item.status === 'Published' && (
              <>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>{item.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="w-3 h-3" />
                  <span>{item.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  <span>{item.comments}</span>
                </div>
              </>
            )}
            {item.status !== 'Published' && (
              <span className="text-xs text-muted-foreground">No stats yet</span>
            )}
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
              onClick={() => handleEdit(item.id)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {item.status === 'Published' && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {item.status === 'Draft' && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 hover:bg-success/10 text-success hover:text-success"
                onClick={() => handlePublish(item.id)}
              >
                <Share className="w-4 h-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Content Manager</h1>
              <p className="text-muted-foreground">
                Manage and organize your content
              </p>
            </div>
            <Button asChild>
              <Link to="/creator/upload">
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Link>
            </Button>
          </div>
        </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {publishedContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {scheduledContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {draftContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
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
      </div>

      {/* Instagram-style Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
          {selectedContent && (
            <div className="flex h-full">
              {/* Left Side - Media */}
              <div className="flex-1 bg-black flex items-center justify-center relative">
                {selectedContent.mediaPreview ? (
                  <img 
                    src={selectedContent.mediaPreview} 
                    alt={selectedContent.caption}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-center text-white">
                      {getTypeIcon(selectedContent.type)}
                      <p className="mt-2">{selectedContent.type} Content</p>
                    </div>
                  </div>
                )}
                
                {/* Vertical Action Icons - Instagram Style */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
                    onClick={() => handleEdit(selectedContent.id)}
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  
                  {selectedContent.status === 'Published' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20"
                      >
                        <Share className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                  
                  {selectedContent.status === 'Draft' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-green-400 hover:bg-black/70 border border-green-400/50"
                      onClick={() => handlePublish(selectedContent.id)}
                    >
                      <Share className="w-5 h-5" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-red-400 hover:bg-black/70 border border-red-400/50"
                    onClick={() => {
                      handleDelete(selectedContent.id);
                      closeModal();
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Right Side - Content Details */}
              <div className="w-80 bg-background border-l border-border flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={getTierColor(selectedContent.tier)} className="text-xs">
                      {selectedContent.tier}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{selectedContent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedContent.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedContent.category}
                    </Badge>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <p className="text-sm text-foreground mb-4">
                    {selectedContent.caption}
                  </p>
                  
                  {/* Stats */}
                  {selectedContent.status === 'Published' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Views</span>
                        <span className="font-medium">{selectedContent.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Likes</span>
                        <span className="font-medium">{selectedContent.likes}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Comments</span>
                        <span className="font-medium">{selectedContent.comments}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedContent.status !== 'Published' && (
                    <div className="text-sm text-muted-foreground">
                      <p>Status: <span className="font-medium">{selectedContent.status}</span></p>
                      <p className="mt-2">No engagement stats available yet</p>
                    </div>
                  )}
                </div>
                
                {/* Footer Actions */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(selectedContent.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={closeModal}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
