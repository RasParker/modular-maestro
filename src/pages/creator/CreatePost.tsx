
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Upload, Image, Video, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/mov'];

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required when no media is uploaded").optional(),
  accessTier: z.string().min(1, "Please select who can see this post"),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
}).refine((data) => {
  // At least caption or media file must be provided (media file validation happens separately)
  return data.caption && data.caption.length > 0;
}, {
  message: "Please provide a caption or upload media",
  path: ["caption"],
});

type FormData = z.infer<typeof formSchema>;

export const CreatePost: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
      accessTier: '',
      scheduledTime: '12:00',
    },
  });

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
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async (data: FormData, action: 'draft' | 'schedule' | 'publish') => {
    // Validate that we have either caption or media
    if (!data.caption?.trim() && !mediaFile) {
      toast({
        title: "Content required",
        description: "Please provide a caption or upload media to create a post.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const postData = {
        caption: data.caption,
        mediaFile,
        mediaType,
        accessTier: data.accessTier,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        status: action,
      };

      console.log('Creating post with data:', postData);

      toast({
        title: `Post ${action === 'publish' ? 'published' : action === 'schedule' ? 'scheduled' : 'saved as draft'}`,
        description: `Your post has been ${action === 'publish' ? 'published successfully' : action === 'schedule' ? 'scheduled successfully' : 'saved as draft'}.`,
      });

      // Navigate back to dashboard or schedule page
      if (action === 'schedule') {
        navigate('/creator/schedule');
      } else {
        navigate('/creator/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} post. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Post</h1>
          <p className="text-muted-foreground">
            Share exclusive content with your subscribers
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>Add your caption and media</CardDescription>
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
                  
                  {!mediaFile ? (
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
                            <p className="text-sm font-medium">Click to upload media</p>
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
                            src={mediaPreview!}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                          />
                        ) : (
                          <video
                            src={mediaPreview!}
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
                        <span>{mediaFile.name} ({(mediaFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Audience & Publishing</CardTitle>
                <CardDescription>Choose who can see this post and when to publish</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Access Tier */}
                <FormField
                  control={form.control}
                  name="accessTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose who can see this post</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free for all followers</SelectItem>
                          <SelectItem value="supporter">Supporter ($5/month)</SelectItem>
                          <SelectItem value="fan">Fan ($10/month)</SelectItem>
                          <SelectItem value="superfan">Superfan ($25/month)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Schedule Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Schedule Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="time"
                              {...field}
                            />
                            <Clock className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/creator/dashboard')}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.handleSubmit((data) => handleSubmit(data, 'draft'))()}
                disabled={isUploading}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.handleSubmit((data) => handleSubmit(data, 'schedule'))()}
                disabled={isUploading || !form.watch('scheduledDate')}
              >
                Schedule Post
              </Button>
              <Button
                type="button"
                onClick={() => form.handleSubmit((data) => handleSubmit(data, 'publish'))()}
                disabled={isUploading}
              >
                {isUploading ? 'Publishing...' : 'Publish Now'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
