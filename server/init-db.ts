import { db } from './db';

export async function initializeDatabase() {
  console.log('Initializing database tables...');
  
  try {
    // Execute SQL statements directly to create tables
    const database = (db as any).$client;
    
    // Create users table
    database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        role TEXT NOT NULL DEFAULT 'fan',
        status TEXT NOT NULL DEFAULT 'active',
        display_name TEXT,
        bio TEXT,
        cover_image TEXT,
        social_links TEXT,
        verified BOOLEAN DEFAULT FALSE,
        total_subscribers INTEGER DEFAULT 0,
        total_earnings REAL DEFAULT 0.0,
        commission_rate REAL DEFAULT 0.15,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create posts table
    database.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        media_type TEXT NOT NULL DEFAULT 'text',
        media_urls TEXT NOT NULL DEFAULT '[]',
        tier TEXT NOT NULL DEFAULT 'public',
        status TEXT NOT NULL DEFAULT 'published',
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create other essential tables
    database.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        parent_id INTEGER,
        content TEXT NOT NULL,
        likes_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
      )
    `);
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(post_id, user_id)
      )
    `);
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS comment_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comment_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(comment_id, user_id)
      )
    `);
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS subscription_tiers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        currency TEXT DEFAULT 'GHS',
        tier_level TEXT NOT NULL,
        benefits TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fan_id INTEGER NOT NULL,
        creator_id INTEGER NOT NULL,
        tier_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        current_period_start DATETIME NOT NULL,
        current_period_end DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        auto_renew BOOLEAN DEFAULT TRUE,
        stripe_subscription_id TEXT,
        FOREIGN KEY (fan_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tier_id) REFERENCES subscription_tiers(id) ON DELETE CASCADE
      )
    `);
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscription_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'GHS',
        status TEXT NOT NULL,
        stripe_payment_intent_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        processed_at DATETIME,
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
      )
    `);
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS creator_payouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'GHS',
        status TEXT NOT NULL DEFAULT 'pending',
        stripe_transfer_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        processed_at DATETIME,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS creator_payout_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_id INTEGER NOT NULL,
        payout_method TEXT NOT NULL,
        payout_details TEXT NOT NULL,
        minimum_payout_amount REAL DEFAULT 50.0,
        auto_payout_enabled BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporter_id INTEGER NOT NULL,
        reported_user_id INTEGER,
        reported_post_id INTEGER,
        reported_comment_id INTEGER,
        type TEXT NOT NULL,
        reason TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reported_post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (reported_comment_id) REFERENCES comments(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}