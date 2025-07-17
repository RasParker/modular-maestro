
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MessageSquare, Search, Send, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    creator: {
      username: 'alexartist',
      display_name: 'Alex Artist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    last_message: 'Thanks for subscribing! More content coming soon.',
    timestamp: '2024-02-19T14:30:00',
    unread: true,
    unread_count: 2
  },
  {
    id: '2',
    creator: {
      username: 'sarahcreates',
      display_name: 'Sarah Creates',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
    },
    last_message: 'Hope you enjoyed the latest tutorial!',
    timestamp: '2024-02-19T10:15:00',
    unread: true,
    unread_count: 1
  },
  {
    id: '3',
    creator: {
      username: 'mikephotog',
      display_name: 'Mike Photography',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    last_message: 'New photo series available in premium tier!',
    timestamp: '2024-02-18T16:20:00',
    unread: false,
    unread_count: 0
  }
];

const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'alexartist',
    content: 'Hey! Welcome to my channel. Really excited to have you as a subscriber!',
    timestamp: '2024-02-19T12:00:00',
    type: 'received' as const
  },
  {
    id: '2',
    sender: 'me',
    content: 'Thanks! Love your content so far. Keep up the great work!',
    timestamp: '2024-02-19T12:15:00',
    type: 'sent' as const
  },
  {
    id: '3',
    sender: 'alexartist',
    content: 'Thanks for subscribing! More content coming soon.',
    timestamp: '2024-02-19T14:30:00',
    type: 'received' as const
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
      {/* Mobile View */}
      <div className="lg:hidden">
        {!showMobileChat ? (
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Conversation List */}
            <div className="space-y-0 divide-y divide-border/30">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className="block w-full py-4 hover:bg-accent/5 transition-colors active:bg-accent/10 text-left"
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
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-screen flex flex-col bg-background">
            {/* Mobile Chat Header */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-border/30 bg-card">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.creator.avatar} alt={selectedConversation.creator.display_name} />
                  <AvatarFallback>{selectedConversation.creator.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate text-base">
                    {selectedConversation.creator.display_name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">@{selectedConversation.creator.username}</p>
                </div>
              </div>
            </div>

            {/* Mobile Chat Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'sent' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'sent' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {getTimeAgo(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex-shrink-0 p-4 border-t border-border/30">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
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
            {/* Left Sidebar */}
            <div className="w-80 border-r border-border/30 flex flex-col bg-card">
              <div className="p-4 border-b border-border/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left hover:bg-accent/50 transition-colors border-b border-border/20 ${
                      selectedConversation.id === conversation.id ? 'bg-accent/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.creator.avatar} alt={conversation.creator.display_name} />
                          <AvatarFallback>{conversation.creator.display_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                            {conversation.unread_count}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {conversation.creator.display_name}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(conversation.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Chat Area */}
            <div className="flex-1 flex flex-col bg-background">
              <div className="flex-shrink-0 p-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.creator.avatar} alt={selectedConversation.creator.display_name} />
                    <AvatarFallback>{selectedConversation.creator.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {selectedConversation.creator.display_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">@{selectedConversation.creator.username}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3 rounded-lg ${
                      message.type === 'sent' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'sent' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {getTimeAgo(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex-shrink-0 p-4 border-t border-border/30">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
