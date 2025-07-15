
import React from 'react';
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
                <div className="relative w-full h-full">
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
                  {/* Media type icon overlay - like profile */}
                  <div className="absolute top-2 left-2 z-20">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm">
                      {getMediaOverlayIcon(type)}
                    </div>
                  </div>
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

          {/* Caption and metadata */}
          <div className="space-y-2">
            <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2">
              {caption}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor()} className="text-xs px-2 py-0 h-5">
                  {status}
                </Badge>
                <span>{tier}</span>
              </div>
              <span>{date}</span>
            </div>

            {/* Scheduled info */}
            {status === 'Scheduled' && scheduledFor && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <Timer className="w-3 h-3" />
                <span>Releases {scheduledFor}</span>
              </div>
            )}
          </div>

          {/* Stats - compact row */}
          {status === 'Published' && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
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
          )}

          {/* Action Buttons - compact */}
          <div className="flex gap-1 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="flex-1 text-xs h-7"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPublish(id);
              }}
              className="flex-1 text-xs h-7 bg-gradient-primary"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {status === 'Published' ? 'View' : 'Publish'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="w-7 h-7 text-xs text-destructive hover:text-destructive p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
