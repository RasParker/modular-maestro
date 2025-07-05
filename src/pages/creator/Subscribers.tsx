
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Users, Search, Filter, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUBSCRIBERS = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    tier: 'Premium Content',
    joined: '2024-01-15',
    status: 'Active'
  },
  {
    id: '2',
    username: 'sarahsmith',
    email: 'sarah@example.com',
    tier: 'Basic Support',
    joined: '2024-01-20',
    status: 'Active'
  },
  {
    id: '3',
    username: 'mikejones',
    email: 'mike@example.com',
    tier: 'Basic Support',
    joined: '2024-02-01',
    status: 'Active'
  },
  {
    id: '4',
    username: 'emilychen',
    email: 'emily@example.com',
    tier: 'Premium Content',
    joined: '2024-02-10',
    status: 'Paused'
  }
];

export const Subscribers: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [filteredSubscribers, setFilteredSubscribers] = useState(SUBSCRIBERS);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredSubscribers(SUBSCRIBERS);
      return;
    }

    const filtered = SUBSCRIBERS.filter(subscriber => 
      subscriber.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredSubscribers(filtered);
    toast({
      title: "Search completed",
      description: `Found ${filtered.length} subscriber(s) matching "${searchTerm}"`,
    });
  };

  const handleFilter = (tier: string) => {
    setSelectedTier(tier);
    
    if (tier === 'all') {
      setFilteredSubscribers(SUBSCRIBERS);
    } else {
      const filtered = SUBSCRIBERS.filter(subscriber => subscriber.tier === tier);
      setFilteredSubscribers(filtered);
    }
    
    toast({
      title: "Filter applied",
      description: tier === 'all' ? "Showing all subscribers" : `Filtered by ${tier}`,
    });
  };

  const handleMessage = (username: string) => {
    toast({
      title: "Message feature",
      description: `Opening message thread with ${username}. This feature will be fully implemented soon.`,
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTier('all');
    setFilteredSubscribers(SUBSCRIBERS);
    toast({
      title: "Filters cleared",
      description: "Showing all subscribers",
    });
  };

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

        {/* Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedTier} onValueChange={handleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="Basic Support">Basic Support</SelectItem>
                  <SelectItem value="Premium Content">Premium Content</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Subscriber List</CardTitle>
            <CardDescription>
              Total: {filteredSubscribers.length} subscriber(s) 
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedTier !== 'all' && ` in ${selectedTier}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSubscribers.length > 0 ? (
              <div className="space-y-4">
                {filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {subscriber.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{subscriber.username}</p>
                        <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={subscriber.tier === 'Premium Content' ? 'default' : 'outline'}>
                        {subscriber.tier}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">Joined {subscriber.joined}</p>
                        <p className={`text-xs ${subscriber.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {subscriber.status}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMessage(subscriber.username)}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No subscribers found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedTier !== 'all' 
                    ? "Try adjusting your search or filter criteria"
                    : "Your subscribers will appear here once they start following you"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
