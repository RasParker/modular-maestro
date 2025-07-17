import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MessageSquare, Search, Send, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ConversationList } from '@/components/fan/ConversationList';
import { MessageThread } from '@/components/fan/MessageThread';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Conversation {
  id: string;
  other_participant_id: number;
  creator: {
    username: string;
    display_name: string;
    avatar: string | null;
  };
  last_message: string;
  timestamp: string;
  unread: boolean;
  unread_count: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
}

export const Messages: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/conversations', selectedConversation?.id, 'messages'],
    enabled: !!selectedConversation,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string, recipientId: number }) => {
      const response = await fetch(`/api/conversations/${selectedConversation?.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', selectedConversation?.id, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setNewMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (otherUserId: number) => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId }),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
  });

  // Set initial selected conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      // Check if there's an auto-select conversation ID from chat initiation
      const autoSelectId = sessionStorage.getItem('autoSelectConversationId');
      
      if (autoSelectId) {
        // Find the conversation with the specified ID
        const targetConversation = conversations.find(conv => conv.id === autoSelectId);
        if (targetConversation) {
          setSelectedConversation(targetConversation);
          setShowMobileChat(true); // Auto-open chat on mobile
          sessionStorage.removeItem('autoSelectConversationId'); // Clear after use
          return;
        }
      }
      
      // Default to first conversation if no auto-select
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  const filteredConversations = conversations.filter(conv =>
    conv.creator.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.creator.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Use the other participant's ID as the recipient
    const recipientId = selectedConversation.other_participant_id;
    
    sendMessageMutation.mutate({
      content: newMessage,
      recipientId,
    });
  };

  const handleSelectConversation = (conversation: Conversation) => {
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

            {/* Conversation List - Instagram Style */}
            {conversationsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                    <div className="h-14 w-14 bg-muted rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                          <AvatarImage src={conversation.creator.avatar || undefined} alt={conversation.creator.display_name} />
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
            )}

            {!conversationsLoading && filteredConversations.length === 0 && (
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
              <MessageThread
                creator={selectedConversation.creator}
                messages={messages}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
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
              {selectedConversation ? (
                <MessageThread
                  creator={selectedConversation.creator}
                  messages={messages}
                  newMessage={newMessage}
                  onNewMessageChange={setNewMessage}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};