import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, MessageSquare, Send, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    creator: {
      username: 'artisticmia',
      display_name: 'Artistic Mia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
    },
    last_message: 'Thank you so much for your support! ❤️',
    timestamp: '2024-02-19T14:30:00',
    unread: true,
    unread_count: 2
  },
  {
    id: '2',
    creator: {
      username: 'fitnessking',
      display_name: 'Fitness King',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    last_message: 'Great question about the workout routine!',
    timestamp: '2024-02-19T10:15:00',
    unread: false,
    unread_count: 0
  },
  {
    id: '3',
    creator: {
      username: 'musicmaker',
      display_name: 'Music Maker',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
    },
    last_message: 'Here\'s the exclusive track you requested!',
    timestamp: '2024-02-18T16:20:00',
    unread: false,
    unread_count: 0
  }
];

const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'artisticmia',
    content: 'Hi! Thanks for subscribing to my channel! 🎨',
    timestamp: '2024-02-19T12:00:00',
    type: 'received'
  },
  {
    id: '2',
    sender: 'me',
    content: 'Love your artwork! Can you share more about your creative process?',
    timestamp: '2024-02-19T12:15:00',
    type: 'sent'
  },
  {
    id: '3',
    sender: 'artisticmia',
    content: 'Thank you so much for your support! ❤️ I usually start with rough sketches and build up the details. I\'ll be sharing a behind-the-scenes video soon!',
    timestamp: '2024-02-19T14:30:00',
    type: 'received'
  }
];

export const Messages: React.FC = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.creator.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.creator.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: 'me',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'sent' as const
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/fan/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            Messages
          </h1>
          <p className="text-muted-foreground">
            Chat with your favorite creators
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedConversation.id === conversation.id 
                        ? 'bg-muted/50' 
                        : 'hover:bg-muted/20'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.creator.avatar} alt={conversation.creator.username} />
                        <AvatarFallback>{conversation.creator.display_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">
                            {conversation.creator.display_name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(conversation.timestamp)}
                            </span>
                            {conversation.unread && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.creator.avatar} alt={selectedConversation.creator.username} />
                    <AvatarFallback>{selectedConversation.creator.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedConversation.creator.display_name}</CardTitle>
                    <CardDescription>@{selectedConversation.creator.username}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'sent'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
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
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};