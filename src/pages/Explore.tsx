import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { Search, Users, Star, Filter } from 'lucide-react';

// Mock creators data
const CREATORS = [
  {
    id: '1',
    username: 'artisticmia',
    display_name: 'Artistic Mia',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face',
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
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
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
    cover: 'https://images.unsplash.com/photo-1556909114-b6c75d1fea83?w=400&h=200&fit=crop',
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCreators = CREATORS.filter(creator => {
    const matchesSearch = creator.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || creator.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Amazing Creators
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find creators you love and support their exclusive content with subscriptions
          </p>
        </div>

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
          {filteredCreators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={creator.cover} 
                  alt={creator.display_name}
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-6 left-4">
                  <Avatar className="w-12 h-12 border-2 border-background">
                    <AvatarImage src={creator.avatar} alt={creator.username} />
                    <AvatarFallback>{creator.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                {creator.verified && (
                  <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
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
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">From</span>
                      <span className="font-semibold text-accent">
                        ${Math.min(...creator.tiers.map(t => t.price))}/month
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link to={`/creator/${creator.username}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
      </div>
    </div>
  );
};