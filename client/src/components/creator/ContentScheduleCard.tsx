
import React from 'react';
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
  onPublish
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
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
            
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

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-border/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(id)}
            className="flex-1 text-xs h-8"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => onPublish(id)}
            className="flex-1 text-xs h-8 bg-gradient-primary"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Publish
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(id)}
            className="w-10 h-8 text-xs text-destructive hover:text-destructive p-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
