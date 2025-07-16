import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertCommentSchema, insertSubscriptionTierSchema, insertSubscriptionSchema, insertReportSchema, insertCreatorPayoutSettingsSchema } from "@shared/schema";
import { db, pool } from './db';
import { users, posts, comments, post_likes, comment_likes, subscriptions, subscription_tiers, reports, users as usersTable } from '../shared/schema';
import { eq, desc, and, gte, lte, count, sum, sql } from 'drizzle-orm';
import paymentRoutes from './routes/payment';
import payoutRoutes from './routes/payouts';
import adminRoutes from './routes/admin';

// Extend Express session interface
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    user?: any;
  }
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Use memory store for development
  const MemoryStoreSession = MemoryStore(session);
  const sessionStore = new MemoryStoreSession({
    checkPeriod: 86400000, // Prune expired entries every 24h
  });

  // Configure session middleware
  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log('Login attempt received:', { email: req.body?.email });
      const { email, password } = req.body;

      if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Demo users for development
      const DEMO_USERS = [
        {
          id: 1,
          email: 'admin@xclusive.com',
          username: 'admin',
          role: 'admin',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          email: 'creator@example.com',
          username: 'amazingcreator',
          role: 'creator',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 3,
          email: 'fan@example.com',
          username: 'loyalfan',
          role: 'fan',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      // Check demo users first (for development)
      if (password === 'demo123') {
        const demoUser = DEMO_USERS.find(u => u.email === email);
        if (demoUser) {
          console.log('Demo user login successful:', demoUser.email);
          // Set session data
          req.session.userId = demoUser.id;
          req.session.user = demoUser;
          return res.json({ user: demoUser });
        }
      }

      // Try database authentication
      console.log('Attempting database authentication for:', email);
      const user = await storage.getUserByEmail(email);

      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if user is suspended
      if (user.status === 'suspended') {
        console.log('User suspended:', email);
        return res.status(403).json({ 
          error: "Your account has been suspended. Please contact support for assistance.",
          suspended: true 
        });
      }

      const { password: _, ...userWithoutPassword } = user;

      // Set session data
      req.session.userId = user.id;
      req.session.user = userWithoutPassword;

      console.log('Database user login successful:', user.email);
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log('Registration request received:', req.body);

      // Validate input data
      const validatedData = insertUserSchema.parse(req.body);
      console.log('Validated data:', { ...validatedData, password: '[HIDDEN]' });

      // Check if user already exists by email
      try {
        const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
        if (existingUserByEmail) {
          console.log('Email already exists:', validatedData.email);
          return res.status(400).json({ error: "Email already exists" });
        }
      } catch (error) {
        console.log('Email check error (user probably doesn\'t exist):', error);
      }

      // Check if user already exists by username
      try {
        const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
        if (existingUserByUsername) {
          console.log('Username already exists:', validatedData.username);
          return res.status(400).json({ error: "Username already exists" });
        }
      } catch (error) {
        console.log('Username check error (user probably doesn\'t exist):', error);
      }

      // Create the user
      console.log('Creating user...');
      const user = await storage.createUser(validatedData);
      console.log('User created successfully:', user.id);

      if (!user) {
        throw new Error('Failed to create user account');
      }

      const { password: _, ...userWithoutPassword } = user;

      // Set session data
      req.session.userId = user.id;
      req.session.user = userWithoutPassword;

      console.log('Registration successful for user:', user.id);
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Registration error:', error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          return res.status(400).json({ error: "User already exists" });
        }
        if (error.message.includes('validation')) {
          return res.status(400).json({ error: "Invalid input data" });
        }
      }

      res.status(500).json({ 
        error: "Failed to create user account", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // User routes (more specific routes first)
  app.get("/api/users/username/:username", async (req, res) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete user account (this would typically cascade delete related data)
      const deleted = await storage.deleteUser(userId);

      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete account" });
      }

      res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  // Post routes
  // Get all posts for a creator
  app.get("/api/posts", async (req, res) => {
    try {
      // First get all posts
      const allPosts = await db
        .select()
        .from(posts)
        .orderBy(desc(posts.created_at));

      // Then enrich with user data
      const postsWithUsers = await Promise.all(
        allPosts.map(async (post) => {
          const user = await storage.getUser(post.creator_id);
          return {
            ...post,
            username: user?.username || null,
            avatar: user?.avatar || null
          };
        })
      );

      res.json(postsWithUsers);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const user = await storage.getUser(post.creator_id);
      const postWithUser = {
        ...post,
        creator: user ? {
          id: user.id,
          username: user.username,
          avatar: user.avatar
        } : null
      };

      res.json(postWithUser);
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // Create post
  app.post('/api/posts', async (req, res) => {
    try {
      const { creator_id, title, content, media_type, media_urls, tier, status, scheduled_for } = req.body;

      console.log('Creating post with status:', status);
      console.log('Scheduled for:', scheduled_for);

      const postData: any = {
        creator_id,
        title,
        content,
        media_type,
        media_urls,
        tier,
        status: status || 'published',
      };

      // Only add scheduled_for if it's provided and status is scheduled
      if (scheduled_for && status === 'scheduled') {
        postData.scheduled_for = new Date(scheduled_for);
      }

      const newPost = await db.insert(posts).values(postData).returning();

      console.log('Post created successfully with final status:', newPost[0].status);
      console.log('Post scheduled_for:', newPost[0].scheduled_for);
      res.json(newPost[0]);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);

      // Handle date conversion for scheduled_for field
      const updateData = { ...req.body };
      if (updateData.scheduled_for && typeof updateData.scheduled_for === 'string') {
        updateData.scheduled_for = new Date(updateData.scheduled_for);
      }

      const post = await storage.updatePost(postId, updateData);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  // Comment routes
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getComments(postId);

      // Enrich comments with user information and organize replies
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          const user = await storage.getUser(comment.user_id);
          return {
            ...comment,
            user: user ? {
              id: user.id,
              username: user.username,
              avatar: user.avatar
            } : null
          };
        })
      );

      // Organize comments and replies
      const topLevelComments = commentsWithUsers.filter(c => !c.parent_id);
      const repliesMap = new Map();

      commentsWithUsers.filter(c => c.parent_id).forEach(reply => {
        const parentId = reply.parent_id;
        if (!repliesMap.has(parentId)) {
          repliesMap.set(parentId, []);
        }
        repliesMap.get(parentId).push(reply);
      });

      const organizedComments = topLevelComments.map(comment => ({
        ...comment,
        replies: repliesMap.get(comment.id) || []
      }));

      res.json(organizedComments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      console.log('Creating comment with data:', { ...req.body, post_id: postId });

      const validatedData = insertCommentSchema.parse({
        ...req.body,
        user_id: parseInt(req.body.user_id),
        post_id: postId
      });

      const comment = await storage.createComment(validatedData);
      const user = await storage.getUser(comment.user_id);

      const commentWithUser = {
        ...comment,
        user: user ? {
          id: user.id,
          username: user.username,
          avatar: user.avatar
        } : null
      };

      res.json(commentWithUser);
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Like routes
  app.post("/api/posts/:postId/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { userId } = req.body;

      const success = await storage.likePost(postId, userId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to like post" });
    }
  });

  app.delete("/api/posts/:postId/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { userId } = req.body;

      const success = await storage.unlikePost(postId, userId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to unlike post" });
    }
  });

  app.get("/api/posts/:postId/like/:userId", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = parseInt(req.params.userId);

      const liked = await storage.isPostLiked(postId, userId);
      res.json({ liked });
    } catch (error) {
      res.status(500).json({ error: "Failed to check like status" });
    }
  });

  app.post("/api/comments/:commentId/like", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const { userId } = req.body;

      const success = await storage.likeComment(commentId, userId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to like comment" });
    }
  });

  app.delete("/api/comments/:commentId/like", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const { userId } = req.body;

      const success = await storage.unlikeComment(commentId, userId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to unlike comment" });
    }
  });

  app.get("/api/comments/:commentId/like/:userId", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = parseInt(req.params.userId);

      const liked = await storage.isCommentLiked(commentId, userId);
      res.json({ liked });
    } catch (error) {
      res.status(500).json({ error: "Failed to check like status" });
    }
  });

  // Subscription tier routes
  app.get("/api/creators/:creatorId/tiers", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const tiers = await storage.getSubscriptionTiers(creatorId);
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription tiers" });
    }
  });

  // Get subscription tier performance data
  app.get("/api/creator/:creatorId/tier-performance", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const tierPerformance = await storage.getSubscriptionTierPerformance(creatorId);

      // Ensure all numeric fields are properly converted
      const formattedTierPerformance = tierPerformance.map(tier => ({
        ...tier,
        subscribers: Number(tier.subscribers),
        revenue: Number(tier.revenue),
        price: Number(tier.price)
      }));

      console.log('Tier performance data being sent:', formattedTierPerformance);
      res.json(formattedTierPerformance);
    } catch (error) {
      console.error('Error fetching tier performance:', error);
      res.status(500).json({ error: "Failed to fetch tier performance" });
    }
  });

  app.post("/api/creators/:creatorId/tiers", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      console.log('Creating tier for creator:', creatorId, 'with data:', req.body);

      // Process the request data to match schema requirements
      const tierData = {
        ...req.body,
        creator_id: creatorId,
        // Convert benefits array to JSON string if it's an array
        benefits: Array.isArray(req.body.benefits) ? JSON.stringify(req.body.benefits) : req.body.benefits,
        // Set tier_level based on price or name if not provided
        tier_level: req.body.tier_level || 'supporter' // default tier level
      };

      const validatedData = insertSubscriptionTierSchema.parse(tierData);

      const tier = await storage.createSubscriptionTier(validatedData);
      res.json(tier);
    } catch (error) {
      console.error('Create subscription tier error:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create subscription tier" });
      }
    }
  });

  app.put("/api/tiers/:tierId", async (req, res) => {
    try {
      const tierId = parseInt(req.params.tierId);
      const tier = await storage.updateSubscriptionTier(tierId, req.body);

      if (!tier) {
        return res.status(404).json({ error: "Tier not found" });
      }

      res.json(tier);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscription tier" });
    }
  });

  app.delete("/api/tiers/:tierId", async (req, res) => {
    try {
      const tierId = parseInt(req.params.tierId);
      const deleted = await storage.deleteSubscriptionTier(tierId);

      if (!deleted) {
        return res.status(404).json({ error: "Tier not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subscription tier" });
    }
  });

  // Subscription routes
  app.get("/api/users/:userId/subscriptions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const subscriptions = await storage.getSubscriptions(userId);
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  // Check if user is subscribed to specific creator
  app.get("/api/subscriptions/user/:userId/creator/:creatorId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const creatorId = parseInt(req.params.creatorId);

      const subscription = await storage.getUserSubscriptionToCreator(userId, creatorId);
      res.json(subscription || null);
    } catch (error) {
      console.error('Error checking subscription:', error);
      res.status(500).json({ error: "Failed to check subscription status" });
    }
  });

  app.post("/api/subscriptions", async (req, res) => {
    try {
      console.log('Creating subscription with data:', req.body);

      // Convert data types before validation
      const processedData = {
        ...req.body,
        fan_id: parseInt(req.body.fan_id),
        creator_id: parseInt(req.body.creator_id),
        tier_id: parseInt(req.body.tier_id),
        started_at: req.body.started_at ? new Date(req.body.started_at) : new Date(),
        next_billing_date: req.body.next_billing_date ? new Date(req.body.next_billing_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ends_at: req.body.ends_at ? new Date(req.body.ends_at) : null
      };

      // Remove undefined values and handle null properly
      Object.keys(processedData).forEach(key => {
        if (processedData[key] === undefined) {
          delete processedData[key];
        }
      });

      const validatedData = insertSubscriptionSchema.parse(processedData);
      console.log('Validated data:', validatedData);

      // Check if user already has active subscription to this creator
      const existingSubscription = await storage.getUserSubscriptionToCreator(
        validatedData.fan_id,
        validatedData.creator_id
      );

      if (existingSubscription) {
        console.log('User already has subscription:', existingSubscription);
        return res.status(400).json({ error: "Already subscribed to this creator" });
      }

      const subscription = await storage.createSubscription(validatedData);
      console.log('Created subscription:', subscription);
      
      // Update creator's total subscriber count
      try {
        const currentSubscribers = await storage.getCreatorSubscribers(validatedData.creator_id);
        const subscriberCount = currentSubscribers.length;
        await storage.updateUser(validatedData.creator_id, { 
          total_subscribers: subscriberCount 
        });
        console.log(`Updated creator ${validatedData.creator_id} subscriber count to ${subscriberCount}`);
      } catch (error) {
        console.error('Error updating creator subscriber count:', error);
        // Don't fail the subscription creation if count update fails
      }
      
      res.json(subscription);
    } catch (error) {
      console.error('Subscription creation error:', error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  app.put("/api/subscriptions/:subscriptionId", async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.subscriptionId);
      const subscription = await storage.updateSubscription(subscriptionId, req.body);

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  app.get("/api/subscriptions/fan/:fanId", async (req, res) => {
    try {
      const fanId = parseInt(req.params.fanId);
      console.log('Fetching subscriptions for fan ID:', fanId);
      const subscriptions = await storage.getSubscriptions(fanId);
      console.log('Found subscriptions:', subscriptions);
      res.json(subscriptions);
    } catch (error) {
      console.error('Error fetching fan subscriptions:', error);
      console.error('Full error details:', error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  app.delete("/api/subscriptions/:subscriptionId", async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.subscriptionId);
      const cancelled = await storage.cancelSubscription(subscriptionId);

      if (!cancelled) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await db.select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        created_at: usersTable.created_at,
        avatar: usersTable.avatar,
        total_subscribers: usersTable.total_subscribers,
        total_earnings: usersTable.total_earnings
      }).from(usersTable);

      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Admin route - Update user status (suspend/activate)
  app.put("/api/admin/users/:id/status", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { status } = req.body;

      if (!['active', 'suspended'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedUser = await db.update(users)
        .set({ 
          status: status,
          updated_at: new Date()
        })
        .where(eq(users.id, userId))
        .returning();

      if (updatedUser.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser[0];
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Failed to update user status:', error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Creator routes
  app.get("/api/creators", async (req, res) => {
    try {
      // Fetch all users with creator role
      const creators = await storage.getCreators();
      res.json(creators);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch creators" });
    }
  });

  // Creator subscriber routes
  app.get("/api/creators/:creatorId/subscribers", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const recent = req.query.recent === 'true';
      
      let subscribers = await storage.getCreatorSubscribers(creatorId);
      
      if (recent) {
        // Sort by created_at descending for recent subscribers
        subscribers = subscribers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      
      if (limit) {
        subscribers = subscribers.slice(0, limit);
      }
      
      res.json(subscribers);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  // Creator analytics endpoint
  app.get("/api/creator/:creatorId/analytics", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      
      // Get subscriber count
      const subscribers = await storage.getCreatorSubscribers(creatorId);
      const subscriberCount = subscribers.length;
      
      // Calculate monthly earnings from active subscriptions
      const tierPerformance = await storage.getSubscriptionTierPerformance(creatorId);
      const monthlyEarnings = tierPerformance.reduce((total, tier) => total + tier.revenue, 0);
      
      // Get total posts count
      const userPosts = await storage.getPosts();
      const creatorPosts = userPosts.filter(post => post.creator_id === creatorId);
      const postsThisMonth = creatorPosts.filter(post => {
        const postDate = new Date(post.created_at);
        const now = new Date();
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      }).length;
      
      // Calculate total earnings (simplified - using monthly * 12 for demo)
      const totalEarnings = monthlyEarnings * 12;
      
      // Simple growth calculation (mock for now)
      const growthRate = subscriberCount > 0 ? 15.2 : 0; // Placeholder
      const engagementRate = 78; // Placeholder
      
      const analytics = {
        subscribers: subscriberCount,
        monthlyEarnings,
        totalEarnings,
        growthRate,
        engagementRate,
        postsThisMonth
      };
      
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching creator analytics:', error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Creator goals endpoint (simplified)
  app.get("/api/creator/:creatorId/goals", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      
      // Get current metrics
      const subscribers = await storage.getCreatorSubscribers(creatorId);
      const subscriberCount = subscribers.length;
      
      const tierPerformance = await storage.getSubscriptionTierPerformance(creatorId);
      const monthlyRevenue = tierPerformance.reduce((total, tier) => total + tier.revenue, 0);
      
      const userPosts = await storage.getPosts();
      const creatorPosts = userPosts.filter(post => post.creator_id === creatorId);
      const postsThisMonth = creatorPosts.filter(post => {
        const postDate = new Date(post.created_at);
        const now = new Date();
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      }).length;
      
      // Return simple goals with current progress
      const goals = {
        subscriberGoal: 100,
        revenueGoal: 1000,
        postsGoal: 10,
        currentSubscribers: subscriberCount,
        currentRevenue: monthlyRevenue,
        currentPosts: postsThisMonth
      };
      
      res.json(goals);
    } catch (error) {
      console.error('Error fetching creator goals:', error);
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  // File upload routes
  app.post("/api/upload/profile-photo", upload.single('profilePhoto'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const photoUrl = `/uploads/${req.file.filename}`;

      // Update user's avatar in database if user is authenticated
      if (req.session?.userId) {
        try {
          await db.update(users)
            .set({ avatar: photoUrl })
            .where(eq(users.id, req.session.userId));
          console.log(`Updated avatar for user ${req.session.userId}: ${photoUrl}`);
        } catch (dbError) {
          console.error('Failed to update avatar in database:', dbError);
          // Continue with response even if DB update fails
        }
      }

      res.json({ 
        success: true, 
        url: photoUrl,
        message: 'Profile photo uploaded successfully' 
      });
    } catch (error) {
      console.error('Profile photo upload error:', error);
      res.status(500).json({ success: false, message: 'Upload failed' });
    }
  });

  app.post("/api/upload/cover-photo", upload.single('coverPhoto'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const photoUrl = `/uploads/${req.file.filename}`;

      // Update user's cover image in database if user is authenticated
      if (req.session?.userId) {
        try {
          await db.update(users)
            .set({ cover_image: photoUrl })
            .where(eq(users.id, req.session.userId));
          console.log(`Updated cover image for user ${req.session.userId}: ${photoUrl}`);
        } catch (dbError) {
          console.error('Failed to update cover image in database:', dbError);
          // Continue with response even if DB update fails
        }
      }

      res.json({ 
        success: true, 
        url: photoUrl,
        message: 'Cover photo uploaded successfully' 
      });
    } catch (error) {
      console.error('Cover photo upload error:', error);
      res.status(500).json({ success: false, message: 'Upload failed' });
    }
  });

  app.post("/api/upload/post-media", upload.single('media'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Generate the URL for the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({ 
        success: true, 
        url: fileUrl,
        filename: req.file.filename,
        message: "Media uploaded successfully" 
      });
    } catch (error) {
      console.error('Post media upload error:', error);
      res.status(500).json({ error: "Failed to upload media" });
    }
  });

  // Report routes
  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.json(report);
    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  app.get("/api/admin/reports", async (req, res) => {
    try {
      const allReports = await storage.getReports();
      res.json(allReports);
    } catch (error) {
      console.error('Get reports error:', error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.put("/api/admin/reports/:id/status", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      const resolvedBy = req.session?.userId;

      const report = await storage.updateReportStatus(reportId, status, adminNotes, resolvedBy);
      res.json(report);
    } catch (error) {
      console.error('Update report status error:', error);
      res.status(500).json({ error: "Failed to update report status" });
    }
  });

  // Update user profile
  app.put('/api/users/profile', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { display_name, bio } = req.body;

      const updatedUser = await db.update(users)
        .set({ 
          display_name: display_name || null,
          bio: bio || null,
          updated_at: new Date()
        })
        .where(eq(users.id, req.session.userId))
        .returning();

      if (updatedUser.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, user: updatedUser[0] });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Sync profile data to database
  app.post('/api/users/sync-profile', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { displayName, bio, profilePhotoUrl, coverPhotoUrl } = req.body;

      const updateData: any = { updated_at: new Date() };

      if (displayName !== undefined) updateData.display_name = displayName;
      if (bio !== undefined) updateData.bio = bio;
      if (profilePhotoUrl !== undefined) updateData.avatar = profilePhotoUrl;
      if (coverPhotoUrl !== undefined) updateData.cover_image = coverPhotoUrl;

      const updatedUser = await db.update(users)
        .set(updateData)
        .where(eq(users.id, req.session.userId))
        .returning();

      if (updatedUser.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, user: updatedUser[0] });
    } catch (error) {
      console.error('Profile sync error:', error);
      res.status(500).json({ error: 'Failed to sync profile' });
    }
  });

  // Creator payout settings endpoints
  app.get('/api/creators/:id/payout-settings', async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);

      // Ensure user can only access their own settings or if they're admin
      if (!req.session?.userId || (req.session.userId !== creatorId && req.session.user?.role !== 'admin')) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const settings = await storage.getCreatorPayoutSettings(creatorId);
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error('Error fetching payout settings:', error);
      res.status(500).json({ error: 'Failed to fetch payout settings' });
    }
  });

  app.post('/api/creators/:id/payout-settings', async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);

      // Ensure user can only update their own settings
      if (!req.session?.userId || req.session.userId !== creatorId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const validatedData = insertCreatorPayoutSettingsSchema.parse({
        ...req.body,
        creator_id: creatorId
      });

      const settings = await storage.saveCreatorPayoutSettings(validatedData);
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error('Error saving payout settings:', error);
      res.status(500).json({ error: 'Failed to save payout settings' });
    }
  });

  app.put('/api/creators/:id/payout-settings', async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);

      // Ensure user can only update their own settings
      if (!req.session?.userId || req.session.userId !== creatorId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const settings = await storage.updateCreatorPayoutSettings(creatorId, req.body);
      if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      res.json({ success: true, data: settings });
    } catch (error) {
      console.error('Error updating payout settings:', error);
      res.status(500).json({ error: 'Failed to update payout settings' });
    }
  });

  // Payment routes
  app.use('/api/payments', paymentRoutes);
  app.use('/api/payouts', payoutRoutes);
  app.use('/api/admin', adminRoutes);

// Platform settings endpoints
app.get('/api/admin/platform-settings', async (req, res) => {
  try {
    const settings = await storage.getPlatformSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    console.error('Error fetching platform settings:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch platform settings' 
    });
  }
});

app.put('/api/admin/platform-settings', async (req, res) => {
  try {
    const { commission_rate, ...otherSettings } = req.body;

    // Validate commission rate
    if (commission_rate !== undefined) {
      const rate = parseFloat(commission_rate);
      if (isNaN(rate) || rate < 0 || rate > 1) {
        return res.status(400).json({
          success: false,
          message: 'Commission rate must be between 0 and 1 (0% to 100%)'
        });
      }
    }

    await storage.updatePlatformSettings({
      commission_rate: commission_rate ? parseFloat(commission_rate) : 0.05,
      ...otherSettings
    });

    res.json({ 
      success: true, 
      message: 'Platform settings updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating platform settings:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update platform settings' 
    });
  }
});

// Check current commission rate
app.get('/api/admin/commission-rate', async (req, res) => {
  try {
    const settings = await storage.getPlatformSettings();
    const commissionPercentage = (settings.commission_rate * 100).toFixed(1);

    res.json({ 
      success: true, 
      commission_rate_decimal: settings.commission_rate,
      commission_rate_percentage: `${commissionPercentage}%`,
      message: `Current commission rate is ${commissionPercentage}%`
    });
  } catch (error: any) {
    console.error('Error fetching commission rate:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch commission rate' 
    });
  }
});

  const httpServer = createServer(app);
  return httpServer;
}