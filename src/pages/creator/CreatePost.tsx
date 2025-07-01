import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Upload, Image, Video, FileText } from 'lucide-react';

export const CreatePost: React.FC = () => {
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

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="text-center">
              <Image className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Image Post</CardTitle>
              <CardDescription>Share photos and artwork</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Video Post</CardTitle>
              <CardDescription>Share videos and content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Text Post</CardTitle>
              <CardDescription>Share updates and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Create Text Post
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};