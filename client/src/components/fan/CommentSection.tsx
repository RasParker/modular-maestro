
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageSquare, Send, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  liked: boolean;
  createdAt: string;
  replies: Comment[];
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  onCommentCountChange: (count: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  initialComments,
  onCommentCountChange
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        id: user?.id || '1',
        username: user?.username || 'current_user',
        avatar: user?.avatar
      },
      content: newComment,
      likes: 0,
      liked: false,
      createdAt: new Date().toISOString(),
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    onCommentCountChange(comments.length + 1);
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: Date.now().toString(),
      user: {
        id: user?.id || '1',
        username: user?.username || 'current_user',
        avatar: user?.avatar
      },
      content: replyContent,
      likes: 0,
      liked: false,
      createdAt: new Date().toISOString(),
      replies: []
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [reply, ...comment.replies] }
        : comment
    ));
    
    setReplyContent('');
    setReplyingTo(null);
    onCommentCountChange(comments.reduce((total, comment) => total + 1 + comment.replies.length, 0) + 1);
    
    toast({
      title: "Reply added",
      description: "Your reply has been posted successfully.",
    });
  };

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      liked: !reply.liked,
                      likes: reply.liked ? reply.likes - 1 : reply.likes + 1
                    }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      ));
    }
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const CommentItem: React.FC<{ 
    comment: Comment; 
    isReply?: boolean; 
    parentId?: string 
  }> = ({ comment, isReply = false, parentId }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-border/30 pl-4' : ''}`}>
      <div className="flex gap-3 mb-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
          <AvatarFallback>{comment.user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.user.username}</span>
              <span className="text-xs text-muted-foreground">{getTimeAgo(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-foreground">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-auto p-1 ${comment.liked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
            >
              <Heart className={`w-3 h-3 mr-1 ${comment.liked ? 'fill-current' : ''}`} />
              {comment.likes > 0 && <span className="text-xs">{comment.likes}</span>}
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
            
            {!isReply && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground"
                onClick={() => toggleReplies(comment.id)}
              >
                <span className="text-xs">
                  {showReplies[comment.id] ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </Button>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
          
          {!isReply && showReplies[comment.id] && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  isReply={true} 
                  parentId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Add Comment */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4 pt-4 border-t border-border/30">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
