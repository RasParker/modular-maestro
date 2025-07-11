import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Image, Video, Save } from 'lucide-react';
import { Link } from 'wouter';
import { Navbar } from '@/components/shared/Navbar';

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required").max(2000, "Caption must be less than 2000 characters"),
  accessTier: z.enum(['free', 'supporter', 'fan', 'superfan'], {
    required_error: "Please select an access tier",
  }),
});

type FormData = z.infer<typeof formSchema>;

export const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalPost, setOriginalPost] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
      accessTier: 'free',
    },
  });

  // Load the existing post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || !user) return;
      
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (response.ok) {
          const post = await response.json();
          
          // Check if user owns this post
          if (post.creator_id !== parseInt(user.id)) {
            toast({
              title: "Access denied",
              description: "You can only edit your own posts.",
              variant: "destructive",
            });
            navigate('/creator/dashboard');
            return;
          }
          
          setOriginalPost(post);
          
          // Set form values
          form.setValue('caption', post.content || post.title);
          form.setValue('accessTier', post.tier === 'public' ? 'free' : post.tier);
          
          // Set media preview if exists
          if (post.media_urls && post.media_urls.length > 0) {
            const mediaUrl = post.media_urls[0].startsWith('/uploads/') ? post.media_urls[0] : `/uploads/${post.media_urls[0]}`;
            setMediaPreview(mediaUrl);
            setMediaType(post.media_type === 'image' ? 'image' : 'video');
          }
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error",
          description: "Failed to load post. Please try again.",
          variant: "destructive",
        });
        navigate('/creator/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, user, navigate, toast, form]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 16MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image (.jpg, .png, .gif) or video (.mp4, .mov) file.",
        variant: "destructive",
      });
      return;
    }

    setMediaFile(file);
    setMediaType(isImage ? 'image' : 'video');

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);

    toast({
      title: "Media uploaded",
      description: `${file.name} has been selected successfully.`,
    });
  };

  const removeMedia = () => {
    if (mediaPreview && mediaPreview.startsWith('blob:')) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async (data: FormData) => {
    if (!user || !postId) return;

    setIsSaving(true);

    try {
      // Upload new media file if it exists
      let uploadedMediaUrls: string[] = originalPost.media_urls || [];
      if (mediaFile) {
        const formData = new FormData();
        formData.append('media', mediaFile);
        
        const uploadResponse = await fetch('/api/upload/post-media', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload media');
        }
        
        const uploadResult = await uploadResponse.json();
        uploadedMediaUrls = [uploadResult.filename];
      }

      // Prepare updated post data
      const updatedPostData = {
        title: data.caption?.substring(0, 50) || originalPost.title,
        content: data.caption || originalPost.content,
        media_type: mediaType || originalPost.media_type,
        media_urls: uploadedMediaUrls,
        tier: data.accessTier === 'free' ? 'public' : data.accessTier,
      };

      console.log('Updating post with data:', updatedPostData);

      // Update the post via API
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPostData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPost = await response.json();
      console.log('Post updated successfully:', updatedPost);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { type: 'postUpdated', post: updatedPost }
      }));

      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });

      // Navigate back to dashboard
      navigate('/creator/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Post</h1>
          <p className="text-muted-foreground">
            Update your post content and settings
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>Update your caption and media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Caption */}
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What's on your mind?"
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Media Upload */}
                <div className="space-y-4">
                  <Label>Media (Optional)</Label>
                  
                  {!mediaPreview ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="media-upload"
                      />
                      <Label htmlFor="media-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-4">
                          <Upload className="w-12 h-12 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Click to upload new media</p>
                            <p className="text-xs text-muted-foreground">
                              Images: JPG, PNG, GIF (max 16MB)<br/>
                              Videos: MP4, MOV (max 16MB)
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden bg-muted">
                        {mediaType === 'image' ? (
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                          />
                        ) : (
                          <video
                            src={mediaPreview}
                            className="w-full h-64 object-cover"
                            controls
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeMedia}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {mediaType === 'image' ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        <span>Media preview</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Access Settings</CardTitle>
                <CardDescription>Choose who can see this post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Access Tier */}
                <FormField
                  control={form.control}
                  name="accessTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free for all followers</SelectItem>
                          <SelectItem value="supporter">Supporter ($5/month)</SelectItem>
                          <SelectItem value="fan">Fan ($15/month)</SelectItem>
                          <SelectItem value="superfan">Superfan ($25/month)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};