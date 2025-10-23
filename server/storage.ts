import { 
  type User, 
  type InsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Like,
  type InsertLike
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private comments: Map<string, Comment>;
  private likes: Map<string, Like>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.likes = new Map();
    
    // Seed some initial data
    this.seedInitialData();
  }

  private seedInitialData() {
    const post1Id = randomUUID();
    const post2Id = randomUUID();
    const post3Id = randomUUID();
    
    const seedPosts: Post[] = [
      {
        id: post1Id,
        title: "TikTok lança nova funcionalidade de edição de vídeos",
        content: "O TikTok anunciou hoje uma nova ferramenta de edição que permite aos criadores adicionar efeitos especiais diretamente no aplicativo. A funcionalidade promete revolucionar a forma como os vídeos são criados na plataforma, oferecendo mais de 50 novos efeitos e transições.",
        platform: "tiktok",
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
        author: "Maria Silva",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        likes: 42,
        commentCount: 5,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: post2Id,
        title: "Instagram testa modo Stories expandido",
        content: "De acordo com fontes internas, o Instagram está testando uma versão expandida do Stories que permite publicações de até 3 minutos. A mudança visa competir diretamente com o TikTok e outras plataformas de vídeo curto.",
        platform: "instagram",
        imageUrl: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=450&fit=crop",
        author: "João Santos",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        likes: 38,
        commentCount: 3,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        id: post3Id,
        title: "Novos recursos de monetização chegam ao TikTok",
        content: "A plataforma anunciou novos programas de monetização para criadores de conteúdo, incluindo assinaturas pagas e doações ao vivo. Os recursos estarão disponíveis para criadores com mais de 10 mil seguidores.",
        platform: "tiktok",
        imageUrl: "https://images.unsplash.com/photo-1579869847557-1f67382cc158?w=800&h=450&fit=crop",
        author: "Ana Costa",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
        likes: 67,
        commentCount: 8,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    seedPosts.forEach(post => this.posts.set(post.id, post));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Post methods
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      ...insertPost,
      id,
      likes: 0,
      commentCount: 0,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePostLikes(id: string, likes: number): Promise<void> {
    const post = this.posts.get(id);
    if (post) {
      post.likes = likes;
      this.posts.set(id, post);
    }
  }

  async updatePostCommentCount(id: string, count: number): Promise<void> {
    const post = this.posts.get(id);
    if (post) {
      post.commentCount = count;
      this.posts.set(id, post);
    }
  }

  // Comment methods
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    
    // Update post comment count
    const comments = await this.getCommentsByPostId(insertComment.postId);
    await this.updatePostCommentCount(insertComment.postId, comments.length);
    
    return comment;
  }

  // Like methods
  async getLikesByPostId(postId: string): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like => like.postId === postId);
  }

  async getLikeByUserAndPost(userId: string, postId: string): Promise<Like | undefined> {
    return Array.from(this.likes.values()).find(
      like => like.userId === userId && like.postId === postId
    );
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = randomUUID();
    const like: Like = {
      ...insertLike,
      id,
      createdAt: new Date(),
    };
    this.likes.set(id, like);
    
    // Update post likes count
    const likes = await this.getLikesByPostId(insertLike.postId);
    await this.updatePostLikes(insertLike.postId, likes.length);
    
    return like;
  }

  async deleteLike(id: string): Promise<void> {
    const like = this.likes.get(id);
    if (like) {
      this.likes.delete(id);
      
      // Update post likes count
      const likes = await this.getLikesByPostId(like.postId);
      await this.updatePostLikes(like.postId, likes.length);
    }
  }
}

export const storage = new MemStorage();
