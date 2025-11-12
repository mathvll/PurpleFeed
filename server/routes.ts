import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema, insertLikeSchema, insertTrackingSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Posts routes
  app.get("/api/posts", async (_req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const result = insertPostSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const post = await storage.createPost(result.data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Check if user already liked this post
      const existingLike = await storage.getLikeByUserAndPost(userId, req.params.id);
      
      if (existingLike) {
        // Unlike - remove the like
        await storage.deleteLike(existingLike.id);
        res.json({ liked: false, likes: post.likes - 1 });
      } else {
        // Like - add the like
        const result = insertLikeSchema.safeParse({
          userId,
          postId: req.params.id,
        });

        if (!result.success) {
          const validationError = fromZodError(result.error);
          return res.status(400).json({ error: validationError.message });
        }

        await storage.createLike(result.data);
        res.json({ liked: true, likes: post.likes + 1 });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ error: "Failed to toggle like" });
    }
  });

  // Comments routes
  app.get("/api/comments", async (req, res) => {
    try {
      const { postId } = req.query;
      
      if (!postId || typeof postId !== "string") {
        return res.status(400).json({ error: "postId query parameter is required" });
      }

      const comments = await storage.getCommentsByPostId(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const result = insertCommentSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const comment = await storage.createComment(result.data);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Tracking route
  app.post("/api/tracking", async (req, res) => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      
      const result = insertTrackingSchema.safeParse({
        gclid: req.body.gclid,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      });

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const tracking = await storage.createTracking(result.data);
      res.status(201).json(tracking);
    } catch (error) {
      console.error("Error creating tracking:", error);
      res.status(500).json({ error: "Failed to create tracking" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
