import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Users, Search, Filter } from 'lucide-react';

const SUBSCRIBERS = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    tier: 'Superfan',
    joined: '2024-01-15',
    status: 'Active'
  },
  {
    id: '2',
    username: 'sarahsmith',
    email: 'sarah@example.com',
    tier: 'Fan',
    joined: '2024-01-20',
    status: 'Active'
  },
  {
    id: '3',
    username: 'mikejones',
    email: 'mike@example.com',
    tier: 'Supporter',
    joined: '2024-02-01',
    status: 'Active'
  },
  {
    id: '4',
    username: 'emilychen',
    email: 'emily@example.com',
    tier: 'Superfan',
    joined: '2024-02-10',
    status: 'Paused'
  }
];

export const Subscribers: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Manage Subscribers
          </h1>
          <p className="text-muted-foreground">
            View and manage your subscriber base
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter by Tier
          </Button>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Subscriber List</CardTitle>
            <CardDescription>Total: {SUBSCRIBERS.length} active subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SUBSCRIBERS.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary"></div>
                    <div>
                      <p className="font-medium text-foreground">{subscriber.username}</p>
                      <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={subscriber.tier === 'Superfan' ? 'default' : 'outline'}>
                      {subscriber.tier}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">Joined {subscriber.joined}</p>
                      <p className={`text-xs ${subscriber.status === 'Active' ? 'text-success' : 'text-warning'}`}>
                        {subscriber.status}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};