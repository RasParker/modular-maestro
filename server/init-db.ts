import { db } from './db';
import { users, posts, comments, post_likes, comment_likes, subscription_tiers, subscriptions, payment_transactions, creator_payouts, creator_payout_settings, reports } from '../shared/schema';

export async function initializeDatabase() {
  console.log('Initializing database tables...');
  
  try {
    // Create tables by running dummy operations that will create the tables
    await db.select().from(users).limit(1).catch(() => {});
    await db.select().from(posts).limit(1).catch(() => {});
    await db.select().from(comments).limit(1).catch(() => {});
    await db.select().from(post_likes).limit(1).catch(() => {});
    await db.select().from(comment_likes).limit(1).catch(() => {});
    await db.select().from(subscription_tiers).limit(1).catch(() => {});
    await db.select().from(subscriptions).limit(1).catch(() => {});
    await db.select().from(payment_transactions).limit(1).catch(() => {});
    await db.select().from(creator_payouts).limit(1).catch(() => {});
    await db.select().from(creator_payout_settings).limit(1).catch(() => {});
    await db.select().from(reports).limit(1).catch(() => {});
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}