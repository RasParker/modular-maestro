import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MessageSquare, Search, Send, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ConversationList } from '@/components/fan/ConversationList';
import { MessageThread } from '@/components/fan/MessageThread';

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
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSelectConversation = (conversation: typeof MOCK_CONVERSATIONS[0]) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
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
      {/* Mobile View - Instagram-style List Layout */}
      <div className="lg:hidden">
        <div className="px-4 py-6">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4">
              <Link to="/fan/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Messages
            </h1>
            <p className="text-muted-foreground text-sm">
              Chat with your favorite creators
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Conversation List - Instagram Style */}
          <div className="space-y-0 divide-y divide-border/30">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/fan/messages/${conversation.id}`}
                className="block py-4 hover:bg-accent/5 transition-colors active:bg-accent/10"
              >
                <div className="flex items-center gap-4 px-2">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={conversation.creator.avatar} alt={conversation.creator.display_name} />
                      <AvatarFallback className="text-lg">{conversation.creator.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                        {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground truncate text-base">
                        {conversation.creator.display_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(conversation.timestamp)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate leading-relaxed">
                      {conversation.last_message}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No conversations</h3>
              <p className="text-muted-foreground text-sm">
                Start following creators to begin conversations
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View - Instagram Style Split Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
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
            <p className="text-base text-muted-foreground">
              Chat with your favorite creators
            </p>
          </div>

          <div className="flex h-[calc(100vh-200px)] border border-border/30 rounded-lg overflow-hidden bg-card shadow-sm">
            {/* Left Sidebar - Conversations List */}
            <div className="w-80 border-r border-border/30 flex flex-col bg-card">
              <ConversationList
                conversations={filteredConversations}
                selectedConversation={selectedConversation}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSelectConversation={setSelectedConversation}
                getTimeAgo={getTimeAgo}
              />
            </div>

            {/* Right Chat Area - Full Width */}
            <div className="flex-1 flex flex-col bg-background">
              <MessageThread
                creator={selectedConversation.creator}
                messages={messages}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};