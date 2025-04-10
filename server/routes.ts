import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertNftSchema, insertCollectionSchema, insertAuctionSchema, insertBidSchema, insertTransactionSchema, insertFollowSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // NFT routes
  app.get("/api/nfts", async (req, res) => {
    try {
      const nfts = await storage.getAllNfts();
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching NFTs" });
    }
  });

  app.get("/api/nfts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }

      const nft = await storage.getNft(id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }

      res.json(nft);
    } catch (error) {
      res.status(500).json({ message: "Error fetching NFT" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const validatedData = insertNftSchema.parse(req.body);
      const nft = await storage.createNft(validatedData);
      res.status(201).json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid NFT data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating NFT" });
    }
  });

  app.patch("/api/nfts/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }

      const nft = await storage.getNft(id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }

      // Verify ownership
      if (nft.ownerId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to update this NFT" });
      }

      const validatedData = insertNftSchema.partial().parse(req.body);
      const updatedNft = await storage.updateNft(id, validatedData);
      res.json(updatedNft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid NFT data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating NFT" });
    }
  });

  // Collection routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Error fetching collections" });
    }
  });

  app.get("/api/collections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }

      const collection = await storage.getCollection(id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Error fetching collection" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      res.status(201).json(collection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid collection data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating collection" });
    }
  });

  // Auction routes
  app.get("/api/auctions", async (req, res) => {
    try {
      const auctions = await storage.getAllAuctions();
      res.json(auctions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching auctions" });
    }
  });

  app.get("/api/auctions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid auction ID" });
      }

      const auction = await storage.getAuction(id);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      res.json(auction);
    } catch (error) {
      res.status(500).json({ message: "Error fetching auction" });
    }
  });

  app.post("/api/auctions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const validatedData = insertAuctionSchema.parse(req.body);
      
      // Check if NFT exists and is owned by the user
      const nft = await storage.getNft(validatedData.nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }

      if (nft.ownerId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to auction this NFT" });
      }

      // Update NFT status
      await storage.updateNft(nft.id, { status: "auctioning" });

      const auction = await storage.createAuction(validatedData);
      res.status(201).json(auction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid auction data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating auction" });
    }
  });

  // Bid routes
  app.get("/api/auctions/:auctionId/bids", async (req, res) => {
    try {
      const auctionId = parseInt(req.params.auctionId);
      if (isNaN(auctionId)) {
        return res.status(400).json({ message: "Invalid auction ID" });
      }

      const bids = await storage.getBidsByAuction(auctionId);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bids" });
    }
  });

  app.post("/api/bids", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // Force the bidder to be the logged-in user
      const bidData = { ...req.body, bidderId: req.user!.id };
      const validatedData = insertBidSchema.parse(bidData);
      
      // Check if auction exists
      const auction = await storage.getAuction(validatedData.auctionId);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      // Check if the bid amount is higher than current price
      if (validatedData.amount <= auction.currentPrice) {
        return res.status(400).json({ message: "Bid amount must be higher than current price" });
      }

      // Update auction's current price
      await storage.updateAuction(auction.id, { currentPrice: validatedData.amount });

      const bid = await storage.createBid(validatedData);
      res.status(201).json(bid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating bid" });
    }
  });

  // Transaction routes
  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      
      // Check if NFT exists
      const nft = await storage.getNft(validatedData.nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }

      // Create transaction
      const transaction = await storage.createTransaction(validatedData);
      
      // Update NFT ownership and status
      await storage.updateNft(nft.id, { 
        ownerId: validatedData.buyerId,
        status: "sold" 
      });

      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating transaction" });
    }
  });

  // Buy NFT directly
  app.post("/api/nfts/:id/buy", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const nftId = parseInt(req.params.id);
      if (isNaN(nftId)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }

      const nft = await storage.getNft(nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }

      // Check if NFT is listed for sale
      if (nft.status !== "listed") {
        return res.status(400).json({ message: "NFT is not listed for sale" });
      }

      // Check if buyer has enough funds (simplified for now)
      if (!nft.price) {
        return res.status(400).json({ message: "NFT has no price" });
      }

      // Create transaction
      const transaction = await storage.createTransaction({
        nftId: nft.id,
        sellerId: nft.ownerId,
        buyerId: req.user!.id,
        price: nft.price,
        transactionType: "direct"
      });
      
      // Update NFT ownership and status
      await storage.updateNft(nft.id, { 
        ownerId: req.user!.id,
        status: "sold" 
      });

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error buying NFT" });
    }
  });

  // List NFT for sale
  app.post("/api/nfts/:id/list", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const nftId = parseInt(req.params.id);
      if (isNaN(nftId)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }

      const nft = await storage.getNft(nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }

      // Check if user owns the NFT
      if (nft.ownerId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to list this NFT" });
      }

      // Validate price
      const price = parseFloat(req.body.price);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "Invalid price" });
      }

      // Update NFT status and price
      const updatedNft = await storage.updateNft(nft.id, { 
        status: "listed",
        price: price
      });

      res.json(updatedNft);
    } catch (error) {
      res.status(500).json({ message: "Error listing NFT" });
    }
  });

  // Follow routes
  app.post("/api/users/:id/follow", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const followingId = parseInt(req.params.id);
      if (isNaN(followingId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Check if user exists
      const followingUser = await storage.getUser(followingId);
      if (!followingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if trying to follow self
      if (followingId === req.user!.id) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }

      const follow = await storage.createFollow({
        followerId: req.user!.id,
        followingId
      });

      res.status(201).json(follow);
    } catch (error) {
      res.status(500).json({ message: "Error following user" });
    }
  });

  app.delete("/api/users/:id/follow", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const followingId = parseInt(req.params.id);
      if (isNaN(followingId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const success = await storage.deleteFollow(req.user!.id, followingId);
      
      if (success) {
        res.status(200).json({ message: "Successfully unfollowed" });
      } else {
        res.status(404).json({ message: "Follow relationship not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error unfollowing user" });
    }
  });

  // Get followers
  app.get("/api/users/:id/followers", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const follows = await storage.getFollowersByUser(userId);
      
      // Get all follower users
      const followerPromises = follows.map(follow => storage.getUser(follow.followerId));
      const followers = await Promise.all(followerPromises);
      
      // Remove passwords
      const cleanFollowers = followers.filter(Boolean).map(follower => {
        if (!follower) return null;
        const { password, ...userWithoutPassword } = follower;
        return userWithoutPassword;
      });

      res.json(cleanFollowers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching followers" });
    }
  });

  // Get following
  app.get("/api/users/:id/following", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const follows = await storage.getFollowingByUser(userId);
      
      // Get all following users
      const followingPromises = follows.map(follow => storage.getUser(follow.followingId));
      const following = await Promise.all(followingPromises);
      
      // Remove passwords
      const cleanFollowing = following.filter(Boolean).map(user => {
        if (!user) return null;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json(cleanFollowing);
    } catch (error) {
      res.status(500).json({ message: "Error fetching following" });
    }
  });

  // Comment routes
  app.get("/api/nfts/:id/comments", async (req, res) => {
    try {
      const nftId = parseInt(req.params.id);
      if (isNaN(nftId)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }

      const comments = await storage.getCommentsByNft(nftId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // Force the user ID to be the logged-in user
      const commentData = { ...req.body, userId: req.user!.id };
      const validatedData = insertCommentSchema.parse(commentData);
      
      // Check if NFT exists
      const nft = await storage.getNft(validatedData.nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }

      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating comment" });
    }
  });

  // User profile routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  app.get("/api/users/:id/nfts", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const nfts = await storage.getNftsByOwner(userId);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user's NFTs" });
    }
  });

  app.get("/api/users/:id/created", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const nfts = await storage.getNftsByCreator(userId);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user's created NFTs" });
    }
  });

  app.get("/api/users/:id/collections", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const collections = await storage.getCollectionsByCreator(userId);
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user's collections" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
