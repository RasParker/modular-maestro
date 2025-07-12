
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pause, Play, X } from 'lucide-react';

interface Subscription {
  id: string;
  creator: {
    username: string;
    display_name: string;
    avatar: string;
    category: string;
  };
  tier: string;
  price: number;
  status: 'active' | 'paused';
  next_billing: string;
  joined: string;
  auto_renew: boolean;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onPauseResume: (id: string) => void;
  onCancel: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onPauseResume,
  onCancel
}) => {
  return (
    <Card className="bg-gradient-card border-border/50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
              <AvatarImage src={subscription.creator.avatar} alt={subscription.creator.username} />
              <AvatarFallback>{subscription.creator.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                {subscription.creator.display_name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                @{subscription.creator.username}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{subscription.creator.category}</Badge>
                <Badge variant="outline" className="text-xs">{subscription.tier}</Badge>
                <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {subscription.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:text-right gap-2">
            <p className="text-lg font-bold text-foreground">
              GHS {subscription.price}/month
            </p>
            <p className="text-sm text-muted-foreground">
              Next: {subscription.next_billing}
            </p>
            <p className="text-xs text-muted-foreground">
              Joined: {new Date(subscription.joined).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Auto-renew:</span>
            <Badge variant={subscription.auto_renew ? 'default' : 'outline'} className="text-xs">
              {subscription.auto_renew ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPauseResume(subscription.id)}
              className="flex-1 sm:flex-initial"
            >
              {subscription.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Resume
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive flex-1 sm:flex-initial"
              onClick={() => onCancel(subscription.id)}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
