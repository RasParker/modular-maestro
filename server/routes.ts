import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertCommentSchema, insertSubscriptionTierSchema, insertSubscriptionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // User routes
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
      const validatedData = insertCommentSchema.parse({
        ...req.body,
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
      const validatedData = insertSubscriptionTierSchema.parse({
        ...req.body,
        creator_id: creatorId
      });
      
      const tier = await storage.createSubscriptionTier(validatedData);
      res.json(tier);
    } catch (error) {
      res.status(500).json({ error: "Failed to create subscription tier" });
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

  const httpServer = createServer(app);
  return httpServer;
}
