import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EdgeToEdgeContainer } from '@/components/layout/EdgeToEdgeContainer';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Users, Star, Filter, Heart, MessageSquare, Share2, Image, Video } from 'lucide-react';

// Mock creators data
const CREATORS = [
  {
    id: '1',
    username: 'artisticmia',
    display_name: 'Artistic Mia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop',
    bio: 'Digital artist creating stunning fantasy worlds and character designs',
    category: 'Art',
    subscribers: 2840,
    verified: true,
    tiers: [
      { name: 'Supporter', price: 5 },
      { name: 'Fan', price: 15 },
      { name: 'Superfan', price: 25 }
    ]
  },
  {
    id: '2',
    username: 'fitnessking',
    display_name: 'Fitness King',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    bio: 'Personal trainer sharing workout tips and nutrition advice',
    category: 'Fitness',
    subscribers: 5120,
    verified: true,
    tiers: [
      { name: 'Basic', price: 10 },
      { name: 'Premium', price: 20 }
    ]
  },
  {
    id: '3',
    username: 'musicmaker',
    display_name: 'Music Maker',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
    bio: 'Producer creating exclusive beats and music tutorials',
    category: 'Music',
    subscribers: 1890,
    verified: false,
    tiers: [
      { name: 'Listener', price: 8 },
      { name: 'Producer', price: 18 }
    ]
  },
  {
    id: '4',
    username: 'techguru',
    display_name: 'Tech Guru',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
    bio: 'Technology reviews and programming tutorials',
    category: 'Tech',
    subscribers: 3250,
    verified: true,
    tiers: [
      { name: 'Follower', price: 7 },
      { name: 'Student', price: 12 },
      { name: 'Pro', price: 25 }
    ]
  },
  {
    id: '5',
    username: 'cookingstar',
    display_name: 'Cooking Star',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
    bio: 'Chef sharing exclusive recipes and cooking techniques',
    category: 'Cooking',
    subscribers: 2150,
    verified: true,
    tiers: [
      { name: 'Foodie', price: 9 },
      { name: 'Chef', price: 19 }
    ]
  },
  {
    id: '6',
    username: 'fashionista',
    display_name: 'Style Maven',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=200&fit=crop',
    bio: 'Fashion designer and style consultant',
    category: 'Fashion',
    subscribers: 1820,
    verified: false,
    tiers: [
      { name: 'Trendy', price: 12 },
      { name: 'Stylish', price: 22 }
    ]
  }
];

const CATEGORIES = ['All', 'Art', 'Fitness', 'Music', 'Tech', 'Cooking', 'Fashion'];

export const Explore: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tierSelectionModalOpen, setTierSelectionModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  
  const [realCreators, setRealCreators] = useState<any[]>([]);
  const [allCreators, setAllCreators] = useState<any[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch('/api/creators');
        if (response.ok) {
          const creators = await response.json();
          console.log('Fetched real creators:', creators);

          // Transform real creators to match the expected format
          const transformedCreators = await Promise.all(creators.map(async (creator: any) => {
            // Check localStorage for profile customizations for this specific creator
            const profilePhotoUrl = localStorage.getItem('profilePhotoUrl');
            const coverPhotoUrl = localStorage.getItem('coverPhotoUrl');
            const displayName = localStorage.getItem('displayName');
            const bio = localStorage.getItem('bio');

            // Fetch subscription tiers from API
            let tiers = [];
            try {
              const tiersResponse = await fetch(`/api/creators/${creator.id}/tiers`);
              if (tiersResponse.ok) {
                const tiersData = await tiersResponse.json();
                tiers = tiersData.map((tier: any) => ({
                  id: tier.id,
                  name: tier.name,
                  price: parseFloat(tier.price)
                }));
              }
            } catch (error) {
              console.error("Error fetching subscription tiers:", error);
              tiers = [];
            }

            return {
              id: `real_${creator.id}`,
              username: creator.username,
              display_name: displayName || creator.display_name || creator.username,
              avatar: profilePhotoUrl || creator.avatar || null,
              cover: coverPhotoUrl || creator.cover_image || null,
              bio: bio || creator.bio || 'Creator profile - join for exclusive content!',
              category: 'General',
              subscribers: creator.total_subscribers || 0,
              verified: creator.verified || false,
              tiers: tiers
            };
          }));

          setRealCreators(transformedCreators);
          // Combine real creators with mock creators
          setAllCreators([...transformedCreators, ...CREATORS]);
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
        // Fallback to mock creators only
        setAllCreators(CREATORS);
      }
    };

    fetchCreators();
  }, []);

  const handleSubscribe = async (creatorName: string, price: number) => {
    if (!user) {
      window.location.href = `/login?redirect=/explore`;
      return;
    }

    try {
      // Find the creator
      const creator = allCreators.find(c => c.display_name === creatorName);
      if (!creator) {
        toast({
          title: "Error",
          description: "Creator not found.",
          variant: "destructive"
        });
        return;
      }

      // Check if user already has active subscription to this creator (only for real creators)
      if (creator.id.startsWith('real_')) {
        const subscriptionCheckResponse = await fetch(`/api/subscriptions/user/${user.id}/creator/${parseInt(creator.id.replace('real_', ''))}`);
        if (subscriptionCheckResponse.ok) {
          toast({
            title: "Already subscribed",
            description: `You already have an active subscription to ${creatorName}.`,
            variant: "destructive"
          });
          return;
        }
      }

      // Open tier selection modal to show all options
      setSelectedCreator(creator);
      setTierSelectionModalOpen(true);
    } catch (error) {
      console.error('Subscription check error:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTierSelected = (tier: any) => {
    setSelectedTier(tier);
    setTierSelectionModalOpen(false);
    setPaymentModalOpen(true);
  };

  

  const filteredCreators = allCreators.filter(creator => {
    const matchesSearch = creator.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || creator.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <EdgeToEdgeContainer>
      {/* Hero Section - Full Width */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border">
        <EdgeToEdgeContainer maxWidth="7xl" enablePadding enableTopPadding>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Discover Amazing Creators
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find creators you love and support their exclusive content with subscriptions
            </p>
          </div>
        </EdgeToEdgeContainer>
      </div>

      {/* Main Content */}
      <EdgeToEdgeContainer maxWidth="7xl" enablePadding className="py-6 sm:py-8">

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => {
            return (
              <Card key={creator.id} className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
                <div className="relative">
                  {creator.cover ? (
                    <img
                      src={creator.cover}
                      alt={creator.display_name}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-32 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${creator.cover ? 'hidden' : ''}`}>
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="absolute -bottom-6 left-4">
                    <Avatar className="w-12 h-12 border-2 border-background">
                      <AvatarImage src={creator.avatar} alt={creator.username} />
                      <AvatarFallback>{creator.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  {creator.verified && (
                    <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground hover:bg-accent/90">
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge className="absolute top-2 left-2 bg-primary/80 text-primary-foreground">
                    {creator.category}
                  </Badge>
                </div>

                <CardContent className="pt-8 pb-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{creator.display_name}</h3>
                      <p className="text-sm text-muted-foreground">@{creator.username}</p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 leading-tight max-h-[2.4em] overflow-hidden">
                      {creator.bio}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {creator.subscribers.toLocaleString()} subscribers
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Subscription tiers:</span>
                        <span className="text-sm font-medium">
                          {creator.tiers.length} option{creator.tiers.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {creator.tiers.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">From</span>
                          <span className="font-semibold text-accent">
                            GHS {Math.min(...creator.tiers.map(t => t.price))}/month
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">No tiers available</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        asChild
                      >
                        <Link to={`/creator/${creator.username}`}>
                          View Profile
                        </Link>
                      </Button>
                      {creator.tiers.length > 0 ? (
                        <Button
                          className="w-full"
                          onClick={() => handleSubscribe(creator.display_name, Math.min(...creator.tiers.map(t => t.price)))}
                        >
                          Subscribe from GHS {Math.min(...creator.tiers.map(t => t.price))}/month
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled
                        >
                          No subscription tiers available
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCreators.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No creators found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find creators
            </p>
          </div>
        )}

      </EdgeToEdgeContainer>

      {/* Tier Selection Modal */}
      {selectedCreator && (
        <Dialog open={tierSelectionModalOpen} onOpenChange={setTierSelectionModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choose a subscription tier</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Select a tier to subscribe to {selectedCreator.display_name}
              </p>
            </DialogHeader>
            <div className="space-y-4">
              {selectedCreator.tiers.map((tier: any) => (
                <div
                  key={tier.id}
                  className="p-4 border border-border rounded-lg hover:border-accent/50 cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => handleTierSelected(tier)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{tier.name}</h4>
                      <div className="font-bold text-accent text-lg mt-1">
                        GHS {tier.price}/month
                      </div>
                    </div>
                  </div>
                  
                  {tier.description && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {tier.description}
                    </p>
                  )}

                  {tier.benefits && tier.benefits.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        What's included:
                      </p>
                      <div className="space-y-1">
                        {tier.benefits.slice(0, 3).map((benefit: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-foreground leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                        {tier.benefits.length > 3 && (
                          <div className="text-xs text-muted-foreground mt-2">
                            +{tier.benefits.length - 3} more benefits
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-border/30">
                    <button className="w-full text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                      Select {tier.name} → GHS {tier.price}/month
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Modal */}
      {selectedTier && selectedCreator && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedTier(null);
            setSelectedCreator(null);
          }}
          tier={selectedTier}
          creatorName={selectedCreator.display_name}
        />
      )}
    </EdgeToEdgeContainer>
  );
};