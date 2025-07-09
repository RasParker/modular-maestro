import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users } from 'lucide-react';

interface CreatorCardProps {
  creator: {
    id: string;
    username: string;
    display_name: string;
    avatar?: string;
    cover?: string;
    bio: string;
    category?: string;
    subscribers: number;
    verified: boolean;
    tiers: Array<{
      name: string;
      price: number;
    }>;
  };
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  const minPrice = Math.min(...creator.tiers.map(t => t.price));
  const [expandedBio, setExpandedBio] = useState(false);

  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 8; // Fewer words per line in cards
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return { truncated: text, needsExpansion: false };
    }
    
    return {
      truncated: words.slice(0, maxWords).join(' '),
      needsExpansion: true
    };
  };

  const { truncated, needsExpansion } = truncateText(creator.bio);

  return (
    <Card className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
      <div className="relative">
        <img 
          src={creator.cover || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop'} 
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
        {creator.category && (
          <Badge className="absolute top-2 left-2 bg-primary/80 text-primary-foreground">
            {creator.category}
          </Badge>
        )}
      </div>
      
      <CardContent className="pt-8 pb-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">{creator.display_name}</h3>
            <p className="text-sm text-muted-foreground">@{creator.username}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">
              {expandedBio ? creator.bio : truncated}
              {needsExpansion && !expandedBio && '...'}
            </p>
            {needsExpansion && (
              <button
                onClick={() => setExpandedBio(!expandedBio)}
                className="text-xs text-primary hover:underline mt-1 font-medium"
              >
                {expandedBio ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {creator.subscribers.toLocaleString()} subscribers
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="font-semibold text-accent">
              ${minPrice}/month
            </span>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
            asChild
          >
            <Link to={`/creator/${creator.username}`}>
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};