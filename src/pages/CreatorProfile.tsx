import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Users, DollarSign, Check } from 'lucide-react';

// Mock creator data - in real app would fetch from API
const MOCK_CREATOR = {
  id: '2',
  username: 'artisticmia',
  display_name: 'Artistic Mia',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face',
  cover: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=300&fit=crop',
  bio: 'Digital artist creating stunning fantasy worlds and characters. Join me for exclusive art tutorials, behind-the-scenes content, and early access to my latest creations.',
  subscribers: 2840,
  verified: true,
  tiers: [
    { 
      id: '1',
      name: 'Supporter', 
      price: 5,
      description: 'Access to basic content and community posts',
      features: ['Weekly art posts', 'Community access', 'Behind-the-scenes content']
    },
    { 
      id: '2',
      name: 'Fan', 
      price: 15,
      description: 'Everything in Supporter plus exclusive tutorials',
      features: ['Everything in Supporter', 'Monthly tutorials', 'Process videos', 'High-res downloads']
    },
    { 
      id: '3',
      name: 'Superfan', 
      price: 25,
      description: 'Ultimate access with personal interaction',
      features: ['Everything in Fan', 'Direct messaging', '1-on-1 feedback', 'Custom artwork requests']
    }
  ]
};

export const CreatorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  
  // In real app, would fetch creator data based on username
  const creator = MOCK_CREATOR;

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      // Redirect to login with return path
      window.location.href = `/login?redirect=/creator/${username}`;
      return;
    }
    // Handle subscription logic
    console.log(`Subscribing to tier ${tierId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Creator Header */}
      <div className="relative">
        <div className="h-48 md:h-64 overflow-hidden">
          <img 
            src={creator.cover} 
            alt={creator.display_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto flex items-end gap-4">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={creator.avatar} alt={creator.username} />
              <AvatarFallback className="text-2xl">{creator.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{creator.display_name}</h1>
                {creator.verified && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{creator.username}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                {creator.subscribers.toLocaleString()} subscribers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>
            </div>
            
            {/* Sample Posts */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Subscribe to view content</h3>
                    <p className="text-muted-foreground">
                      Subscribe to {creator.display_name} to see their exclusive posts and content.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Subscription Tiers</h2>
            
            {creator.tiers.map((tier) => (
              <Card key={tier.id} className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{tier.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">${tier.price}</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                    
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant="premium" 
                      className="w-full"
                      onClick={() => handleSubscribe(tier.id)}
                    >
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};