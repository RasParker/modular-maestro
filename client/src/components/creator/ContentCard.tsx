
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

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-200 cursor-pointer">
      <CardContent className="p-4 space-y-4">
        {/* Content Preview */}
        <div className="flex items-start gap-3" onClick={onClick}>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            {mediaPreview ? (
              <div className="w-full h-full relative overflow-hidden rounded-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
                  style={{ backgroundImage: `url(${mediaPreview})` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={mediaPreview} 
                    alt={caption}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="absolute top-1 right-1">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm">
                    <div className="text-white">
                      {getTypeIcon()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                <div className="scale-150">
                  {getTypeIcon()}
                </div>
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
              {caption}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {tier} • {date}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge variant={getStatusColor()} className="text-xs">
            {status}
          </Badge>
          {status === 'Scheduled' && scheduledFor && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Timer className="w-3 h-3" />
              <span>Releases {scheduledFor}</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {status === 'Published' ? (
            <div className="flex items-center gap-4">
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
          ) : status === 'Scheduled' && scheduledFor ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-primary">
                <Calendar className="w-3 h-3" />
                <span>Scheduled for {scheduledFor}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Draft saved {date}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-border/30">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
            className="flex-1 text-xs h-8"
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
            className="flex-1 text-xs h-8 bg-gradient-primary"
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
            className="w-10 h-8 text-xs text-destructive hover:text-destructive p-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
