
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Calendar, Clock, Plus, Edit, Trash2, Image, Video, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SCHEDULED_POSTS = [
  {
    id: '1',
    title: 'New Digital Art Collection',
    caption: 'Check out my latest digital artwork featuring cyberpunk themes...',
    type: 'Image',
    tier: 'Superfan',
    scheduledDate: '2024-02-20',
    scheduledTime: '14:00',
    status: 'Scheduled',
    mediaPreview: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Behind the Scenes Video',
    caption: 'Take a look at my creative process and workspace setup...',
    type: 'Video',
    tier: 'Fan',
    scheduledDate: '2024-02-22',
    scheduledTime: '18:00',
    status: 'Scheduled',
    mediaPreview: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Weekly Update',
    caption: 'Hey everyone! This week has been amazing. I wanted to share some thoughts about upcoming projects and collaborations...',
    type: 'Text',
    tier: 'Supporter',
    scheduledDate: '2024-02-25',
    scheduledTime: '12:00',
    status: 'Draft',
    mediaPreview: null
  }
];

export const Schedule: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [scheduledPosts, setScheduledPosts] = useState(SCHEDULED_POSTS);

  const handleEdit = (postId: string) => {
    navigate(`/creator/edit-post/${postId}`);
  };

  const handleDelete = (postId: string) => {
    setScheduledPosts(posts => posts.filter(post => post.id !== postId));
    toast({
      title: "Post deleted",
      description: "Scheduled post has been deleted successfully.",
    });
  };

  const handlePublishNow = (postId: string) => {
    setScheduledPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, status: 'Published' as const }
          : post
      )
    );
    toast({
      title: "Post published",
      description: "Your post has been published successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Published':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Image':
        return <Image className="w-5 h-5" />;
      case 'Video':
        return <Video className="w-5 h-5" />;
      case 'Text':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

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
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-8 h-8 text-primary" />
                Content Schedule
              </h1>
              <p className="text-muted-foreground">
                Manage your scheduled and draft content
              </p>
            </div>
            <Button asChild>
              <Link to="/creator/upload">
                <Plus className="w-4 h-4 mr-2" />
                Create New Post
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
              <CardDescription>{scheduledPosts.length} posts in queue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(post.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{post.title || 'Untitled Post'}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {post.caption}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{post.type}</Badge>
                            <Badge variant="outline">{post.tier}</Badge>
                            <Badge variant={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <Calendar className="w-3 h-3" />
                              {post.scheduledDate}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              {post.scheduledTime}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(post.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {post.status === 'Scheduled' && (
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => handlePublishNow(post.id)}
                              >
                                Publish Now
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {scheduledPosts.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No scheduled posts</h3>
                    <p className="text-muted-foreground mb-4">Create your first post to get started</p>
                    <Button asChild>
                      <Link to="/creator/upload">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Post
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled posts</span>
                  <span className="text-sm font-medium">
                    {scheduledPosts.filter(p => p.status === 'Scheduled').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Draft posts</span>
                  <span className="text-sm font-medium">
                    {scheduledPosts.filter(p => p.status === 'Draft').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This week</span>
                  <span className="text-sm font-medium">3</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Publishing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  • Post consistently to keep subscribers engaged
                </p>
                <p className="text-sm text-muted-foreground">
                  • Schedule posts during peak engagement hours
                </p>
                <p className="text-sm text-muted-foreground">
                  • Mix different content types for variety
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Best Times to Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekdays</span>
                  <span className="font-medium">2-4 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekends</span>
                  <span className="font-medium">10 AM-12 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Evenings</span>
                  <span className="font-medium">7-9 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
