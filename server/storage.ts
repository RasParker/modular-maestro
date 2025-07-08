import { 
  users, posts, comments, comment_likes, post_likes,
  type User, type InsertUser, type Post, type InsertPost, 
  type Comment, type InsertComment 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post methods
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Comment methods
  getComments(postId: number): Promise<Comment[]>;
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
  
  // Like methods
  likePost(postId: number, userId: number): Promise<boolean>;
  unlikePost(postId: number, userId: number): Promise<boolean>;
  isPostLiked(postId: number, userId: number): Promise<boolean>;
  likeComment(commentId: number, userId: number): Promise<boolean>;
  unlikeComment(commentId: number, userId: number): Promise<boolean>;
  isCommentLiked(commentId: number, userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private postLikes: Map<string, boolean>; // key: `${postId}-${userId}`
  private commentLikes: Map<string, boolean>; // key: `${commentId}-${userId}`
  private currentUserId: number;
  private currentPostId: number;
  private currentCommentId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.postLikes = new Map();
    this.commentLikes = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentCommentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed users
    const mockUsers = [
      { id: 1, username: "artisticmia", email: "mia@example.com", password: "password", role: "creator", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face", created_at: new Date(), updated_at: new Date() },
      { id: 2, username: "fitnessking", email: "king@example.com", password: "password", role: "creator", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", created_at: new Date(), updated_at: new Date() },
      { id: 3, username: "artlover123", email: "lover@example.com", password: "password", role: "fan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", created_at: new Date(), updated_at: new Date() },
      { id: 4, username: "testuser", email: "test@example.com", password: "password", role: "fan", avatar: null, created_at: new Date(), updated_at: new Date() }
    ];

    mockUsers.forEach(user => {
      this.users.set(user.id, user);
    });
    this.currentUserId = 5;

    // Seed posts
    const mockPosts = [
      { id: 1, creator_id: 1, title: "New Digital Art Collection", content: "Just finished my latest series!", media_urls: [], media_type: "image", tier: "fan", likes_count: 142, comments_count: 5, created_at: new Date(), updated_at: new Date() },
      { id: 2, creator_id: 2, title: "Morning Workout Routine", content: "Starting the week strong!", media_urls: [], media_type: "video", tier: "supporter", likes_count: 89, comments_count: 3, created_at: new Date(), updated_at: new Date() }
    ];

    mockPosts.forEach(post => {
      this.posts.set(post.id, post);
    });
    this.currentPostId = 3;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      avatar: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Post methods
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = {
      ...insertPost,
      id,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates, updated_at: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Comment methods
  async getComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.post_id === postId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      likes_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.comments.set(id, comment);
    
    // Update post comment count
    const post = this.posts.get(insertComment.post_id);
    if (post) {
      this.posts.set(insertComment.post_id, {
        ...post,
        comments_count: post.comments_count + 1
      });
    }
    
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = this.comments.get(id);
    if (!comment) return false;
    
    // Update post comment count
    const post = this.posts.get(comment.post_id);
    if (post) {
      this.posts.set(comment.post_id, {
        ...post,
        comments_count: Math.max(0, post.comments_count - 1)
      });
    }
    
    return this.comments.delete(id);
  }

  // Like methods
  async likePost(postId: number, userId: number): Promise<boolean> {
    const key = `${postId}-${userId}`;
    if (this.postLikes.has(key)) return false;
    
    this.postLikes.set(key, true);
    
    // Update post like count
    const post = this.posts.get(postId);
    if (post) {
      this.posts.set(postId, {
        ...post,
        likes_count: post.likes_count + 1
      });
    }
    
    return true;
  }

  async unlikePost(postId: number, userId: number): Promise<boolean> {
    const key = `${postId}-${userId}`;
    if (!this.postLikes.has(key)) return false;
    
    this.postLikes.delete(key);
    
    // Update post like count
    const post = this.posts.get(postId);
    if (post) {
      this.posts.set(postId, {
        ...post,
        likes_count: Math.max(0, post.likes_count - 1)
      });
    }
    
    return true;
  }

  async isPostLiked(postId: number, userId: number): Promise<boolean> {
    const key = `${postId}-${userId}`;
    return this.postLikes.has(key);
  }

  async likeComment(commentId: number, userId: number): Promise<boolean> {
    const key = `${commentId}-${userId}`;
    if (this.commentLikes.has(key)) return false;
    
    this.commentLikes.set(key, true);
    
    // Update comment like count
    const comment = this.comments.get(commentId);
    if (comment) {
      this.comments.set(commentId, {
        ...comment,
        likes_count: comment.likes_count + 1
      });
    }
    
    return true;
  }

  async unlikeComment(commentId: number, userId: number): Promise<boolean> {
    const key = `${commentId}-${userId}`;
    if (!this.commentLikes.has(key)) return false;
    
    this.commentLikes.delete(key);
    
    // Update comment like count
    const comment = this.comments.get(commentId);
    if (comment) {
      this.comments.set(commentId, {
        ...comment,
        likes_count: Math.max(0, comment.likes_count - 1)
      });
    }
    
    return true;
  }

  async isCommentLiked(commentId: number, userId: number): Promise<boolean> {
    const key = `${commentId}-${userId}`;
    return this.commentLikes.has(key);
  }
}

export const storage = new MemStorage();
