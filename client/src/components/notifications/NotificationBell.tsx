import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Settings, Check, CheckCheck, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationWebSocket } from '@/contexts/NotificationContext';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  actor?: {
    id: number;
    username: string;
    display_name: string;
    avatar?: string;
  };
  entity_type?: string;
  entity_id?: number;
  metadata?: any;
  time_ago: string;
  created_at: string;
}

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<NotificationWebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createConnection } = useNotificationWebSocket();

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery<{ count: number }>({
    queryKey: ['/api/notifications/unread-count'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch notifications when dropdown is open
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    enabled: isOpen,
    refetchInterval: isOpen ? 10000 : false, // Refetch every 10 seconds when open
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
  });

  // Initialize WebSocket connection and push notifications
  useEffect(() => {
    if (!user?.id) return;

    // Check browser push notification permission
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }

    // Create WebSocket connection
    const handleNewNotification = (notification: WebSocketNotification) => {
      setHasNewNotification(true);
      
      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      
      // Show browser push notification if permission granted
      if (Notification.permission === 'granted' && document.hidden) {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `notification-${notification.id}`,
          requireInteraction: false,
          silent: false
        });
      }
      
      // Show toast notification if user is on the page
      if (!document.hidden) {
        toast({
          title: notification.title,
          description: notification.message,
          duration: 4000,
        });
      }
    };

    wsRef.current = createConnection(handleNewNotification);

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
    };
  }, [user?.id, createConnection, queryClient, toast]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Clear new notification indicator when dropdown opens
  useEffect(() => {
    if (isOpen && hasNewNotification) {
      setTimeout(() => setHasNewNotification(false), 1000);
    }
  }, [isOpen, hasNewNotification]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }
    setIsOpen(false);
  };

  const requestPushPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        setPushPermission(permission);
        
        if (permission === 'granted') {
          toast({
            title: "Push Notifications Enabled",
            description: "You'll now receive browser notifications for new activity",
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_subscriber':
        return '👥';
      case 'new_message':
        return '💬';
      case 'new_comment':
        return '💭';
      case 'new_post':
        return '📝';
      case 'payment_success':
        return '💰';
      case 'payment_failed':
        return '❌';
      case 'payout_completed':
        return '💳';
      case 'like':
        return '❤️';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2 h-10 w-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasNewNotification ? (
          <BellRing className={cn(
            "h-5 w-5 text-primary",
            hasNewNotification && "animate-pulse"
          )} />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        {wsRef.current && (
          <div className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-12 w-96 max-w-[calc(100vw-1rem)] max-h-96 shadow-lg border z-50 bg-background right-2 md:right-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={markAllAsReadMutation.isPending}
                    className="h-8 px-2 text-xs"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 hover:bg-accent/50 transition-colors cursor-pointer",
                        !notification.read && "bg-accent/20 border-l-2 border-l-primary"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {notification.action_url ? (
                        <Link to={notification.action_url} className="block">
                          <NotificationContent notification={notification} getNotificationIcon={getNotificationIcon} />
                        </Link>
                      ) : (
                        <NotificationContent notification={notification} getNotificationIcon={getNotificationIcon} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t bg-muted/30 space-y-2">
              {pushPermission === 'default' && (
                <Button 
                  variant="outline" 
                  className="w-full text-sm"
                  onClick={requestPushPermission}
                >
                  <BellRing className="w-4 h-4 mr-2" />
                  Enable Push Notifications
                </Button>
              )}
              <Link to={`/${user?.role || 'fan'}/notifications`} onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-sm">
                  View all notifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface NotificationContentProps {
  notification: Notification;
  getNotificationIcon: (type: string) => string;
}

const NotificationContent: React.FC<NotificationContentProps> = ({ notification, getNotificationIcon }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0">
      {notification.actor?.avatar ? (
        <Avatar className="h-8 w-8">
          <AvatarImage src={notification.actor.avatar} alt={notification.actor.display_name} />
          <AvatarFallback className="text-xs">
            {notification.actor.display_name?.charAt(0) || notification.actor.username?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm">{getNotificationIcon(notification.type)}</span>
        </div>
      )}
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm text-foreground truncate">
          {notification.title}
        </p>
        {!notification.read && (
          <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 ml-2" />
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {notification.message}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {notification.time_ago}
      </p>
    </div>
  </div>
);