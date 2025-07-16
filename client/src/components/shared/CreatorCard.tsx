import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

interface CreatorCardProps {
  creator: {
    id: string;
    username: string;
    display_name?: string;
    avatar?: string;
    bio?: string;
    verified?: boolean;
    total_subscribers?: number;
  };
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  const [expandedBio, setExpandedBio] = useState(false);

  const truncateText = (text: string) => {
    if (!text) return { truncated: '', needsExpansion: false };

    const words = text.split(' ');
    // Even stricter limits for mobile - ensure exactly 2 lines
    const maxWords = 12; // Very conservative for mobile 2-line limit

    if (words.length <= maxWords) {
      return { truncated: text, needsExpansion: false };
    }

    return {
      truncated: words.slice(0, maxWords).join(' '),
      needsExpansion: true
    };
  };

  const { truncated, needsExpansion } = truncateText(creator.bio || '');

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={creator.avatar ? (creator.avatar.startsWith('/uploads/') ? creator.avatar : `/uploads/${creator.avatar}`) : undefined} 
              alt={creator.username} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {(creator.display_name || creator.username).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">
                {creator.display_name || creator.username}
              </h3>
              {creator.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">@{creator.username}</p>
            {(creator.bio || truncated) && (
              <div className="mt-1">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-tight max-h-[2.2em] overflow-hidden">
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
            )}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {creator.total_subscribers || 0} subscribers
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Link to={`/creator/${creator.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};