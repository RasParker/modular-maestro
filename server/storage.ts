import { users, posts, comments, post_likes, comment_likes, type User, type InsertUser, type Post, type InsertPost, type Comment, type InsertComment } from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

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

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(posts.created_at);
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const [post] = await db
      .update(posts)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post || undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getComments(postId: number): Promise<Comment[]> {
    return await db.select().from(comments).where(eq(comments.post_id, postId)).orderBy(comments.created_at);
  }

  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment || undefined;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return (result.rowCount || 0) > 0;
  }

  async likePost(postId: number, userId: number): Promise<boolean> {
    try {
      await db.insert(post_likes).values({ post_id: postId, user_id: userId });
      await db.update(posts).set({ likes_count: sql`${posts.likes_count} + 1` }).where(eq(posts.id, postId));
      return true;
    } catch {
      return false;
    }
  }

  async unlikePost(postId: number, userId: number): Promise<boolean> {
    try {
      const result = await db.delete(post_likes).where(and(eq(post_likes.post_id, postId), eq(post_likes.user_id, userId)));
      if ((result.rowCount || 0) > 0) {
        await db.update(posts).set({ likes_count: sql`${posts.likes_count} - 1` }).where(eq(posts.id, postId));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async isPostLiked(postId: number, userId: number): Promise<boolean> {
    const [like] = await db.select().from(post_likes).where(and(eq(post_likes.post_id, postId), eq(post_likes.user_id, userId)));
    return !!like;
  }

  async likeComment(commentId: number, userId: number): Promise<boolean> {
    try {
      await db.insert(comment_likes).values({ comment_id: commentId, user_id: userId });
      await db.update(comments).set({ likes_count: sql`${comments.likes_count} + 1` }).where(eq(comments.id, commentId));
      return true;
    } catch {
      return false;
    }
  }

  async unlikeComment(commentId: number, userId: number): Promise<boolean> {
    try {
      const result = await db.delete(comment_likes).where(and(eq(comment_likes.comment_id, commentId), eq(comment_likes.user_id, userId)));
      if ((result.rowCount || 0) > 0) {
        await db.update(comments).set({ likes_count: sql`${comments.likes_count} - 1` }).where(eq(comments.id, commentId));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async isCommentLiked(commentId: number, userId: number): Promise<boolean> {
    const [like] = await db.select().from(comment_likes).where(and(eq(comment_likes.comment_id, commentId), eq(comment_likes.user_id, userId)));
    return !!like;
  }
}

export const storage = new DatabaseStorage();