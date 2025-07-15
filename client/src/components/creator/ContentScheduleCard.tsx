import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit3, 
  Trash2, 
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  Timer,
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
  views?: number;
  likes?: number;
  comments?: number;
  onClick?: () => void;
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
  scheduledFor,
  views = 0,
  likes = 0,
  comments = 0,
  onClick
}) => {
  const [expandedCaption, setExpandedCaption] = useState(false);

  const truncateText = (text: string) => {
    // Only truncate if text is likely to exceed one line (roughly 60-80 characters)
    if (text.length <= 60) {
      return { truncated: text, needsExpansion: false };
    }
    
    // Find a good break point around 50-60 characters
    const words = text.split(' ');
    let truncated = '';
    
    for (let i = 0; i < words.length; i++) {
      const testString = truncated + (truncated ? ' ' : '') + words[i];
      if (testString.length > 50) {
        if (truncated === '') {
          // If even the first word is too long, take it anyway
          truncated = words[0];
        }
        break;
      }
      truncated = testString;
    }
    
    return {
      truncated,
      needsExpansion: truncated !== text
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
    switch (status) {
      case 'Scheduled':
        return 'secondary';
      case 'Draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getMediaOverlayIcon = (mediaType: string) => {
    switch (mediaType?.toLowerCase()) {
      case 'image':
        return <Image className="w-3 h-3" />;
      case 'video':
        return <Video className="w-3 h-3" />;
      case 'text':
        return <FileText className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-200 cursor-pointer" onClick={onClick}>
      <CardContent className="p-4 space-y-4">
        {/* Media Preview Section */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
          {thumbnail ? (
            <>
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
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {/* Media type overlay */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                {getMediaOverlayIcon(type)}
              </div>
            </>
          ) : (
            <>
              {/* Placeholder for content without media */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    {getTypeIcon()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {type} Content
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Info */}
        <div className="space-y-2">
          {/* Caption with smart truncation */}
          {(() => {
            const { truncated, needsExpansion } = truncateText(description);
            return (
              <p className="text-sm text-foreground leading-relaxed">
                {expandedCaption ? description : (
                  <>
                    {truncated}
                    {needsExpansion && !expandedCaption && (
                      <>
                        {'... '}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCaption(true);
                          }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCaption(false);
                      }}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      read less
                    </button>
                  </>
                )}
              </p>
            );
          })()}

          {/* Engagement Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{comments}</span>
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
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="h-7 px-2 text-xs"
            >
              <Edit3 className="w-3 h-3" />
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPublish(id);
              }}
              className="h-7 px-2 text-xs bg-gradient-primary"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
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