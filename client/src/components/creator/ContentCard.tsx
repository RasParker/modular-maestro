
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
  onViewContent?: (item: ContentCardProps) => void;
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
  category,
  scheduledFor,
  onEdit,
  onDelete,
  onPublish,
  onViewContent
}) => {
  const [expandedCaption, setExpandedCaption] = useState(false);

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) {
      return { truncated: text, needsExpansion: false };
    }
    
    const truncated = text.slice(0, maxLength).trim();
    return {
      truncated,
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

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-200">
      <CardContent className="p-4">
        {/* YouTube-style horizontal layout */}
        <div className="flex gap-4">
          {/* Thumbnail - 16:9 aspect ratio */}
          <div className="flex-shrink-0">
            <div 
              className="w-48 h-[108px] overflow-hidden rounded-lg cursor-pointer hover:opacity-95 transition-opacity relative"
              onClick={(e) => {
                e.stopPropagation();
                onViewContent && onViewContent({
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
                  category,
                  scheduledFor
                });
              }}
            >
              {mediaPreview ? (
                <div className="w-full h-full relative">
                  {type === 'Video' ? (
                    <>
                      <video 
                        src={mediaPreview}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      {/* Video duration overlay */}
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {Math.floor(Math.random() * 10) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                      </div>
                    </>
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
                    <p className="mt-1 text-xs">{type}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Top section - Title and description */}
            <div className="space-y-2">
              {/* Title/Caption */}
              {(() => {
                const { truncated, needsExpansion } = truncateText(caption, 120);
                return (
                  <div className="font-medium text-foreground text-base leading-tight">
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
                              className="text-primary hover:text-primary/80 font-medium text-sm"
                            >
                              more
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
                          className="text-primary hover:text-primary/80 font-medium text-sm"
                        >
                          less
                        </button>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Metadata row */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor()} className="text-xs px-2 py-0 h-5">
                    {tier}
                  </Badge>
                  <Badge variant={getStatusColor()} className="text-xs px-2 py-0 h-5">
                    {status}
                  </Badge>
                </div>
                <span className="text-xs">{date}</span>
              </div>

              {/* Stats or Release Info */}
              {status === 'Published' ? (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{comments.toLocaleString()}</span>
                  </div>
                </div>
              ) : status === 'Scheduled' && scheduledFor ? (
                <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 font-medium">
                  <Timer className="w-4 h-4" />
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
              ) : null}
            </div>

            {/* Action Buttons - bottom right */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                className="h-8 px-3 text-sm"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="h-8 px-3 text-sm text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
