import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatarUrl: true,
  bio: true,
  walletAddress: true,
});

// Collections table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  bannerUrl: text("banner_url"),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  floorPrice: doublePrecision("floor_price"),
  volume: doublePrecision("volume"),
  itemCount: integer("item_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCollectionSchema = createInsertSchema(collections).pick({
  name: true,
  description: true,
  bannerUrl: true,
  creatorId: true,
  floorPrice: true,
  volume: true,
  itemCount: true,
});

// NFTs table
export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  collectionId: integer("collection_id").references(() => collections.id),
  price: doublePrecision("price"),
  currency: text("currency").default("ETH"),
  isAuction: boolean("is_auction").default(false),
  auctionEndTime: timestamp("auction_end_time"),
  mintTxHash: text("mint_tx_hash"),
  tokenId: text("token_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNftSchema = createInsertSchema(nfts).pick({
  name: true,
  description: true,
  imageUrl: true,
  ownerId: true,
  creatorId: true,
  collectionId: true,
  price: true,
  currency: true,
  isAuction: true,
  auctionEndTime: true,
  mintTxHash: true,
  tokenId: true,
});

// Bids table
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").notNull().references(() => nfts.id),
  bidderId: integer("bidder_id").notNull().references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  currency: text("currency").default("ETH"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBidSchema = createInsertSchema(bids).pick({
  nftId: true,
  bidderId: true,
  amount: true,
  currency: true,
  status: true,
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").notNull().references(() => nfts.id),
  sellerId: integer("seller_id").notNull().references(() => users.id),
  buyerId: integer("buyer_id").notNull().references(() => users.id),
  price: doublePrecision("price").notNull(),
  currency: text("currency").default("ETH"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  nftId: true,
  sellerId: true,
  buyerId: true,
  price: true,
  currency: true,
  txHash: true,
});

// Follows table
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => users.id),
  followedId: integer("followed_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followedId: true,
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").notNull().references(() => nfts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  nftId: true,
  userId: true,
  content: true,
});

// Likes table
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").notNull().references(() => nfts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLikeSchema = createInsertSchema(likes).pick({
  nftId: true,
  userId: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type NFT = typeof nfts.$inferSelect;
export type InsertNFT = z.infer<typeof insertNftSchema>;

export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
