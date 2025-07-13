import { 
  users, 
  posts, 
  comments, 
  post_likes, 
  comment_likes,
  subscription_tiers,
  subscriptions,
  payment_transactions,
  creator_payouts,
  creator_payout_settings,
  type User, 
  type InsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type SubscriptionTier,
  type InsertSubscriptionTier,
  type Subscription,
  type InsertSubscription,
  type PaymentTransaction,
  type InsertPaymentTransaction,
  type CreatorPayoutSettings,
  type InsertCreatorPayoutSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getCreators(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  deleteUser(id: number): Promise<boolean>;

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

  // Subscription system methods
  getSubscriptionTiers(creatorId: number): Promise<SubscriptionTier[]>;
  getSubscriptionTier(id: number): Promise<SubscriptionTier | undefined>;
  createSubscriptionTier(tier: InsertSubscriptionTier): Promise<SubscriptionTier>;
  updateSubscriptionTier(id: number, updates: Partial<SubscriptionTier>): Promise<SubscriptionTier | undefined>;
  deleteSubscriptionTier(id: number): Promise<boolean>;

  getSubscriptions(userId: number): Promise<Subscription[]>;
  getSubscription(id: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  cancelSubscription(id: number): Promise<boolean>;

  getUserSubscriptionToCreator(fanId: number, creatorId: number): Promise<Subscription | undefined>;
  getCreatorSubscribers(creatorId: number): Promise<Subscription[]>;

  // Payment methods
  createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction>;
  getPaymentTransactions(subscriptionId: number): Promise<PaymentTransaction[]>;

  // Creator payout settings methods
  getCreatorPayoutSettings(creatorId: number): Promise<CreatorPayoutSettings | undefined>;
  saveCreatorPayoutSettings(settings: InsertCreatorPayoutSettings): Promise<CreatorPayoutSettings>;
  updateCreatorPayoutSettings(creatorId: number, updates: Partial<CreatorPayoutSettings>): Promise<CreatorPayoutSettings | undefined>;

  // Platform settings methods
  getPlatformSettings(): Promise<any>;
  updatePlatformSettings(settings: any): Promise<void>;
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async getCreators(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'creator'));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      console.log('Creating user with data:', { ...insertUser, password: '[HIDDEN]' });
      const hashedPassword = await bcrypt.hash(insertUser.password, 10);

      const [user] = await db
        .insert(users)
        .values([{
          ...insertUser,
          password: hashedPassword,
        }])
        .returning();

      console.log('User created successfully:', { ...user, password: '[HIDDEN]' });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user account');
    }
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      // Delete user's posts first (due to foreign key constraints)
      await db.delete(posts).where(eq(posts.creator_id, id));

      // Delete user's comments
      await db.delete(comments).where(eq(comments.user_id, id));

      // Delete user's likes
      await db.delete(post_likes).where(eq(post_likes.user_id, id));
      await db.delete(comment_likes).where(eq(comment_likes.user_id, id));

      // Delete user's subscriptions
      await db.delete(subscriptions).where(eq(subscriptions.fan_id, id));
      await db.delete(subscriptions).where(eq(subscriptions.creator_id, id));

      // Delete user's subscription tiers
      await db.delete(subscription_tiers).where(eq(subscription_tiers.creator_id, id));

      // Finally delete the user
      const result = await db.delete(users).where(eq(users.id, id));

      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const updateData = { ...updates, updated_at: new Date() };

    // If password is being updated, hash it
    if (updates.password) {
      updateData.password = await bcrypt.hash(updates.password, 10);
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
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
      .values([insertPost])
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

  // Subscription system methods
  async getSubscriptionTiers(creatorId: number): Promise<SubscriptionTier[]> {
    return await db
      .select()
      .from(subscription_tiers)
      .where(and(eq(subscription_tiers.creator_id, creatorId), eq(subscription_tiers.is_active, true)))
      .orderBy(subscription_tiers.price);
  }

  async getSubscriptionTier(id: number): Promise<SubscriptionTier | undefined> {
    const [tier] = await db.select().from(subscription_tiers).where(eq(subscription_tiers.id, id));
    return tier || undefined;
  }

  async createSubscriptionTier(tier: InsertSubscriptionTier): Promise<SubscriptionTier> {
    try {
      console.log('Creating subscription tier with data:', tier);
      const [newTier] = await db
        .insert(subscription_tiers)
        .values([tier])
        .returning();
      console.log('Subscription tier created successfully:', newTier);
      return newTier;
    } catch (error) {
      console.error('Error creating subscription tier:', error);
      throw new Error('Failed to create subscription tier');
    }
  }

  async updateSubscriptionTier(id: number, updates: Partial<SubscriptionTier>): Promise<SubscriptionTier | undefined> {
    const [tier] = await db
      .update(subscription_tiers)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(subscription_tiers.id, id))
      .returning();
    return tier || undefined;
  }

  async deleteSubscriptionTier(id: number): Promise<boolean> {
    const result = await db.delete(subscription_tiers).where(eq(subscription_tiers.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSubscriptions(userId: number): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.fan_id, userId))
      .orderBy(desc(subscriptions.created_at));
  }

  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || undefined;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();

    // Update creator's subscriber count
    await db
      .update(users)
      .set({ 
        total_subscribers: sql`${users.total_subscribers} + 1`,
        updated_at: new Date()
      })
      .where(eq(users.id, subscription.creator_id));

    return newSubscription;
  }

  async updateSubscription(id: number, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || undefined;
  }

  async cancelSubscription(id: number): Promise<boolean> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ 
        status: 'cancelled',
        auto_renew: false,
        updated_at: new Date()
      })
      .where(eq(subscriptions.id, id))
      .returning();

    if (subscription) {
      // Update creator's subscriber count
      await db
        .update(users)
        .set({ 
          total_subscribers: sql`${users.total_subscribers} - 1`,
          updated_at: new Date()
        })
        .where(eq(users.id, subscription.creator_id));
    }

    return !!subscription;
  }

  async getUserSubscriptionToCreator(fanId: number, creatorId: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.fan_id, fanId),
        eq(subscriptions.creator_id, creatorId),
        eq(subscriptions.status, 'active')
      ));
    return subscription || undefined;
  }

  async getCreatorSubscribers(creatorId: number): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.creator_id, creatorId),
        eq(subscriptions.status, 'active')
      ))
      .orderBy(desc(subscriptions.created_at));
  }

  async createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [newTransaction] = await db
      .insert(payment_transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getPaymentTransactions(subscriptionId: number): Promise<PaymentTransaction[]> {
    return await db
      .select()
      .from(payment_transactions)
      .where(eq(payment_transactions.subscription_id, subscriptionId))
      .orderBy(desc(payment_transactions.created_at));
  }

  // Get creator subscription tiers
  async getCreatorTiers(creatorId: number): Promise<SubscriptionTier[]> {
    return db.select().from(subscription_tiers).where(eq(subscription_tiers.creator_id, creatorId));
  }

  // Get specific subscription tier (renamed to avoid duplicate)
  async getSubscriptionTierById(tierId: number): Promise<SubscriptionTier | undefined> {
    const result = await db.select().from(subscription_tiers).where(eq(subscription_tiers.id, tierId));
    return result[0];
  }

  // Payout-related methods
  async createCreatorPayout(data: any): Promise<any> {
    const result = await db.insert(creator_payouts).values(data).returning();
    return result[0];
  }

  async updateCreatorPayoutStatus(payoutId: number, status: string, transactionId?: string): Promise<void> {
    const updateData: any = { status };
    if (status === 'completed') {
      updateData.processed_at = new Date();
    }
    if (transactionId) {
      updateData.transaction_id = transactionId;
    }
    await db.update(creator_payouts).set(updateData).where(eq(creator_payouts.id, payoutId));
  }

  async getCreatorPayouts(creatorId: number, limit: number = 10): Promise<any[]> {
    return await db.select().from(creator_payouts)
      .where(eq(creator_payouts.creator_id, creatorId))
      .orderBy(desc(creator_payouts.created_at))
      .limit(limit);
  }

  async getCreatorPaymentTransactions(creatorId: number, startDate: Date, endDate: Date): Promise<any[]> {
    return db.select({
      id: payment_transactions.id,
      amount: payment_transactions.amount,
      currency: payment_transactions.currency,
      processed_at: payment_transactions.processed_at,
      subscription_id: payment_transactions.subscription_id
    })
    .from(payment_transactions)
    .innerJoin(subscriptions, eq(payment_transactions.subscription_id, subscriptions.id))
    .where(
      and(
        eq(subscriptions.creator_id, creatorId),
        eq(payment_transactions.status, 'completed'),
        gte(payment_transactions.processed_at, startDate),
        lte(payment_transactions.processed_at, endDate)
      )
    );
  }

  async getAllCreators(): Promise<any[]> {
    return db.select().from(users).where(eq(users.role, 'creator'));
  }

  async getCreatorPayoutSettings(creatorId: number): Promise<CreatorPayoutSettings | undefined> {
    const [settings] = await db.select().from(creator_payout_settings)
      .where(eq(creator_payout_settings.creator_id, creatorId));
    return settings || undefined;
  }

  async saveCreatorPayoutSettings(settings: InsertCreatorPayoutSettings): Promise<CreatorPayoutSettings> {
    const [existingSetting] = await db.select().from(creator_payout_settings)
      .where(eq(creator_payout_settings.creator_id, settings.creator_id));

    if (existingSetting) {
      // Update existing settings
      const [updated] = await db.update(creator_payout_settings)
        .set({ ...settings, updated_at: new Date() })
        .where(eq(creator_payout_settings.creator_id, settings.creator_id))
        .returning();
      return updated;
    } else {
      // Create new settings
      const [created] = await db.insert(creator_payout_settings)
        .values(settings)
        .returning();
      return created;
    }
  }

  async updateCreatorPayoutSettings(creatorId: number, updates: Partial<CreatorPayoutSettings>): Promise<CreatorPayoutSettings | undefined> {
    const [updated] = await db.update(creator_payout_settings)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(creator_payout_settings.creator_id, creatorId))
      .returning();
    return updated || undefined;
  }

  async getCreatorPayoutStats(creatorId: number): Promise<any> {
    const payouts = await db.select()
      .from(creator_payouts)
      .where(eq(creator_payouts.creator_id, creatorId));

    let totalPaid = 0;
    let totalPending = 0;
    let completedCount = 0;
    let pendingCount = 0;

    payouts.forEach(payout => {
      const amount = parseFloat(payout.amount);
      if (payout.status === 'completed') {
        totalPaid += amount;
        completedCount++;
      } else if (payout.status === 'pending') {
        totalPending += amount;
        pendingCount++;
      }
    });

    return {
      total_paid: totalPaid,
      total_pending: totalPending,
      completed_count: completedCount,
      pending_count: pendingCount,
      last_payout: payouts.find(p => p.status === 'completed')?.processed_at || null
    };
  }

  async getAllPayoutStats(): Promise<any> {
    const payouts = await db.select().from(creator_payouts);

    let totalPaid = 0;
    let totalPending = 0;
    let completedCount = 0;
    let pendingCount = 0;

    payouts.forEach(payout => {
      const amount = parseFloat(payout.amount);
      if (payout.status === 'completed') {
        totalPaid += amount;
        completedCount++;
      } else if (payout.status === 'pending') {
        totalPending += amount;
        pendingCount++;
      }
    });

    return {
      total_paid: totalPaid,
      total_pending: totalPending,
      completed_count: completedCount,
      pending_count: pendingCount,
      total_creators: await db.select().from(users).where(eq(users.role, 'creator')).then(r => r.length)
    };
  }

  // Platform settings methods
  async getPlatformSettings(): Promise<any> {
    // For now, we'll store platform settings in a simple key-value approach
    // In production, you might want a dedicated platform_settings table
    try {
      const result = await db.execute(sql`
        SELECT value FROM platform_settings WHERE key = 'commission_rate'
      `);

      const commissionRate = result.rows[0]?.value || '0.05'; // Default 5%

      return {
        commission_rate: parseFloat(commissionRate),
        site_name: 'Xclusive',
        site_description: 'Premium content monetization platform',
        maintenance_mode: false,
        new_user_registration: true
      };
    } catch (error) {
      console.error('Error getting platform settings:', error);
      // If table doesn't exist or other error, return defaults
      return {
        commission_rate: 0.05,
        site_name: 'Xclusive',
        site_description: 'Premium content monetization platform',
        maintenance_mode: false,
        new_user_registration: true
      };
    }
  }

  async updatePlatformSettings(settings: any): Promise<void> {
    try {
      // Create table if it doesn't exist
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS platform_settings (
          key VARCHAR(255) PRIMARY KEY,
          value TEXT,
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Update commission rate
      await db.execute(sql`
        INSERT INTO platform_settings (key, value, updated_at)
        VALUES ('commission_rate', ${settings.commission_rate.toString()}, NOW())
        ON CONFLICT (key) DO UPDATE SET 
          value = EXCLUDED.value,
          updated_at = EXCLUDED.updated_at
      `);
    } catch (error) {
      console.error('Error updating platform settings:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();