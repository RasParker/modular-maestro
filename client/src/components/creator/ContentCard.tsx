
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

interface ContentCardProps {
  id: string;
  caption: string;
  type: 'Image' | 'Video' | 'Text';
  tier: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  date: string;
  views: number;
  likes: number;
  comments: number;
  mediaPreview?: string;
  category: string;
  scheduledFor?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onClick: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  caption,
  type,
  tier,
  status,
  date,
  views,
  likes,
  comments,
  mediaPreview,
  scheduledFor,
  onEdit,
  onDelete,
  onPublish,
  onClick
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
    switch (status) {
      case 'Published':
        return 'default';
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
        return <Image className="w-4 h-4 text-white" />;
      case 'video':
        return <Video className="w-4 h-4 text-white" />;
      case 'text':
        return <FileText className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-200">
      <CardContent className="p-3">
        {/* Content Preview - Profile style layout */}
        <div className="space-y-3">
          {/* Header - Badges and date at top of card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor()} className="text-xs px-2 py-0 h-5">
                {status}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                {tier}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>

          {/* Caption */}
          {(() => {
            const { truncated, needsExpansion } = truncateText(caption);
            return (
              <div className="font-medium text-foreground text-sm leading-tight">
                {expandedCaption ? caption : (
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
              </div>
            );
          })()}

          {/* Scheduled info */}
          {status === 'Scheduled' && scheduledFor && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Timer className="w-3 h-3" />
              <span>Releases {scheduledFor}</span>
            </div>
          )}

          {/* Media Preview - Square aspect ratio like profile */}
          <div 
            className="relative cursor-pointer active:opacity-90 transition-opacity"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }}
          >
            <div className="w-full aspect-square overflow-hidden rounded-lg">
              {mediaPreview ? (
                <div className="w-full h-full">
                  {type === 'Video' ? (
                    <video 
                      src={mediaPreview}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <img 
                      src={mediaPreview}
                      alt={caption}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEgxMTJWMTI1SDg4VjEwMEg3NUwxMDAgNzVaIiBmaWxsPSIjOWNhM2FmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                        target.className = "w-full h-full object-cover opacity-50";
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    {getTypeIcon()}
                    <p className="mt-2 text-xs">{type} Content</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom row - Stats and Actions combined like profile page */}
          <div className="flex items-center justify-between pt-1">
            {/* Stats */}
            {status === 'Published' ? (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
            ) : (
              <div></div>
            )}

            {/* Action Buttons - compact inline */}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
