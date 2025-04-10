import { users, nfts, collections, auctions, bids, transactions, follows, comments, type User, type InsertUser, type NFT, type InsertNFT, type Collection, type InsertCollection, type Auction, type InsertAuction, type Bid, type InsertBid, type Transaction, type InsertTransaction, type Follow, type InsertFollow, type Comment, type InsertComment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // NFT operations
  getNft(id: number): Promise<NFT | undefined>;
  getNftsByCreator(creatorId: number): Promise<NFT[]>;
  getNftsByOwner(ownerId: number): Promise<NFT[]>;
  getNftsByCollection(collection: string): Promise<NFT[]>;
  getAllNfts(): Promise<NFT[]>;
  createNft(nft: InsertNFT): Promise<NFT>;
  updateNft(id: number, nft: Partial<InsertNFT>): Promise<NFT | undefined>;

  // Collection operations
  getCollection(id: number): Promise<Collection | undefined>;
  getCollectionsByCreator(creatorId: number): Promise<Collection[]>;
  getAllCollections(): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;

  // Auction operations
  getAuction(id: number): Promise<Auction | undefined>;
  getAuctionByNft(nftId: number): Promise<Auction | undefined>;
  getAllAuctions(): Promise<Auction[]>;
  createAuction(auction: InsertAuction): Promise<Auction>;
  updateAuction(id: number, auction: Partial<InsertAuction>): Promise<Auction | undefined>;

  // Bid operations
  getBid(id: number): Promise<Bid | undefined>;
  getBidsByAuction(auctionId: number): Promise<Bid[]>;
  getBidsByBidder(bidderId: number): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;

  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByNft(nftId: number): Promise<Transaction[]>;
  getTransactionsBySeller(sellerId: number): Promise<Transaction[]>;
  getTransactionsByBuyer(buyerId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Follow operations
  getFollow(id: number): Promise<Follow | undefined>;
  getFollowersByUser(followingId: number): Promise<Follow[]>;
  getFollowingByUser(followerId: number): Promise<Follow[]>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followingId: number): Promise<boolean>;

  // Comment operations
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsByNft(nftId: number): Promise<Comment[]>;
  getCommentsByUser(userId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private nfts: Map<number, NFT>;
  private collections: Map<number, Collection>;
  private auctions: Map<number, Auction>;
  private bids: Map<number, Bid>;
  private transactions: Map<number, Transaction>;
  private follows: Map<number, Follow>;
  private comments: Map<number, Comment>;
  sessionStore: session.SessionStore;
  private userIdCounter: number;
  private nftIdCounter: number;
  private collectionIdCounter: number;
  private auctionIdCounter: number;
  private bidIdCounter: number;
  private transactionIdCounter: number;
  private followIdCounter: number;
  private commentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.nfts = new Map();
    this.collections = new Map();
    this.auctions = new Map();
    this.bids = new Map();
    this.transactions = new Map();
    this.follows = new Map();
    this.comments = new Map();
    this.userIdCounter = 1;
    this.nftIdCounter = 1;
    this.collectionIdCounter = 1;
    this.auctionIdCounter = 1;
    this.bidIdCounter = 1;
    this.transactionIdCounter = 1;
    this.followIdCounter = 1;
    this.commentIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...userData, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // NFT operations
  async getNft(id: number): Promise<NFT | undefined> {
    return this.nfts.get(id);
  }

  async getNftsByCreator(creatorId: number): Promise<NFT[]> {
    return Array.from(this.nfts.values()).filter(
      (nft) => nft.creatorId === creatorId
    );
  }

  async getNftsByOwner(ownerId: number): Promise<NFT[]> {
    return Array.from(this.nfts.values()).filter(
      (nft) => nft.ownerId === ownerId
    );
  }

  async getNftsByCollection(collection: string): Promise<NFT[]> {
    return Array.from(this.nfts.values()).filter(
      (nft) => nft.collection === collection
    );
  }

  async getAllNfts(): Promise<NFT[]> {
    return Array.from(this.nfts.values());
  }

  async createNft(nftData: InsertNFT): Promise<NFT> {
    const id = this.nftIdCounter++;
    const now = new Date();
    const nft: NFT = { ...nftData, id, createdAt: now };
    this.nfts.set(id, nft);
    return nft;
  }

  async updateNft(id: number, nftData: Partial<InsertNFT>): Promise<NFT | undefined> {
    const nft = await this.getNft(id);
    if (!nft) return undefined;
    
    const updatedNft = { ...nft, ...nftData };
    this.nfts.set(id, updatedNft);
    return updatedNft;
  }

  // Collection operations
  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getCollectionsByCreator(creatorId: number): Promise<Collection[]> {
    return Array.from(this.collections.values()).filter(
      (collection) => collection.creatorId === creatorId
    );
  }

  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async createCollection(collectionData: InsertCollection): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const now = new Date();
    const collection: Collection = { ...collectionData, id, createdAt: now };
    this.collections.set(id, collection);
    return collection;
  }

  // Auction operations
  async getAuction(id: number): Promise<Auction | undefined> {
    return this.auctions.get(id);
  }

  async getAuctionByNft(nftId: number): Promise<Auction | undefined> {
    return Array.from(this.auctions.values()).find(
      (auction) => auction.nftId === nftId
    );
  }

  async getAllAuctions(): Promise<Auction[]> {
    return Array.from(this.auctions.values());
  }

  async createAuction(auctionData: InsertAuction): Promise<Auction> {
    const id = this.auctionIdCounter++;
    const now = new Date();
    const auction: Auction = { ...auctionData, id, createdAt: now };
    this.auctions.set(id, auction);
    return auction;
  }

  async updateAuction(id: number, auctionData: Partial<InsertAuction>): Promise<Auction | undefined> {
    const auction = await this.getAuction(id);
    if (!auction) return undefined;
    
    const updatedAuction = { ...auction, ...auctionData };
    this.auctions.set(id, updatedAuction);
    return updatedAuction;
  }

  // Bid operations
  async getBid(id: number): Promise<Bid | undefined> {
    return this.bids.get(id);
  }

  async getBidsByAuction(auctionId: number): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(
      (bid) => bid.auctionId === auctionId
    );
  }

  async getBidsByBidder(bidderId: number): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(
      (bid) => bid.bidderId === bidderId
    );
  }

  async createBid(bidData: InsertBid): Promise<Bid> {
    const id = this.bidIdCounter++;
    const now = new Date();
    const bid: Bid = { ...bidData, id, createdAt: now };
    this.bids.set(id, bid);
    return bid;
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByNft(nftId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.nftId === nftId
    );
  }

  async getTransactionsBySeller(sellerId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.sellerId === sellerId
    );
  }

  async getTransactionsByBuyer(buyerId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.buyerId === buyerId
    );
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const transaction: Transaction = { ...transactionData, id, createdAt: now };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Follow operations
  async getFollow(id: number): Promise<Follow | undefined> {
    return this.follows.get(id);
  }

  async getFollowersByUser(followingId: number): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(
      (follow) => follow.followingId === followingId
    );
  }

  async getFollowingByUser(followerId: number): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(
      (follow) => follow.followerId === followerId
    );
  }

  async createFollow(followData: InsertFollow): Promise<Follow> {
    // Check if already following
    const existingFollow = Array.from(this.follows.values()).find(
      (follow) => follow.followerId === followData.followerId && follow.followingId === followData.followingId
    );
    
    if (existingFollow) {
      return existingFollow;
    }
    
    const id = this.followIdCounter++;
    const now = new Date();
    const follow: Follow = { ...followData, id, createdAt: now };
    this.follows.set(id, follow);
    return follow;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<boolean> {
    const follow = Array.from(this.follows.values()).find(
      (follow) => follow.followerId === followerId && follow.followingId === followingId
    );
    
    if (follow) {
      return this.follows.delete(follow.id);
    }
    
    return false;
  }

  // Comment operations
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async getCommentsByNft(nftId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.nftId === nftId
    );
  }

  async getCommentsByUser(userId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.userId === userId
    );
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = { ...commentData, id, createdAt: now };
    this.comments.set(id, comment);
    return comment;
  }
}

export const storage = new MemStorage();
