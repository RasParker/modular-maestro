
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Plus, Edit, Trash2, Eye, MessageSquare, Heart, Share, Image, Video, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CONTENT_DATA = [
  {
    id: '1',
    title: 'Look what I got',
    caption: 'Check out my new traditional Ghanaian kente dress! The colors are absolutely stunning...',
    type: 'Image',
    tier: 'Basic Support',
    status: 'Published',
    date: 'Jun 18, 2025',
    views: 1234,
    likes: 89,
    comments: 12,
    mediaPreview: '/placeholder.svg'
  },
  {
    id: '2',
    title: "What's happening guys?",
    caption: 'Just finished an amazing photoshoot in Accra. The energy was incredible!',
    type: 'Image',
    tier: 'Free',
    status: 'Published',
    date: 'Jun 18, 2025',
    views: 987,
    likes: 156,
    comments: 23,
    mediaPreview: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Different colors, one people!',
    caption: 'Celebrating the beautiful diversity of Ghana through this vibrant corn display...',
    type: 'Image',
    tier: 'Free',
    status: 'Published',
    date: 'Jun 18, 2025',
    views: 2156,
    likes: 201,
    comments: 45,
    mediaPreview: '/placeholder.svg'
  },
  {
    id: '4',
    title: "It's Fridayyy! Thank God!",
    caption: 'Weekend vibes are here! Time to celebrate another successful week...',
    type: 'Image',
    tier: 'Free',
    status: 'Published',
    date: 'Jun 18, 2025',
    views: 876,
    likes: 134,
    comments: 18,
    mediaPreview: '/placeholder.svg'
  },
  {
    id: '5',
    title: 'Behind the Scenes Video',
    caption: 'Exclusive look at my creative process and workspace setup in Kumasi...',
    type: 'Video',
    tier: 'Premium Content',
    status: 'Scheduled',
    date: 'Jun 20, 2025',
    views: 0,
    likes: 0,
    comments: 0,
    mediaPreview: '/placeholder.svg'
  },
  {
    id: '6',
    title: 'Weekly Update Draft',
    caption: 'Hey everyone! This week has been amazing with so many exciting projects...',
    type: 'Text',
    tier: 'Basic Support',
    status: 'Draft',
    date: 'Jun 22, 2025',
    views: 0,
    likes: 0,
    comments: 0,
    mediaPreview: null
  }
];

export const ManageContent: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [content, setContent] = useState(CONTENT_DATA);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Scheduled':
        return 'secondary';
      case 'Draft':
        return 'outline';
      default:
        return 'secondary';
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
    <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
          {getTypeIcon(item.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {item.caption}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getTierColor(item.tier)}>{item.tier}</Badge>
                <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
              
              {item.status === 'Published' && (
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {item.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {item.comments}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEdit(item.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              {item.status === 'Draft' && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handlePublish(item.id)}
                >
                  Publish
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Published Content</CardTitle>
                <CardDescription>
                  Your live content that subscribers can see
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {publishedContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
                {publishedContent.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No published content</h3>
                    <p className="text-muted-foreground">Publish your first post to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Scheduled Content</CardTitle>
                <CardDescription>
                  Content scheduled for future publication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduledContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
                {scheduledContent.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No scheduled content</h3>
                    <p className="text-muted-foreground">Schedule posts to publish them automatically</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Draft Content</CardTitle>
                <CardDescription>
                  Content you're still working on
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {draftContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
                {draftContent.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No draft content</h3>
                    <p className="text-muted-foreground">Save drafts to work on them later</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
