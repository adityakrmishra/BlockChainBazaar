import { 
  users, User, InsertUser, 
  collections, Collection, InsertCollection,
  nfts, NFT, InsertNFT,
  bids, Bid, InsertBid,
  transactions, Transaction, InsertTransaction,
  follows, Follow, InsertFollow,
  comments, Comment, InsertComment,
  likes, Like, InsertLike
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Collection operations
  getCollection(id: number): Promise<Collection | undefined>;
  getCollectionsByCreator(creatorId: number): Promise<Collection[]>;
  getAllCollections(): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  
  // NFT operations
  getNFT(id: number): Promise<NFT | undefined>;
  getNFTsByOwner(ownerId: number): Promise<NFT[]>;
  getNFTsByCreator(creatorId: number): Promise<NFT[]>;
  getNFTsByCollection(collectionId: number): Promise<NFT[]>;
  getAllNFTs(limit?: number, offset?: number): Promise<NFT[]>;
  createNFT(nft: InsertNFT): Promise<NFT>;
  updateNFT(id: number, nft: Partial<InsertNFT>): Promise<NFT | undefined>;
  
  // Bid operations
  getBid(id: number): Promise<Bid | undefined>;
  getBidsByNFT(nftId: number): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBidStatus(id: number, status: string): Promise<Bid | undefined>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Follow operations
  getFollowers(userId: number): Promise<User[]>;
  getFollowing(userId: number): Promise<User[]>;
  isFollowing(followerId: number, followedId: number): Promise<boolean>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followedId: number): Promise<boolean>;
  
  // Comment operations
  getCommentsByNFT(nftId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Like operations
  getLikesByNFT(nftId: number): Promise<Like[]>;
  isLiked(userId: number, nftId: number): Promise<boolean>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(userId: number, nftId: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private collectionsData: Map<number, Collection>;
  private nftsData: Map<number, NFT>;
  private bidsData: Map<number, Bid>;
  private transactionsData: Map<number, Transaction>;
  private followsData: Map<number, Follow>;
  private commentsData: Map<number, Comment>;
  private likesData: Map<number, Like>;
  
  private userIdCounter: number;
  private collectionIdCounter: number;
  private nftIdCounter: number;
  private bidIdCounter: number;
  private transactionIdCounter: number;
  private followIdCounter: number;
  private commentIdCounter: number;
  private likeIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.usersData = new Map();
    this.collectionsData = new Map();
    this.nftsData = new Map();
    this.bidsData = new Map();
    this.transactionsData = new Map();
    this.followsData = new Map();
    this.commentsData = new Map();
    this.likesData = new Map();
    
    this.userIdCounter = 1;
    this.collectionIdCounter = 1;
    this.nftIdCounter = 1;
    this.bidIdCounter = 1;
    this.transactionIdCounter = 1;
    this.followIdCounter = 1;
    this.commentIdCounter = 1;
    this.likeIdCounter = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...userData, 
      id,
      createdAt: now
    };
    this.usersData.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.usersData.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  // Collection operations
  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collectionsData.get(id);
  }

  async getCollectionsByCreator(creatorId: number): Promise<Collection[]> {
    return Array.from(this.collectionsData.values()).filter(
      (collection) => collection.creatorId === creatorId
    );
  }

  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collectionsData.values());
  }

  async createCollection(collectionData: InsertCollection): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const now = new Date();
    const collection: Collection = {
      ...collectionData,
      id,
      createdAt: now
    };
    this.collectionsData.set(id, collection);
    return collection;
  }

  // NFT operations
  async getNFT(id: number): Promise<NFT | undefined> {
    return this.nftsData.get(id);
  }

  async getNFTsByOwner(ownerId: number): Promise<NFT[]> {
    return Array.from(this.nftsData.values()).filter(
      (nft) => nft.ownerId === ownerId
    );
  }

  async getNFTsByCreator(creatorId: number): Promise<NFT[]> {
    return Array.from(this.nftsData.values()).filter(
      (nft) => nft.creatorId === creatorId
    );
  }

  async getNFTsByCollection(collectionId: number): Promise<NFT[]> {
    return Array.from(this.nftsData.values()).filter(
      (nft) => nft.collectionId === collectionId
    );
  }

  async getAllNFTs(limit = 100, offset = 0): Promise<NFT[]> {
    return Array.from(this.nftsData.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async createNFT(nftData: InsertNFT): Promise<NFT> {
    const id = this.nftIdCounter++;
    const now = new Date();
    const nft: NFT = {
      ...nftData,
      id,
      createdAt: now
    };
    this.nftsData.set(id, nft);
    return nft;
  }

  async updateNFT(id: number, nftData: Partial<InsertNFT>): Promise<NFT | undefined> {
    const nft = this.nftsData.get(id);
    if (!nft) return undefined;
    
    const updatedNFT = { ...nft, ...nftData };
    this.nftsData.set(id, updatedNFT);
    return updatedNFT;
  }

  // Bid operations
  async getBid(id: number): Promise<Bid | undefined> {
    return this.bidsData.get(id);
  }

  async getBidsByNFT(nftId: number): Promise<Bid[]> {
    return Array.from(this.bidsData.values())
      .filter((bid) => bid.nftId === nftId)
      .sort((a, b) => b.amount - a.amount);
  }

  async createBid(bidData: InsertBid): Promise<Bid> {
    const id = this.bidIdCounter++;
    const now = new Date();
    const bid: Bid = {
      ...bidData,
      id,
      createdAt: now
    };
    this.bidsData.set(id, bid);
    return bid;
  }

  async updateBidStatus(id: number, status: string): Promise<Bid | undefined> {
    const bid = this.bidsData.get(id);
    if (!bid) return undefined;
    
    const updatedBid = { ...bid, status };
    this.bidsData.set(id, updatedBid);
    return updatedBid;
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactionsData.get(id);
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactionsData.values()).filter(
      (tx) => tx.sellerId === userId || tx.buyerId === userId
    );
  }

  async createTransaction(txData: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const transaction: Transaction = {
      ...txData,
      id,
      createdAt: now
    };
    this.transactionsData.set(id, transaction);
    
    // Update NFT owner
    const nft = this.nftsData.get(txData.nftId);
    if (nft) {
      this.nftsData.set(nft.id, {
        ...nft,
        ownerId: txData.buyerId,
        price: undefined,
        isAuction: false,
        auctionEndTime: undefined
      });
    }
    
    return transaction;
  }

  // Follow operations
  async getFollowers(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.followsData.values())
      .filter((follow) => follow.followedId === userId)
      .map((follow) => follow.followerId);
    
    return followerIds.map(id => this.usersData.get(id)).filter(Boolean) as User[];
  }

  async getFollowing(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.followsData.values())
      .filter((follow) => follow.followerId === userId)
      .map((follow) => follow.followedId);
    
    return followingIds.map(id => this.usersData.get(id)).filter(Boolean) as User[];
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    return Array.from(this.followsData.values()).some(
      (follow) => follow.followerId === followerId && follow.followedId === followedId
    );
  }

  async createFollow(followData: InsertFollow): Promise<Follow> {
    // Check if already following
    const exists = await this.isFollowing(followData.followerId, followData.followedId);
    if (exists) {
      const existing = Array.from(this.followsData.values()).find(
        (follow) => follow.followerId === followData.followerId && follow.followedId === followData.followedId
      );
      return existing as Follow;
    }
    
    const id = this.followIdCounter++;
    const now = new Date();
    const follow: Follow = {
      ...followData,
      id,
      createdAt: now
    };
    this.followsData.set(id, follow);
    return follow;
  }

  async deleteFollow(followerId: number, followedId: number): Promise<boolean> {
    const follow = Array.from(this.followsData.values()).find(
      (follow) => follow.followerId === followerId && follow.followedId === followedId
    );
    
    if (!follow) return false;
    
    return this.followsData.delete(follow.id);
  }

  // Comment operations
  async getCommentsByNFT(nftId: number): Promise<Comment[]> {
    return Array.from(this.commentsData.values())
      .filter((comment) => comment.nftId === nftId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = {
      ...commentData,
      id,
      createdAt: now
    };
    this.commentsData.set(id, comment);
    return comment;
  }

  // Like operations
  async getLikesByNFT(nftId: number): Promise<Like[]> {
    return Array.from(this.likesData.values()).filter(
      (like) => like.nftId === nftId
    );
  }

  async isLiked(userId: number, nftId: number): Promise<boolean> {
    return Array.from(this.likesData.values()).some(
      (like) => like.userId === userId && like.nftId === nftId
    );
  }

  async createLike(likeData: InsertLike): Promise<Like> {
    // Check if already liked
    const exists = await this.isLiked(likeData.userId, likeData.nftId);
    if (exists) {
      const existing = Array.from(this.likesData.values()).find(
        (like) => like.userId === likeData.userId && like.nftId === likeData.nftId
      );
      return existing as Like;
    }
    
    const id = this.likeIdCounter++;
    const now = new Date();
    const like: Like = {
      ...likeData,
      id,
      createdAt: now
    };
    this.likesData.set(id, like);
    return like;
  }

  async deleteLike(userId: number, nftId: number): Promise<boolean> {
    const like = Array.from(this.likesData.values()).find(
      (like) => like.userId === userId && like.nftId === nftId
    );
    
    if (!like) return false;
    
    return this.likesData.delete(like.id);
  }
}

// Create and export storage instance
export const storage = new MemStorage();
