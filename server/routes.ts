import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { storage } from "./storage";
import { authenticateToken, type AuthenticatedRequest } from "./middleware/auth";
import { insertUserSchema, insertPostSchema, insertCommentSchema, insertSubscriptionTierSchema, insertSubscriptionSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { paymentService } from "./services/paymentService";
import { payoutService } from "./services/payoutService";
import adminRoutes from "./routes/admin";
import paymentRoutes from "./routes/payment";
import payoutRoutes from "./routes/payouts";
import { NotificationService } from "./notification-service";

const PgSession = ConnectPgSimple(session);

// Helper middleware functions
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req.session as any).userRole;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

export function registerRoutes(app: express.Application) {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  // Session configuration
  app.use(session({
    store: new PgSession({
      pool: pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    }
  }));

  // Initialize notification service with socket
  NotificationService.setBroadcastFunction((userId: number, notification: any) => {
    io.to(`user-${userId}`).emit('notification', notification);
  });

  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;
      
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;
      
      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // User routes
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const creators = await storage.getCreators();
      const usersWithoutPasswords = creators.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      console.error('Get creators error:', error);
      res.status(500).json({ message: "Failed to get creators" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.put("/api/users/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.session as any).userId;
      
      // Users can only update their own profile (unless admin)
      if (id !== userId && (req.session as any).userRole !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updates = req.body;
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error('Update user error:', error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error: any) {
      console.error('Get posts error:', error);
      res.status(500).json({ message: "Failed to get posts" });
    }
  });

  app.get("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error: any) {
      console.error('Get post error:', error);
      res.status(500).json({ message: "Failed to get post" });
    }
  });

  app.post("/api/posts", authMiddleware, requireRole(['creator', 'admin']), async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const postData = insertPostSchema.parse({
        ...req.body,
        creator_id: userId,
      });

      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error: any) {
      console.error('Create post error:', error);
      res.status(400).json({ message: error.message || "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      
      const existingPost = await storage.getPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Only post creator or admin can update
      if (existingPost.creator_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updates = req.body;
      const post = await storage.updatePost(id, updates);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error: any) {
      console.error('Update post error:', error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      
      const existingPost = await storage.getPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Only post creator or admin can delete
      if (existingPost.creator_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const deleted = await storage.deletePost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error: any) {
      console.error('Delete post error:', error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Comments routes
  app.get("/api/posts/:id/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getComments(postId);
      res.json(comments);
    } catch (error: any) {
      console.error('Get comments error:', error);
      res.status(500).json({ message: "Failed to get comments" });
    }
  });

  app.post("/api/posts/:id/comments", authMiddleware, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = (req.session as any).userId;
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        post_id: postId,
        user_id: userId,
      });

      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error: any) {
      console.error('Create comment error:', error);
      res.status(400).json({ message: error.message || "Failed to create comment" });
    }
  });

  // Likes routes
  app.post("/api/posts/:id/like", authMiddleware, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = (req.session as any).userId;
      
      const liked = await storage.likePost(postId, userId);
      res.json({ liked });
    } catch (error: any) {
      console.error('Like post error:', error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete("/api/posts/:id/like", authMiddleware, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = (req.session as any).userId;
      
      const unliked = await storage.unlikePost(postId, userId);
      res.json({ unliked });
    } catch (error: any) {
      console.error('Unlike post error:', error);
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  // Subscription tiers routes
  app.get("/api/users/:id/subscription-tiers", async (req: Request, res: Response) => {
    try {
      const creatorId = parseInt(req.params.id);
      const tiers = await storage.getSubscriptionTiers(creatorId);
      res.json(tiers);
    } catch (error: any) {
      console.error('Get subscription tiers error:', error);
      res.status(500).json({ message: "Failed to get subscription tiers" });
    }
  });

  app.post("/api/subscription-tiers", authMiddleware, requireRole(['creator', 'admin']), async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const tierData = insertSubscriptionTierSchema.parse({
        ...req.body,
        creator_id: userId,
      });

      const tier = await storage.createSubscriptionTier(tierData);
      res.json(tier);
    } catch (error: any) {
      console.error('Create subscription tier error:', error);
      res.status(400).json({ message: error.message || "Failed to create subscription tier" });
    }
  });

  // Subscriptions routes
  app.get("/api/subscriptions", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const subscriptions = await storage.getSubscriptions(userId);
      res.json(subscriptions);
    } catch (error: any) {
      console.error('Get subscriptions error:', error);
      res.status(500).json({ message: "Failed to get subscriptions" });
    }
  });

  app.post("/api/subscriptions", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const subscriptionData = insertSubscriptionSchema.parse({
        ...req.body,
        fan_id: userId,
      });

      const subscription = await storage.createSubscription(subscriptionData);
      res.json(subscription);
    } catch (error: any) {
      console.error('Create subscription error:', error);
      res.status(400).json({ message: error.message || "Failed to create subscription" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const notifications = await storage.getNotifications(userId, limit);
      res.json(notifications);
    } catch (error: any) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: "Failed to get notifications" });
    }
  });

  app.get("/api/notifications/unread-count", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error: any) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: "Failed to get unread count" });
    }
  });

  app.patch("/api/notifications/:id/read", authMiddleware, async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(notificationId);
      res.json({ success });
    } catch (error: any) {
      console.error('Mark notification read error:', error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/mark-all-read", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const success = await storage.markAllNotificationsAsRead(userId);
      res.json({ success });
    } catch (error: any) {
      console.error('Mark all notifications read error:', error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Mount sub-routers
  app.use("/api/admin", authMiddleware, requireRole(['admin']), adminRoutes);
  app.use("/api/payment", authMiddleware, paymentRoutes);
  app.use("/api/payouts", authMiddleware, requireRole(['creator', 'admin']), payoutRoutes);

  // WebSocket connection handling
  io.on('connection', (socket: any) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-user-room', (userId: number) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return server;
}