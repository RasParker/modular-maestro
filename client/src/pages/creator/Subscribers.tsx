import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ArrowLeft, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriberCard } from '@/components/subscribers/SubscriberCard';
import { SubscriberFilters } from '@/components/subscribers/SubscriberFilters';
import { SubscriberEmptyState } from '@/components/subscribers/SubscriberEmptyState';
import { SubscriberStats } from '@/components/subscribers/SubscriberStats';

export const Subscribers: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // Added activeTab state

  // Fetch real subscriber data
  useEffect(() => {
    const fetchSubscribers = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/creators/${user.id}/subscribers`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched subscribers:', data);
          setSubscribers(data);
          setFilteredSubscribers(data);
        } else {
          console.error('Failed to fetch subscribers');
          setSubscribers([]);
          setFilteredSubscribers([]);
        }
      } catch (error) {
        console.error('Error fetching subscribers:', error);
        setSubscribers([]);
        setFilteredSubscribers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [user]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredSubscribers(subscribers);
      return;
    }

    const filtered = subscribers.filter(subscriber => 
      subscriber.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
      setFilteredSubscribers(subscribers);
    } else {
      const filtered = subscribers.filter(subscriber => subscriber.tier_name === tier);
      setFilteredSubscribers(filtered);
    }

    toast({
      title: "Filter applied",
      description: tier === 'all' ? "Showing all subscribers" : `Filtered by ${tier}`,
    });
  };

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (subscriberId: string) => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId: parseInt(subscriberId) }),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      // Navigate to messages page or open conversation
      navigate('/creator/messages');
      toast({
        title: "Conversation started",
        description: "You can now send messages to this subscriber.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMessage = (username: string) => {
    // Find the subscriber by username to get their ID
    const subscriber = subscribers.find(s => s.username === username);
    if (subscriber) {
      createConversationMutation.mutate(subscriber.id);
    } else {
      toast({
        title: "Error",
        description: "Could not find subscriber information.",
        variant: "destructive",
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTier('all');
    setFilteredSubscribers(subscribers);
    toast({
      title: "Filters cleared",
      description: "Showing all subscribers",
    });
  };

   const getNewSubscribers = () => {
    return subscribers.filter(s => new Date(s.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  };

  const getTopSubscribers = () => {
    // Replace with actual logic to determine top subscribers
    return subscribers.slice(0, 5);
  };

  // Calculate stats
  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const recentCount = subscribers.filter(s => new Date(s.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
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

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscribers...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <SubscriberStats 
              totalCount={subscribers.length}
              activeCount={activeCount}
              recentCount={recentCount}
            />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
            <TabsList className="flex flex-wrap gap-2 mb-6 h-auto bg-transparent">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Subscribers
                <span className="ml-2 text-xs opacity-70">
                  {subscribers.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                New This Month
                <span className="ml-2 text-xs opacity-70">
                  {getNewSubscribers().length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="top" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Top Supporters
                <span className="ml-2 text-xs opacity-70">
                  {getTopSubscribers().length}
                </span>
              </TabsTrigger>
            </TabsList>

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
                  Showing {filteredSubscribers.length} of {subscribers.length} subscriber(s)
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
          </>
        )}
        </Tabs>
      </div>
    </div>
  );
};