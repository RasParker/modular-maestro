
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ArrowLeft, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriberCard } from '@/components/subscribers/SubscriberCard';
import { SubscriberFilters } from '@/components/subscribers/SubscriberFilters';
import { SubscriberEmptyState } from '@/components/subscribers/SubscriberEmptyState';
import { SubscriberStats } from '@/components/subscribers/SubscriberStats';

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

  // Calculate stats
  const activeCount = SUBSCRIBERS.filter(s => s.status === 'Active').length;
  const recentCount = SUBSCRIBERS.filter(s => new Date(s.joined) > new Date('2024-02-01')).length;
  const hasFilters = searchTerm.trim() !== '' || selectedTier !== 'all';

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            Manage Subscribers
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage your subscriber base
          </p>
        </div>

        {/* Stats */}
        <SubscriberStats 
          totalCount={SUBSCRIBERS.length}
          activeCount={activeCount}
          recentCount={recentCount}
        />

        {/* Filters */}
        <div className="mb-6">
          <SubscriberFilters
            searchTerm={searchTerm}
            selectedTier={selectedTier}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            onFilterChange={handleFilter}
            onReset={resetFilters}
          />
        </div>

        {/* Subscriber List */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Subscriber List</CardTitle>
            <CardDescription className="text-sm">
              {filteredSubscribers.length > 0 ? (
                <>
                  Showing {filteredSubscribers.length} of {SUBSCRIBERS.length} subscriber(s)
                  {searchTerm && ` matching "${searchTerm}"`}
                  {selectedTier !== 'all' && ` in ${selectedTier}`}
                </>
              ) : (
                'No subscribers to display'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSubscribers.length > 0 ? (
              <div className="space-y-4">
                {filteredSubscribers.map((subscriber) => (
                  <SubscriberCard
                    key={subscriber.id}
                    subscriber={subscriber}
                    onMessage={handleMessage}
                  />
                ))}
              </div>
            ) : (
              <SubscriberEmptyState
                hasFilters={hasFilters}
                searchTerm={searchTerm}
                selectedTier={selectedTier}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
