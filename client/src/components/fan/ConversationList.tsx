
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';

interface Conversation {
  id: string;
  creator: {
    username: string;
    display_name: string;
    avatar: string;
  };
  last_message: string;
  timestamp: string;
  unread: boolean;
  unread_count: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectConversation: (conversation: Conversation) => void;
  getTimeAgo: (dateString: string) => string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  searchTerm,
  onSearchChange,
  onSelectConversation,
  getTimeAgo
}) => {
  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Conversations</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 max-h-80 sm:max-h-96 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 sm:p-4 cursor-pointer transition-colors ${
                selectedConversation.id === conversation.id 
                  ? 'bg-muted/50' 
                  : 'hover:bg-muted/20'
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={conversation.creator.avatar} alt={conversation.creator.username} />
                  <AvatarFallback>{conversation.creator.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">
                      {conversation.creator.display_name}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(conversation.timestamp)}
                      </span>
                      {conversation.unread && (
                        <Badge variant="destructive" className="text-xs min-w-0">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
                    {conversation.last_message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
