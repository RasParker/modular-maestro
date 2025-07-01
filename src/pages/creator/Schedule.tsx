import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';

const SCHEDULED_POSTS = [
  {
    id: '1',
    title: 'New Digital Art Collection',
    type: 'Image',
    tier: 'Superfan',
    scheduledDate: '2024-02-20',
    scheduledTime: '14:00',
    status: 'Scheduled'
  },
  {
    id: '2',
    title: 'Behind the Scenes Video',
    type: 'Video',
    tier: 'Fan',
    scheduledDate: '2024-02-22',
    scheduledTime: '18:00',
    status: 'Scheduled'
  },
  {
    id: '3',
    title: 'Weekly Update',
    type: 'Text',
    tier: 'Supporter',
    scheduledDate: '2024-02-25',
    scheduledTime: '12:00',
    status: 'Draft'
  }
];

export const Schedule: React.FC = () => {
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
                Schedule New Post
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
              <CardDescription>{SCHEDULED_POSTS.length} posts scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SCHEDULED_POSTS.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{post.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{post.type}</Badge>
                          <Badge variant="outline">{post.tier}</Badge>
                          <Badge variant={post.status === 'Scheduled' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{post.scheduledDate}</p>
                        <p className="text-xs text-muted-foreground">{post.scheduledTime}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Posts this week</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled posts</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Draft posts</span>
                  <span className="text-sm font-medium">1</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};