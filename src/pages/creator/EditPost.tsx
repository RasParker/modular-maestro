import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EditPost: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [postData, setPostData] = useState({
    title: 'New Digital Art Collection',
    description: 'Check out my latest digital art collection featuring fantasy landscapes.',
    tier: 'Superfan',
    type: 'Image',
    scheduledDate: '2024-02-20',
    scheduledTime: '14:00',
    status: 'Scheduled'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
      navigate('/creator/schedule');
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
      navigate('/creator/schedule');
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/schedule">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schedule
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Post</h1>
          <p className="text-muted-foreground">
            Update your scheduled content
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>Edit your post information and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  value={postData.title}
                  onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={postData.description}
                  onChange={(e) => setPostData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select value={postData.type} onValueChange={(value) => setPostData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subscription Tier</Label>
                  <Select value={postData.tier} onValueChange={(value) => setPostData(prev => ({ ...prev, tier: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fan">Fan</SelectItem>
                      <SelectItem value="Supporter">Supporter</SelectItem>
                      <SelectItem value="Superfan">Superfan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={postData.scheduledDate}
                    onChange={(e) => setPostData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Scheduled Time</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={postData.scheduledTime}
                    onChange={(e) => setPostData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-2">
                  <Badge variant={postData.status === 'Scheduled' ? 'default' : 'secondary'}>
                    {postData.status}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </Button>
                
                <Button type="submit" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};