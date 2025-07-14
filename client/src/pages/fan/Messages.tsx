
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/shared/Navbar';
import { ConversationList } from '@/components/fan/ConversationList';
import { MessageThread } from '@/components/fan/MessageThread';
import { ArrowLeft, MessageSquare, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  const [showMobileChat, setShowMobileChat] = useState(false);

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
      <Navbar />
      
      {/* Mobile View - Instagram Style Tap-to-Open */}
      <div className="lg:hidden">
        {!showMobileChat ? (
          /* Conversation List View */
          <div className="min-h-screen bg-background">
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border/20">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <Button variant="ghost" asChild size="sm">
                    <Link to="/fan/dashboard">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <h1 className="text-lg font-semibold">Messages</h1>
                  <div className="w-16"></div> {/* Spacer for center alignment */}
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/30 border-border/30"
                  />
                </div>
              </div>
            </div>
            
            {/* Conversations List */}
            <div className="px-0">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 p-4 border-b border-border/10 active:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <Avatar className="h-14 w-14 flex-shrink-0">
                    <AvatarImage src={conversation.creator.avatar} alt={conversation.creator.username} />
                    <AvatarFallback>{conversation.creator.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {conversation.creator.display_name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(conversation.timestamp)}
                        </span>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conversation.last_message}
                      </p>
                      {conversation.unread && conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs min-w-0 h-5 px-1.5 ml-2">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Full-Screen Chat View */
          <div className="min-h-screen bg-background flex flex-col">
            {/* Chat Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border/20">
              <div className="flex items-center gap-3 p-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToList}
                  className="p-2 -ml-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.creator.avatar} alt={selectedConversation.creator.username} />
                  <AvatarFallback>{selectedConversation.creator.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-foreground truncate">
                    {selectedConversation.creator.display_name}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    @{selectedConversation.creator.username}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.type === 'sent'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
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

            {/* Message Input - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/20 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-full border-border/30 bg-muted/30"
                />
                <Button onClick={handleSendMessage} size="sm" className="rounded-full px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
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
