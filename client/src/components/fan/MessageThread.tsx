
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
}

interface Creator {
  username: string;
  display_name: string;
  avatar: string;
}

interface MessageThreadProps {
  creator: Creator;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  creator,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage
}) => {
  return (
    <Card className="bg-gradient-card border-border/50 h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={creator.avatar} alt={creator.username} />
            <AvatarFallback>{creator.display_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg truncate">{creator.display_name}</CardTitle>
            <CardDescription className="truncate">@{creator.username}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 p-3 sm:p-6">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-lg ${
                  message.type === 'sent'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'sent' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            className="flex-1 text-sm"
          />
          <Button onClick={onSendMessage} size="sm" className="flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
