import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

interface OnlineStatusIndicatorProps {
  userId: number;
  showLastSeen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  dotOnly?: boolean;
  isOwnProfile?: boolean;
}

interface OnlineStatus {
  is_online: boolean;
  last_seen: string | null;
  activity_status_visible: boolean;
}

export const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({ 
  userId, 
  showLastSeen = false,
  size = 'sm',
  dotOnly = false,
  isOwnProfile = false
}) => {
  const { data: onlineStatus } = useQuery<OnlineStatus>({
    queryKey: [`/api/users/${userId}/online-status`],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });

  // For own profile, always show status. For others, respect their privacy setting
  if (!isOwnProfile && !onlineStatus?.activity_status_visible) {
    return null; // Don't show anything if user has disabled activity status and it's not their own profile
  }

  // For own profile with dotOnly mode, always show the dot regardless of privacy settings
  if (dotOnly && isOwnProfile && onlineStatus?.is_online) {
    return (
      <div className={`${getSizeClasses()} rounded-full bg-green-500 border-2 border-white shadow-md ring-1 ring-green-500/30 absolute bottom-1 right-1 z-30`} />
    );
  }

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return '';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSizeClasses = () => {
    if (dotOnly) {
      // Smaller dots for avatar status indicators
      switch (size) {
        case 'sm':
          return 'w-3 h-3';
        case 'md':
          return 'w-3.5 h-3.5';
        case 'lg':
          return 'w-4 h-4';
        default:
          return 'w-3 h-3';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-3 h-3';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-2 h-2';
    }
  };

  // Dot-only mode for avatar status indicators
  if (dotOnly) {
    if (onlineStatus?.is_online) {
      return (
        <div className={`${getSizeClasses()} rounded-full bg-green-500 border-2 border-white shadow-md ring-1 ring-green-500/30 relative z-30`} />
      );
    }
    // Don't show anything for offline users in dot-only mode
    return null;
  }

  // Regular mode with text
  if (onlineStatus?.is_online) {
    return (
      <div className="flex items-center gap-1">
        <div className={`${getSizeClasses()} rounded-full bg-green-500 animate-pulse`} />
        <span className="text-xs text-green-600 dark:text-green-400">Online</span>
        {showLastSeen && (
          <span className="text-xs text-muted-foreground">
            • Active now
          </span>
        )}
      </div>
    );
  }

  if (showLastSeen && onlineStatus?.last_seen) {
    return (
      <div className="flex items-center gap-1">
        <div className={`${getSizeClasses()} rounded-full bg-gray-400`} />
        <span className="text-xs text-muted-foreground">
          {formatLastSeen(onlineStatus.last_seen)}
        </span>
      </div>
    );
  }

  return null;
};