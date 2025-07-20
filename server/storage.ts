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
  conversations,
  messages,
  notifications,
  notification_preferences,
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
  type InsertCreatorPayoutSettings,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Notification,
  type InsertNotification,
  type NotificationPreferences,
  type InsertNotificationPreferences
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
  getSubscriptionTierPerformance(creatorId: number): Promise<any[]>;

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

  // Messaging methods
  getConversations(userId: number): Promise<any[]>;
  getConversation(participant1Id: number, participant2Id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getMessages(conversationId: number): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(conversationId: number, userId: number): Promise<void>;

  // Notification methods
  getNotifications(userId: number, limit?: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(notificationId: number): Promise<boolean>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
  deleteNotification(notificationId: number): Promise<boolean>;

  // Notification preferences methods
  getNotificationPreferences(userId: number): Promise<NotificationPreferences | undefined>;
  createNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences>;
  updateNotificationPreferences(userId: number, updates: Partial<NotificationPreferences>): Promise<NotificationPreferences | undefined>;

    // Creator goals methods
  getCreatorGoals(creatorId: number): Promise<any>;
  saveCreatorGoals(creatorId: number, goals: any): Promise<void>;
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  private inMemoryGoals = new Map<string, any>();

  constructor() {
    // Initialize with your specified goals for creator 1
    this.inMemoryGoals.set('creator_goals_1', {
      subscriberGoal: 30,
      revenueGoal: 1000,
      postsGoal: 15,
      updated_at: new Date()
    });
  }
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
        .values({
          username: insertUser.username,
          email: insertUser.email,
          password: hashedPassword,
          role: insertUser.role,
          display_name: insertUser.display_name,
          bio: insertUser.bio,
          cover_image: insertUser.cover_image,
          social_links: insertUser.social_links || null,
        })
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
      .values({
        creator_id: insertPost.creator_id,
        title: insertPost.title,
        content: insertPost.content,
        media_urls: insertPost.media_urls || [],
        media_type: insertPost.media_type,
        tier: insertPost.tier,
      })
      .returning();
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    try {
      const [post] = await db
        .update(posts)
        .set({ ...updates, updated_at: new Date() })
        .where(eq(posts.id, id))
        .returning();
      return post || undefined;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async deletePost(id: number) {
    try {
      const [deletedPost] = await db.delete(posts)
        .where(eq(posts.id, id))
        .returning();
      return !!deletedPost;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
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

    // Update the comments_count in the posts table
    await db.update(posts).set({ comments_count: sql`${posts.comments_count} + 1` }).where(eq(posts.id, insertComment.post_id));

    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    // First get the comment to know which post to update
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    if (!comment) return false;

    const result = await db.delete(comments).where(eq(comments.id, id));
    const success = (result.rowCount || 0) > 0;

    // Update the comments_count in the posts table if deletion was successful
    if (success) {
      await db.update(posts).set({ comments_count: sql`${posts.comments_count} - 1` }).where(eq(posts.id, comment.post_id));
    }

    return success;
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
        .values({
          creator_id: tier.creator_id,
          name: tier.name,
          description: tier.description,
          price: tier.price,
          currency: tier.currency,
          benefits: tier.benefits || [],
        })
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

  async getSubscriptions(userId: number): Promise<any[]> {
    return await db
      .select({
        id: subscriptions.id,
        status: subscriptions.status,
        current_period_end: subscriptions.ends_at,
        created_at: subscriptions.created_at,
        auto_renew: subscriptions.auto_renew,
        creator: {
          id: users.id,
          username: users.username,
          display_name: users.display_name,
          avatar: users.avatar
        },
        tier: {
          name: subscription_tiers.name,
          price: subscription_tiers.price
        }
      })
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.creator_id, users.id))
      .innerJoin(subscription_tiers, eq(subscriptions.tier_id, subscription_tiers.id))
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

    if (subscription && subscription.status === 'cancelled') {
      // Update creator's subscriber count
      await db
        .update(users)
        .set({ 
          total_subscribers: sql`${users.total_subscribers} - 1`,
          updated_at: new Date()
        })
        .where(eq(users.id, subscription.creator_id));

      return true;
    }
    return false;

    if (subscription) {
      // Update creator's subscriber count
      await db
        .update(users)
        .set({ 
          total_subscribers: sql`${users.total_subscribers} - 1`,
          updated_at: new Date()
        })
        .where(eq(users.id, subscription.creator_id));

      return true;
    }

    return false;
  }

  async getUserSubscriptionToCreator(fanId: number, creatorId: number): Promise<any> {
    const [subscription] = await db
      .select({
        id: subscriptions.id,
        fan_id: subscriptions.fan_id,
        creator_id: subscriptions.creator_id,
        tier_id: subscriptions.tier_id,
        status: subscriptions.status,
        auto_renew: subscriptions.auto_renew,
        started_at: subscriptions.started_at,
        ends_at: subscriptions.ends_at,
        next_billing_date: subscriptions.next_billing_date,
        created_at: subscriptions.created_at,
        updated_at: subscriptions.updated_at,
        tier_name: subscription_tiers.name
      })
      .from(subscriptions)
      .leftJoin(subscription_tiers, eq(subscriptions.tier_id, subscription_tiers.id))
      .where(
        and(
          eq(subscriptions.fan_id, fanId),
          eq(subscriptions.creator_id, creatorId),
          eq(subscriptions.status, 'active')
        )
      );

    return subscription || undefined;
  }

  async createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [newTransaction] = await db
      .insert(payment_transactions)
      .values(transaction)
      .returning();

    return newTransaction;
  }

  async getCreatorSubscribers(creatorId: number): Promise<any[]> {
    try {
      const subscribers = await db
        .select({
          id: subscriptions.id,
          status: subscriptions.status,
          created_at: subscriptions.created_at,
          current_period_end: subscriptions.ends_at,
          auto_renew: subscriptions.auto_renew,
          fan_id: subscriptions.fan_id,
          tier_id: subscriptions.tier_id,
          username: users.username,
          email: users.email,
          avatar: users.avatar,
          display_name: users.display_name,
          tier_name: subscription_tiers.name,
          tier_price: subscription_tiers.price
        })
        .from(subscriptions)
        .innerJoin(users, eq(subscriptions.fan_id, users.id))
        .innerJoin(subscription_tiers, eq(subscriptions.tier_id, subscription_tiers.id))
        .where(and(
          eq(subscriptions.creator_id, creatorId),
          eq(subscriptions.status, 'active')
        ))
        .orderBy(desc(subscriptions.created_at));

      return subscribers;
    } catch (error) {
      console.error('Error in getCreatorSubscribers:', error);
      // Fallback to simple query if join fails
      try {
        const simpleSubscribers = await db
          .select()
          .from(subscriptions)
          .where(and(
            eq(subscriptions.creator_id, creatorId),
            eq(subscriptions.status, 'active')
          ))
          .orderBy(desc(subscriptions.created_at));

        // Manually fetch user and tier data for each subscription
        const enrichedSubscribers = await Promise.all(
          simpleSubscribers.map(async (sub) => {
            const user = await this.getUser(sub.fan_id);
            const tier = await this.getSubscriptionTier(sub.tier_id);
            return {
              ...sub,
              username: user?.username || 'Unknown',
              email: user?.email || 'Unknown',
              avatar: user?.avatar || null,
              display_name: user?.display_name || user?.username || 'Unknown',
              tier_name: tier?.name || 'Unknown',
              tier_price: tier?.price || '0'
            };
          })
        );

        return enrichedSubscribers;
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return [];
      }
    }
  }

  async getSubscriptionTierPerformance(creatorId: number): Promise<any[]> {
    try {
      // Get all subscription tiers for the creator
      const tiers = await db
        .select()
        .from(subscription_tiers)
        .where(and(
          eq(subscription_tiers.creator_id, creatorId),
          eq(subscription_tiers.is_active, true)
        ))
        .orderBy(subscription_tiers.price);

      // Get subscriber counts and revenue for each tier
      const tierPerformance = await Promise.all(
        tiers.map(async (tier) => {
          // Count active subscribers for this tier
          const subscriberCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(subscriptions)
            .where(and(
              eq(subscriptions.creator_id, creatorId),
              eq(subscriptions.tier_id, tier.id),
              eq(subscriptions.status, 'active')
            ));

          const subscriberCount = subscriberCountResult[0]?.count || 0;
          const subscribers = Number(subscriberCount);
          const monthlyRevenue = subscribers * parseFloat(tier.price);

          return {
            name: tier.name,
            price: parseFloat(tier.price),
            subscribers: subscribers,
            revenue: monthlyRevenue,
            tier_id: tier.id
          };
        })
      );

      return tierPerformance;
    } catch (error) {
      console.error('Error getting subscription tier performance:', error);
      return [];
    }
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

  async getPlatformSettings(): Promise<any> {
    // For now, we'll store platform settings in a simple key-value approach
    // In production, you might want a dedicated platform_settings table
    try {
      const result = await db.execute(sql`
        SELECT value FROM platform_settings WHERE key = 'commission_rate'
      `);

      const commissionRate = result.rows[0]?.value as string || '0.05'; // Default 5%

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

    async getCreatorGoals(creatorId: number): Promise<any> {
    try {
      // For now, we'll store goals in a simple in-memory map
      // In production, this would be stored in the database
      const goalsKey = `creator_goals_${creatorId}`;
      const storedGoals = this.inMemoryGoals.get(goalsKey);
      return storedGoals || {
        subscriberGoal: 30,
        revenueGoal: 1000,
        postsGoal: 15
      };
    } catch (error) {
      console.error('Error getting creator goals:', error);
      return {
        subscriberGoal: 30,
        revenueGoal: 1000,
        postsGoal: 15
      };
    }
  }

  async saveCreatorGoals(creatorId: number, goals: any): Promise<void> {
    try {
      // For now, we'll store goals in a simple in-memory map
      // In production, this would be stored in the database
      const goalsKey = `creator_goals_${creatorId}`;
      this.inMemoryGoals.set(goalsKey, {
        ...goals,
        updated_at: new Date()
      });
      console.log(`Saved goals for creator ${creatorId}:`, goals);
    } catch (error) {
      console.error('Error saving creator goals:', error);
      throw error;
    }
  }

  // Messaging methods
  async getConversations(userId: number): Promise<any[]> {
    try {
      const userConversations = await db
        .select()
        .from(conversations)
        .where(
          sql`${conversations.participant_1_id} = ${userId} OR ${conversations.participant_2_id} = ${userId}`
        )
        .orderBy(desc(conversations.updated_at));

      // Manually enrich with user data and message info
      const enrichedConversations = await Promise.all(
        userConversations.map(async (conv) => {
          const otherParticipantId = conv.participant_1_id === userId ? conv.participant_2_id : conv.participant_1_id;
          const otherParticipant = await this.getUser(otherParticipantId);

          // Get last message
          const lastMessage = await db
            .select()
            .from(messages)
            .where(eq(messages.conversation_id, conv.id))
            .orderBy(desc(messages.created_at))
            .limit(1);

          // Get unread count
          const unreadCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(messages)
            .where(
              and(
                eq(messages.conversation_id, conv.id),
                eq(messages.recipient_id, userId),
                eq(messages.read, false)
              )
            );

          return {
            id: conv.id.toString(),
            other_participant_id: otherParticipantId,
            creator: {
              username: otherParticipant?.username || 'Unknown',
              display_name: otherParticipant?.display_name || otherParticipant?.username || 'Unknown',
              avatar: otherParticipant?.avatar || null
            },
            last_message: lastMessage[0]?.content || 'No messages yet',
            timestamp: lastMessage[0]?.created_at || conv.created_at,
            unread: (unreadCount[0]?.count || 0) > 0,
            unread_count: unreadCount[0]?.count || 0
          };
        })
      );

      return enrichedConversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getConversation(participant1Id: number, participant2Id: number): Promise<Conversation | undefined> {
    try {
      const [conversation] = await db
        .select()
        .from(conversations)
        .where(
          sql`(${conversations.participant_1_id} = ${participant1Id} AND ${conversations.participant_2_id} = ${participant2Id}) OR
              (${conversations.participant_1_id} = ${participant2Id} AND ${conversations.participant_2_id} = ${participant1Id})`
        )
        .limit(1);

      return conversation;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return undefined;
    }
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    // Check if conversation already exists
    const existing = await this.getConversation(conversation.participant_1_id, conversation.participant_2_id);
    if (existing) {
      return existing;
    }

    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();

    return newConversation;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    try {
      const messageList = await db
        .select()
        .from(messages)
        .where(eq(messages.conversation_id, conversationId))
        .orderBy(messages.created_at);

      return messageList;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();

    // Update conversation timestamp
    await db
      .update(conversations)
      .set({ updated_at: new Date() })
      .where(eq(conversations.id, message.conversation_id));

    return newMessage;
  }

  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    await db
      .update(messages)
      .set({ read: true })
      .where(
        and(
          eq(messages.conversation_id, conversationId),
          eq(messages.recipient_id, userId),
          eq(messages.read, false)
        )
      );
  }

  // Notification methods
  async getNotifications(userId: number, limit: number = 20): Promise<Notification[]> {
    try {
      const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.user_id, userId))
        .orderBy(desc(notifications.created_at))
        .limit(limit);

      return userNotifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async getUnreadNotificationCount(userId: number): Promise<number> {
    try {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(
          and(
            eq(notifications.user_id, userId),
            eq(notifications.read, false)
          )
        );

      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return 0;
    }
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values({
        user_id: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        action_url: notification.action_url,
        actor_id: notification.actor_id,
        entity_type: notification.entity_type,
        entity_id: notification.entity_id,
        metadata: notification.metadata,
      })
      .returning();

    return newNotification;
  }

  async markNotificationAsRead(notificationId: number): Promise<boolean> {
    try {
      const result = await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, notificationId))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    try {
      await db
        .update(notifications)
        .set({ read: true })
        .where(
          and(
            eq(notifications.user_id, userId),
            eq(notifications.read, false)
          )
        );

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  async deleteNotification(notificationId: number): Promise<boolean> {
    try {
      const result = await db
        .delete(notifications)
        .where(eq(notifications.id, notificationId))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Notification preferences methods
  async getNotificationPreferences(userId: number): Promise<NotificationPreferences | undefined> {
    try {
      const [preferences] = await db
        .select()
        .from(notification_preferences)
        .where(eq(notification_preferences.user_id, userId))
        .limit(1);

      return preferences;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return undefined;
    }
  }

  async createNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const [newPreferences] = await db
      .insert(notification_preferences)
      .values(preferences)
      .returning();

    return newPreferences;
  }

  async updateNotificationPreferences(userId: number, updates: Partial<NotificationPreferences>): Promise<NotificationPreferences | undefined> {
    try {
      const [updatedPreferences] = await db
        .update(notification_preferences)
        .set({ ...updates, updated_at: new Date() })
        .where(eq(notification_preferences.user_id, userId))
        .returning();

      return updatedPreferences;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();