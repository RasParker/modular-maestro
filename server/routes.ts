import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertCommentSchema, insertSubscriptionTierSchema, insertSubscriptionSchema } from "@shared/schema";
import { db } from './db';
import { users, posts, comments, likes, subscriptions, subscription_tiers } from '../shared/schema';
import { eq } from 'drizzle-orm';

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
  // Configure session middleware
  app.use(session({
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
      const { email, password } = req.body;

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
          // Set session data
          req.session.userId = demoUser.id;
          req.session.user = demoUser;
          return res.json({ user: demoUser });
        }
      }

      // Try database authentication
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      
      // Set session data
      req.session.userId = user.id;
      req.session.user = userWithoutPassword;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log('Registration request received:', req.body);
      const validatedData = insertUserSchema.parse(req.body);

      // Check if user already exists
      try {
        const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
        if (existingUserByEmail) {
          return res.status(400).json({ error: "Email already exists" });
        }
      } catch (error) {
        console.log('Email check error (user probably doesn\'t exist):', error);
      }

      try {
        const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
        if (existingUserByUsername) {
          return res.status(400).json({ error: "Username already exists" });
        }
      } catch (error) {
        console.log('Username check error (user probably doesn\'t exist):', error);
      }

      const user = await storage.createUser(validatedData);
      const { password: _, ...userWithoutPassword } = user;
      
      // Set session data
      req.session.userId = user.id;
      req.session.user = userWithoutPassword;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: "Registration failed: " + (error instanceof Error ? error.message : 'Unknown error') });
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
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();

      // Enrich posts with user information
      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          const user = await storage.getUser(post.creator_id);
          return {
            ...post,
            creator: user ? {
              id: user.id,
              username: user.username,
              avatar: user.avatar
            } : null
          };
        })
      );

      res.json(postsWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
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

  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.updatePost(postId, req.body);

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

  app.post("/api/creators/:creatorId/tiers", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      console.log('Creating tier for creator:', creatorId, 'with data:', req.body);
      
      const validatedData = insertSubscriptionTierSchema.parse({
        ...req.body,
        creator_id: creatorId
      });

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
      const validatedData = insertSubscriptionSchema.parse(req.body);

      // Check if user already has active subscription to this creator
      const existingSubscription = await storage.getUserSubscriptionToCreator(
        validatedData.fan_id,
        validatedData.creator_id
      );

      if (existingSubscription) {
        return res.status(400).json({ error: "Already subscribed to this creator" });
      }

      const subscription = await storage.createSubscription(validatedData);
      res.json(subscription);
    } catch (error) {
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

  // Admin routes - Get all users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const allUsers = await db.select().from(users);
      
      // Remove password from response
      const usersWithoutPassword = allUsers.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPassword);
    } catch (error) {
      console.error('Failed to fetch all users:', error);
      res.status(500).json({ error: "Failed to fetch users" });
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
      const subscribers = await storage.getCreatorSubscribers(creatorId);
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscribers" });
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

  const httpServer = createServer(app);
  return httpServer;
}