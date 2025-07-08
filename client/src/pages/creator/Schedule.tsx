import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/shared/Navbar';
import { ContentScheduleCard } from '@/components/creator/ContentScheduleCard';
import { 
  Plus,
  Calendar,
  BarChart3,
  Clock,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_SCHEDULED_POSTS = [
  {
    id: '1',
    title: 'New Digital Art Collection',
    description: 'Check out my latest digital artwork featuring cyberpunk themes...',
    date: '2024-02-20',
    time: '14:00',
    type: 'Image' as const,
    tier: 'Superfan',
    status: 'Scheduled' as const
  },
  {
    id: '2',
    title: 'Behind the Scenes Video',
    description: 'Take a look at my creative process and workspace setup...',
    date: '2024-02-22',
    time: '18:00',
    type: 'Video' as const,
    tier: 'Fan',
    status: 'Scheduled' as const
  },
  {
    id: '3',
    title: 'Weekly Update',
    description: 'Hey everyone! This week has been amazing. I wanted to share some thoughts about upcoming projects and collaborations...',
    date: '2024-02-25',
    time: '12:00',
    type: 'Text' as const,
    tier: 'Supporter',
    status: 'Draft' as const
  }
];

const QUICK_STATS = [
  { label: 'Scheduled posts', value: '2', icon: Calendar },
  { label: 'Draft posts', value: '1', icon: Clock },
  { label: 'This week', value: '3', icon: TrendingUp }
];

const PUBLISHING_TIPS = [
  'Post consistently to keep subscribers engaged',
  'Schedule posts during peak engagement hours',
  'Mix different content types for variety'
];

const BEST_TIMES = [
  { period: 'Weekdays', time: '2-4 PM' },
  { period: 'Weekends', time: '10 AM-12 PM' },
  { period: 'Evenings', time: '7-9 PM' }
];

export const Schedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleEdit = (id: string) => {
    console.log('Edit post:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete post:', id);
  };

  const handlePublish = (id: string) => {
    console.log('Publish post:', id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Mobile-Optimized Header */}
        <div className="space-y-4">
          {/* Back Button */}
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to="/creator/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>

          {/* Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Content Schedule</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage your scheduled and draft content
              </p>
            </div>

            <Button 
              className="bg-gradient-primary text-white w-full sm:w-auto"
              asChild
            >
              <Link to="/creator/upload">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create New Post</span>
                <span className="sm:hidden">Create Post</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile-Friendly Tab List */}
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="upcoming" className="text-sm py-2">
              Upcoming Posts
              <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                {MOCK_SCHEDULED_POSTS.filter(p => p.status === 'Scheduled').length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-sm py-2">
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {/* Post Count */}
            <div className="text-sm text-muted-foreground">
              {MOCK_SCHEDULED_POSTS.length} posts in queue
            </div>

            {/* Posts List - Mobile-Optimized */}
            <div className="space-y-4">
              {MOCK_SCHEDULED_POSTS.map((post) => (
                <ContentScheduleCard
                  key={post.id}
                  {...post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Quick Stats - Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {QUICK_STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-gradient-card border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                        </div>
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Tips and Best Times - Stacked on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Publishing Tips */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Publishing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {PUBLISHING_TIPS.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Best Times */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Best Times to Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {BEST_TIMES.map((time, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {time.period}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {time.time}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};