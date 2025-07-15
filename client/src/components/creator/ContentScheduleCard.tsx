import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit3, 
  Trash2, 
  Calendar,
  Clock,
  ExternalLink,
  Image,
  Video,
  FileText
} from 'lucide-react';

interface ContentScheduleCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'Image' | 'Video' | 'Text';
  tier: string;
  status: 'Scheduled' | 'Draft';
  thumbnail?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  scheduledFor?: string | null;
}

export const ContentScheduleCard: React.FC<ContentScheduleCardProps> = ({
  id,
  title,
  description,
  date,
  time,
  type,
  tier,
  status,
  thumbnail,
  onEdit,
  onDelete,
  onPublish,
  scheduledFor
}) => {
  const [expandedCaption, setExpandedCaption] = useState(false);

  const truncateText = (text: string, maxWords: number = 8) => {
    const words = text.split(' ');
    
    if (words.length <= maxWords) {
      return { truncated: text, needsExpansion: false };
    }
    
    return {
      truncated: words.slice(0, maxWords).join(' '),
      needsExpansion: true
    };
  };
  const getTypeIcon = () => {
    switch (type) {
      case 'Image':
        return <Image className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Text':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    return status === 'Scheduled' ? 'default' : 'secondary';
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-200">
      <CardContent className="p-4 space-y-4">
        {/* Mobile-First Layout */}

        {/* Content Preview with WhatsApp-style square container */}
        <div className="flex items-start gap-3">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            {thumbnail ? (
              <div className="w-full h-full relative overflow-hidden rounded-lg">
                {/* Background blurred image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
                  style={{ backgroundImage: `url(${thumbnail})` }}
                />
                {/* Foreground contained image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={thumbnail} 
                    alt={title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                {/* Content type overlay */}
                <div className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <div className="scale-75">
                    {getTypeIcon()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                {getTypeIcon()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
              {title}
            </h3>
            {(() => {
              const { truncated, needsExpansion } = truncateText(description);
              return (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {expandedCaption ? description : (
                    <>
                      {truncated}
                      {needsExpansion && !expandedCaption && (
                        <>
                          {'... '}
                          <button
                            onClick={() => setExpandedCaption(true)}
                            className="text-primary hover:text-primary/80 font-medium"
                          >
                            read more
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {expandedCaption && needsExpansion && (
                    <>
                      {' '}
                      <button
                        onClick={() => setExpandedCaption(false)}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        read less
                      </button>
                    </>
                  )}
                </p>
              );
            })()}

            {/* Date/Time Info - Mobile optimized */}
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {tier}
          </Badge>
          <Badge variant={getStatusColor()} className="text-xs">
            {status}
          </Badge>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30">
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(id)}
              className="h-7 px-2 text-xs"
            >
              <Edit3 className="w-3 h-3" />
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => onPublish(id)}
              className="h-7 px-2 text-xs bg-gradient-primary"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(id)}
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Release Info */}
          {status === 'Scheduled' && scheduledFor && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-3 h-3" />
              <span>
                {(() => {
                  const releaseDate = new Date(scheduledFor);
                  const now = new Date();
                  const isToday = releaseDate.toDateString() === now.toDateString();
                  const isTomorrow = releaseDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
                  
                  if (isToday) {
                    return `Today ${releaseDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                  } else if (isTomorrow) {
                    return `Tomorrow ${releaseDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                  } else {
                    return releaseDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                  }
                })()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};