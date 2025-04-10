import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  coverImage: text("cover_image"),
  isCreator: boolean("is_creator").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  price: doublePrecision("price"),
  status: text("status").notNull().default("minted"), // minted, listed, sold, auctioning
  collection: text("collection"),
  properties: json("properties"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auctions = pgTable("auctions", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").notNull().references(() => nfts.id),
  startingPrice: doublePrecision("starting_price").notNull(),
  currentPrice: doublePrecision("current_price").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  auctionId: integer("auction_id").notNull().references(() => auctions.id),
  bidderId: integer("bidder_id").notNull().references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").notNull().references(() => nfts.id),
  sellerId: integer("seller_id").notNull().references(() => users.id),
  buyerId: integer("buyer_id").notNull().references(() => users.id),
  price: doublePrecision("price").notNull(),
  transactionType: text("transaction_type").notNull(), // direct, auction
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => users.id),
  followingId: integer("following_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").notNull().references(() => nfts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  bio: true,
  profileImage: true,
  coverImage: true,
  isCreator: true,
});

export const insertNftSchema = createInsertSchema(nfts).pick({
  name: true,
  description: true,
  image: true,
  creatorId: true,
  ownerId: true,
  price: true,
  status: true,
  collection: true,
  properties: true,
});

export const insertCollectionSchema = createInsertSchema(collections).pick({
  name: true,
  description: true,
  image: true,
  creatorId: true,
});

export const insertAuctionSchema = createInsertSchema(auctions).pick({
  nftId: true,
  startingPrice: true,
  currentPrice: true,
  endTime: true,
});

export const insertBidSchema = createInsertSchema(bids).pick({
  auctionId: true,
  bidderId: true,
  amount: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  nftId: true,
  sellerId: true,
  buyerId: true,
  price: true,
  transactionType: true,
});

export const insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followingId: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  nftId: true,
  userId: true,
  content: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type NFT = typeof nfts.$inferSelect;
export type InsertNFT = z.infer<typeof insertNftSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type Auction = typeof auctions.$inferSelect;
export type InsertAuction = z.infer<typeof insertAuctionSchema>;

export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
