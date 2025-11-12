import { 
  type User, 
  type InsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Like,
  type InsertLike,
  type Tracking,
  type InsertTracking
} from "@shared/schema";
import { db } from "./db";
import { users, posts, comments, likes, tracking } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post methods
  getPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePostLikes(id: string, likes: number): Promise<void>;
  updatePostCommentCount(id: string, count: number): Promise<void>;
  
  // Comment methods
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Like methods
  getLikesByPostId(postId: string): Promise<Like[]>;
  getLikeByUserAndPost(userId: string, postId: string): Promise<Like | undefined>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(id: string): Promise<void>;
  
  // Tracking methods
  createTracking(tracking: InsertTracking): Promise<Tracking>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Post methods
  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(posts.createdAt);
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost).returning();
    return post;
  }

  async updatePostLikes(id: string, likesCount: number): Promise<void> {
    await db.update(posts).set({ likes: likesCount }).where(eq(posts.id, id));
  }

  async updatePostCommentCount(id: string, count: number): Promise<void> {
    await db.update(posts).set({ commentCount: count }).where(eq(posts.id, id));
  }

  // Comment methods
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return await db.select().from(comments).where(eq(comments.postId, postId)).orderBy(comments.createdAt);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(insertComment).returning();
    
    const allComments = await this.getCommentsByPostId(insertComment.postId);
    await this.updatePostCommentCount(insertComment.postId, allComments.length);
    
    return comment;
  }

  // Like methods
  async getLikesByPostId(postId: string): Promise<Like[]> {
    return await db.select().from(likes).where(eq(likes.postId, postId));
  }

  async getLikeByUserAndPost(userId: string, postId: string): Promise<Like | undefined> {
    const [like] = await db.select().from(likes).where(
      and(eq(likes.userId, userId), eq(likes.postId, postId))
    );
    return like || undefined;
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const [like] = await db.insert(likes).values(insertLike).returning();
    
    const allLikes = await this.getLikesByPostId(insertLike.postId);
    await this.updatePostLikes(insertLike.postId, allLikes.length);
    
    return like;
  }

  async deleteLike(id: string): Promise<void> {
    const [deletedLike] = await db.delete(likes).where(eq(likes.id, id)).returning();
    
    if (deletedLike) {
      const allLikes = await this.getLikesByPostId(deletedLike.postId);
      await this.updatePostLikes(deletedLike.postId, allLikes.length);
    }
  }

  // Tracking methods
  async createTracking(insertTracking: InsertTracking): Promise<Tracking> {
    const [track] = await db.insert(tracking).values(insertTracking).returning();
    return track;
  }
}

export const storage = new DatabaseStorage();
