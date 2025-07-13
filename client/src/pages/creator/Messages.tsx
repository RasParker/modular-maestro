import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MESSAGES = [
  {
    id: '1',
    from: 'johndoe',
    subject: 'Love your latest artwork!',
    preview: 'Hey! Just wanted to say how much I love your latest digital art piece...',
    time: '2 hours ago',
    unread: true
  },
  {
    id: '2',
    from: 'sarahsmith',
    subject: 'Request for custom work',
    preview: 'Hi there, I was wondering if you do custom commissions...',
    time: '1 day ago',
    unread: true
  },
  {
    id: '3',
    from: 'mikejones',
    subject: 'Thank you!',
    preview: 'Thank you for the amazing content. Keep up the great work!',
    time: '3 days ago',
    unread: false
  }
];

export const Messages: React.FC = () => {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(MESSAGES[0]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Message sent",
      description: `Message sent to ${selectedMessage.from}`,
    });
    setMessageText('');
  };

  const handleMessageSelect = (message: typeof MESSAGES[0]) => {
    setSelectedMessage(message);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            Messages
          </h1>
          <p className="text-muted-foreground">
            Connect with your subscribers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Inbox</CardTitle>
                <CardDescription>{MESSAGES.filter(m => m.unread).length} unread messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {MESSAGES.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      message.unread ? 'border-primary/50 bg-primary/5' : 'border-border/50'
                    } ${selectedMessage.id === message.id ? 'ring-2 ring-primary/50' : ''}`}
                    onClick={() => handleMessageSelect(message)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{message.from}</span>
                      {message.unread && <Badge variant="default" className="text-xs">New</Badge>}
                    </div>
                    <p className="text-sm font-medium mb-1">{message.subject}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{message.preview}</p>
                    <p className="text-xs text-muted-foreground mt-2">{message.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50 h-full">
              <CardHeader>
                <CardTitle>Conversation with {selectedMessage.from}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 min-h-[400px] max-h-[400px] overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Hey! Just wanted to say how much I love your latest digital art piece. The colors are absolutely stunning!</p>
                      <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-primary p-3 rounded-lg max-w-xs">
                      <p className="text-sm text-primary-foreground">Thank you so much! That means a lot to me. I spent weeks working on getting those color gradients just right.</p>
                      <p className="text-xs text-primary-foreground/70 mt-2">1 hour ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-border/50">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-background text-foreground"
                  />
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
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