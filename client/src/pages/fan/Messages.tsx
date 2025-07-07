import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/shared/Navbar';
import { ConversationList } from '@/components/fan/ConversationList';
import { MessageThread } from '@/components/fan/MessageThread';
import { ArrowLeft, MessageSquare } from 'lucide-react';
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/fan/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            Messages
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Chat with your favorite creators
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 h-[500px] sm:h-[600px]">
          {/* Conversations List */}
          <ConversationList
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectConversation={setSelectedConversation}
            getTimeAgo={getTimeAgo}
          />

          {/* Message Thread */}
          <div className="lg:col-span-2">
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
  );
};
