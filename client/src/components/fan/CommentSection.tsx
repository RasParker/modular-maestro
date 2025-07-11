
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageSquare, Send, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [replyContents, setReplyContents] = useState<Record<string, string>>({});
  const [replyInputRefs, setReplyInputRefs] = useState<Record<string, React.RefObject<HTMLTextAreaElement>>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch comments when component mounts
  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (response.ok) {
          const fetchedComments = await response.json();
          const formattedComments = fetchedComments.map((comment: any) => ({
            id: comment.id.toString(),
            user: {
              id: comment.user?.id.toString() || '1',
              username: comment.user?.username || 'Anonymous',
              avatar: comment.user?.avatar
            },
            content: comment.content,
            likes: comment.likes_count || 0,
            liked: false,
            createdAt: comment.created_at,
            replies: comment.replies || []
          }));
          setComments(formattedComments);
          onCommentCountChange(formattedComments.length);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          user_id: user?.id || 1
        })
      });

      if (response.ok) {
        const newCommentData = await response.json();
        const comment: Comment = {
          id: newCommentData.id.toString(),
          user: {
            id: newCommentData.user?.id.toString() || user?.id?.toString() || '1',
            username: newCommentData.user?.username || user?.username || 'current_user',
            avatar: newCommentData.user?.avatar || user?.avatar
          },
          content: newCommentData.content,
          likes: 0,
          liked: false,
          createdAt: newCommentData.created_at,
          replies: []
        };

        setComments(prev => [comment, ...prev]);
        setNewComment('');
        onCommentCountChange(comments.length + 1);
        
        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully.",
        });
      } else {
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
      });
    }
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };

  const handleAddReply = (parentId: string) => {
    const replyContent = replyContents[parentId] || '';
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
    
    setReplyContents(prev => ({ ...prev, [parentId]: '' }));
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

  const getSortedComments = () => {
    const sorted = [...comments];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => b.likes - a.likes);
      default:
        return sorted;
    }
  };

  const displayedComments = showAllComments ? getSortedComments() : getSortedComments().slice(0, 5);

  const CommentItem: React.FC<{ 
    comment: Comment; 
    depth?: number; 
    parentId?: string;
    maxDepth?: number;
  }> = ({ comment, depth = 0, parentId, maxDepth = 3 }) => {
    const isNested = depth > 0;
    const canNest = depth < maxDepth;
    
    return (
      <div className={`${isNested ? 'ml-6 border-l-2 border-primary/20 pl-4 relative' : ''}`}>
        {isNested && (
          <div className="absolute left-0 top-4 w-6 h-0.5 bg-primary/20"></div>
        )}
        
        <div className="flex gap-3 mb-3">
          <Avatar className={`${isNested ? 'h-7 w-7' : 'h-8 w-8'} flex-shrink-0`}>
            <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
            <AvatarFallback className="text-xs">{comment.user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="bg-muted/50 rounded-lg p-3 hover:bg-muted/70 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm truncate">{comment.user.username}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">{getTimeAgo(comment.createdAt)}</span>
                {isNested && (
                  <span className="text-xs text-muted-foreground opacity-60">• reply</span>
                )}
              </div>
              <p className="text-sm text-foreground break-words">{comment.content}</p>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-auto p-1 hover:bg-background/50 ${comment.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                onClick={() => handleLikeComment(comment.id, isNested, parentId)}
              >
                <Heart className={`w-3 h-3 mr-1 ${comment.liked ? 'fill-current' : ''}`} />
                {comment.likes > 0 && <span className="text-xs">{comment.likes}</span>}
              </Button>
              
              {canNest && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-muted-foreground hover:bg-background/50"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  <span className="text-xs">Reply</span>
                </Button>
              )}
              
              {!isNested && comment.replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-muted-foreground hover:bg-background/50"
                  onClick={() => toggleReplies(comment.id)}
                >
                  <span className="text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-primary/40 rounded-full"></span>
                    {showReplies[comment.id] ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </span>
                </Button>
              )}
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-3 flex gap-2 animate-in slide-in-from-top-1 duration-200">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="text-xs">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    key={`reply-${comment.id}`}
                    placeholder={`Reply to ${comment.user.username}...`}
                    value={replyContents[comment.id] || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setReplyContents(prev => ({ ...prev, [comment.id]: newValue }));
                    }}
                    className="min-h-[60px] resize-none border-primary/20 focus:border-primary/40"
                    style={{ 
                      direction: 'ltr', 
                      textAlign: 'left',
                      unicodeBidi: 'normal',
                      writingMode: 'horizontal-tb',
                      textOrientation: 'mixed'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleAddReply(comment.id);
                      }
                      if (e.key === 'Escape') {
                        setReplyingTo(null);
                        setReplyContents(prev => ({ ...prev, [comment.id]: '' }));
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment.id)}
                      disabled={!(replyContents[comment.id] || '').trim()}
                      className="h-8"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContents(prev => ({ ...prev, [comment.id]: '' }));
                      }}
                      className="h-8 text-muted-foreground"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {!isNested && showReplies[comment.id] && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3 animate-in slide-in-from-top-1 duration-300">
                {comment.replies
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((reply) => (
                    <CommentItem 
                      key={reply.id} 
                      comment={reply} 
                      depth={depth + 1}
                      parentId={comment.id}
                      maxDepth={maxDepth}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
                className="min-h-[60px] resize-none border-primary/20 focus:border-primary/40"
                style={{ 
                  direction: 'ltr', 
                  textAlign: 'left',
                  unicodeBidi: 'normal',
                  writingMode: 'horizontal-tb',
                  textOrientation: 'mixed'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleAddComment();
                  }
                }}
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
                className="h-[60px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Comments Header */}
          {comments.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <span className="text-sm font-medium text-muted-foreground">
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                  className="text-xs bg-background border border-border/30 rounded px-2 py-1"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Most liked</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4 pt-4">
              {displayedComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
              
              {comments.length > 5 && !showAllComments && (
                <div className="text-center pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllComments(true)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show {comments.length - 5} more comments
                  </Button>
                </div>
              )}
              
              {showAllComments && comments.length > 5 && (
                <div className="text-center pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllComments(false)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show fewer comments
                  </Button>
                </div>
              )}
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
