import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, CheckCircle, XCircle, Eye, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PENDING_CONTENT = [
  {
    id: '1',
    title: 'Digital Art Collection - Fantasy Warriors',
    type: 'image',
    creator: {
      username: 'artisticmia',
      display_name: 'Artistic Mia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
    },
    submitted: '2024-02-19T10:30:00',
    status: 'pending',
    tier: 'Superfan',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Workout Routine Video - Upper Body',
    type: 'video',
    creator: {
      username: 'fitnessking',
      display_name: 'Fitness King',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    submitted: '2024-02-19T14:15:00',
    status: 'pending',
    tier: 'Premium',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Weekly Music Tutorial - Beat Making',
    type: 'video',
    creator: {
      username: 'musicmaker',
      display_name: 'Music Maker',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
    },
    submitted: '2024-02-19T16:45:00',
    status: 'flagged',
    tier: 'Producer',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop'
  }
];

export const ReviewContent: React.FC = () => {
  const { toast } = useToast();
  const [content, setContent] = useState(PENDING_CONTENT);

  const handleApprove = (contentId: string) => {
    setContent(content.filter(item => item.id !== contentId));
    toast({
      title: "Content approved",
      description: "Content has been approved and published.",
    });
  };

  const handleReject = (contentId: string) => {
    setContent(content.filter(item => item.id !== contentId));
    toast({
      title: "Content rejected",
      description: "Content has been rejected and removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Eye className="w-8 h-8 text-primary" />
            Review Content
          </h1>
          <p className="text-muted-foreground">
            Review and moderate user-submitted content
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Pending Content Review ({content.length})</CardTitle>
            <CardDescription>Content awaiting moderation approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {content.map((item) => (
                <div key={item.id} className="p-6 rounded-lg border border-border/50 bg-muted/10">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={item.creator.avatar} alt={item.creator.username} />
                              <AvatarFallback>{item.creator.display_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{item.creator.display_name}</p>
                              <p className="text-xs text-muted-foreground">@{item.creator.username}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                          <Badge variant="outline">
                            {item.tier}
                          </Badge>
                          <Badge variant={item.status === 'flagged' ? 'destructive' : 'secondary'}>
                            {item.status === 'flagged' && <Flag className="w-3 h-3 mr-1" />}
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Submitted: {new Date(item.submitted).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(item.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {content.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    No content pending review at the moment.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};