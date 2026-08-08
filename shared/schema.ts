import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  platform: z.enum(["tiktok", "instagram"]),
  imageUrl: z.string().optional(),
  author: z.string(),
  authorAvatar: z.string().optional(),
  likes: z.number().default(0),
  commentCount: z.number().default(0),
  createdAt: z.date(),
});

export const insertPostSchema = postSchema.omit({
  id: true,
  likes: true,
  commentCount: true,
  createdAt: true,
});

export type Post = z.infer<typeof postSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;

export const commentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  author: z.string(),
  authorAvatar: z.string().optional(),
  content: z.string(),
  createdAt: z.date(),
});

export const insertCommentSchema = commentSchema.omit({
  id: true,
  createdAt: true,
});

export type Comment = z.infer<typeof commentSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const trackingSchema = z.object({
  id: z.string(),
  gclid: z.string(),
  ipAddress: z.string(),
  createdAt: z.date(),
});

export const insertTrackingSchema = trackingSchema.omit({
  id: true,
  createdAt: true,
});

export type Tracking = z.infer<typeof trackingSchema>;
export type InsertTracking = z.infer<typeof insertTrackingSchema>;

