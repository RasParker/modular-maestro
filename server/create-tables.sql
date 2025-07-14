-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'fan',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    bio TEXT,
    profile_picture TEXT,
    cover_photo TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    subscriber_count INTEGER DEFAULT 0,
    total_earnings REAL DEFAULT 0.0,
    monthly_earnings REAL DEFAULT 0.0,
    payout_method TEXT,
    payout_details TEXT,
    social_links TEXT,
    notification_settings TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_customer_id TEXT,
    stripe_account_id TEXT
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT,
    tier_required TEXT NOT NULL DEFAULT 'public',
    is_published BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id)
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(comment_id, user_id)
);

-- Create subscription_tiers table
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
);

-- Create subscriptions table
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
);

-- Create payment_transactions table
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
);

-- Create creator_payouts table
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
);

-- Create creator_payout_settings table
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
);

-- Create reports table
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
);