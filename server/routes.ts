import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import {
  insertCollectionSchema,
  insertNftSchema,
  insertBidSchema,
  insertCommentSchema
} from "@shared/schema";

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "You must be logged in" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // ===== Collection Routes =====
  // Get all collections
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json(collections);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  // Get collection by ID
  app.get("/api/collections/:id", async (req, res) => {
    try {
      const collection = await storage.getCollection(parseInt(req.params.id));
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  // Create collection (authenticated)
  app.post("/api/collections", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const validatedData = insertCollectionSchema.parse({
        ...req.body,
        creatorId: user.id
      });
      const collection = await storage.createCollection(validatedData);
      res.status(201).json(collection);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create collection" });
    }
  });

  // Get collections by creator
  app.get("/api/users/:id/collections", async (req, res) => {
    try {
      const collections = await storage.getCollectionsByCreator(parseInt(req.params.id));
      res.json(collections);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  // ===== NFT Routes =====
  // Get all NFTs with pagination
  app.get("/api/nfts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const nfts = await storage.getAllNFTs(limit, offset);
      res.json(nfts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  // Get NFT by ID
  app.get("/api/nfts/:id", async (req, res) => {
    try {
      const nft = await storage.getNFT(parseInt(req.params.id));
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      res.json(nft);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch NFT" });
    }
  });

  // Create NFT (authenticated)
  app.post("/api/nfts", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const validatedData = insertNftSchema.parse({
        ...req.body,
        creatorId: user.id,
        ownerId: user.id
      });
      const nft = await storage.createNFT(validatedData);
      res.status(201).json(nft);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create NFT" });
    }
  });

  // Update NFT (owner only)
  app.patch("/api/nfts/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const nftId = parseInt(req.params.id);
      const nft = await storage.getNFT(nftId);
      
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      if (nft.ownerId !== user.id) {
        return res.status(403).json({ message: "You can only update your own NFTs" });
      }
      
      const updatedNft = await storage.updateNFT(nftId, req.body);
      res.json(updatedNft);
    } catch (err) {
      res.status(500).json({ message: "Failed to update NFT" });
    }
  });

  // Get NFTs by collection
  app.get("/api/collections/:id/nfts", async (req, res) => {
    try {
      const nfts = await storage.getNFTsByCollection(parseInt(req.params.id));
      res.json(nfts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  // Get NFTs by owner
  app.get("/api/users/:id/owned", async (req, res) => {
    try {
      const nfts = await storage.getNFTsByOwner(parseInt(req.params.id));
      res.json(nfts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  // Get NFTs by creator
  app.get("/api/users/:id/created", async (req, res) => {
    try {
      const nfts = await storage.getNFTsByCreator(parseInt(req.params.id));
      res.json(nfts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  // ===== Bid Routes =====
  // Get bids for an NFT
  app.get("/api/nfts/:id/bids", async (req, res) => {
    try {
      const bids = await storage.getBidsByNFT(parseInt(req.params.id));
      res.json(bids);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch bids" });
    }
  });

  // Create bid (authenticated)
  app.post("/api/nfts/:id/bid", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const nftId = parseInt(req.params.id);
      const nft = await storage.getNFT(nftId);
      
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      if (!nft.isAuction) {
        return res.status(400).json({ message: "This NFT is not up for auction" });
      }
      
      if (nft.ownerId === user.id) {
        return res.status(400).json({ message: "You cannot bid on your own NFT" });
      }
      
      // Check if auction has ended
      if (nft.auctionEndTime && new Date(nft.auctionEndTime) < new Date()) {
        return res.status(400).json({ message: "This auction has ended" });
      }
      
      // Get highest bid
      const bids = await storage.getBidsByNFT(nftId);
      const highestBid = bids.length > 0 ? bids[0].amount : 0;
      
      // Validate bid amount
      if (req.body.amount <= highestBid) {
        return res.status(400).json({ message: "Bid must be higher than current highest bid" });
      }
      
      if (req.body.amount <= (nft.price || 0)) {
        return res.status(400).json({ message: "Bid must be higher than starting price" });
      }
      
      const validatedData = insertBidSchema.parse({
        nftId,
        bidderId: user.id,
        amount: req.body.amount,
        currency: req.body.currency || "ETH",
        status: "active"
      });
      
      const bid = await storage.createBid(validatedData);
      res.status(201).json(bid);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create bid" });
    }
  });

  // ===== Transaction Routes =====
  // Buy NFT directly (authenticated)
  app.post("/api/nfts/:id/buy", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const nftId = parseInt(req.params.id);
      const nft = await storage.getNFT(nftId);
      
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      if (nft.isAuction) {
        return res.status(400).json({ message: "This NFT is up for auction, not for direct sale" });
      }
      
      if (!nft.price) {
        return res.status(400).json({ message: "This NFT is not for sale" });
      }
      
      if (nft.ownerId === user.id) {
        return res.status(400).json({ message: "You cannot buy your own NFT" });
      }
      
      // Create transaction
      const transaction = await storage.createTransaction({
        nftId,
        sellerId: nft.ownerId,
        buyerId: user.id,
        price: nft.price,
        currency: nft.currency || "ETH",
        txHash: req.body.txHash || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });
      
      res.status(201).json(transaction);
    } catch (err) {
      res.status(500).json({ message: "Failed to purchase NFT" });
    }
  });

  // Get user transactions
  app.get("/api/users/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUser(parseInt(req.params.id));
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ===== Follow Routes =====
  // Follow a user (authenticated)
  app.post("/api/users/:id/follow", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const followedId = parseInt(req.params.id);
      
      if (user.id === followedId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }
      
      const targetUser = await storage.getUser(followedId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const follow = await storage.createFollow({
        followerId: user.id,
        followedId
      });
      
      res.status(201).json(follow);
    } catch (err) {
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  // Unfollow a user (authenticated)
  app.delete("/api/users/:id/follow", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const followedId = parseInt(req.params.id);
      
      const result = await storage.deleteFollow(user.id, followedId);
      if (!result) {
        return res.status(404).json({ message: "Not following this user" });
      }
      
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  // Check if following
  app.get("/api/users/:id/following", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const followedId = parseInt(req.params.id);
      
      const isFollowing = await storage.isFollowing(user.id, followedId);
      res.json({ following: isFollowing });
    } catch (err) {
      res.status(500).json({ message: "Failed to check following status" });
    }
  });

  // Get followers
  app.get("/api/users/:id/followers", async (req, res) => {
    try {
      const followers = await storage.getFollowers(parseInt(req.params.id));
      res.json(followers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch followers" });
    }
  });

  // Get following
  app.get("/api/users/:id/followings", async (req, res) => {
    try {
      const following = await storage.getFollowing(parseInt(req.params.id));
      res.json(following);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch following users" });
    }
  });

  // ===== Comment Routes =====
  // Get comments for an NFT
  app.get("/api/nfts/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByNFT(parseInt(req.params.id));
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Add comment (authenticated)
  app.post("/api/nfts/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const nftId = parseInt(req.params.id);
      
      const nft = await storage.getNFT(nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      const validatedData = insertCommentSchema.parse({
        nftId,
        userId: user.id,
        content: req.body.content
      });
      
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // ===== Like Routes =====
  // Like an NFT (authenticated)
  app.post("/api/nfts/:id/like", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const nftId = parseInt(req.params.id);
      
      const nft = await storage.getNFT(nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      const like = await storage.createLike({
        nftId,
        userId: user.id
      });
      
      res.status(201).json(like);
    } catch (err) {
      res.status(500).json({ message: "Failed to like NFT" });
    }
  });

  // Unlike an NFT (authenticated)
  app.delete("/api/nfts/:id/like", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const nftId = parseInt(req.params.id);
      
      const result = await storage.deleteLike(user.id, nftId);
      if (!result) {
        return res.status(404).json({ message: "Not liked" });
      }
      
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to unlike NFT" });
    }
  });

  // Check if liked
  app.get("/api/nfts/:id/liked", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const nftId = parseInt(req.params.id);
      
      const isLiked = await storage.isLiked(user.id, nftId);
      res.json({ liked: isLiked });
    } catch (err) {
      res.status(500).json({ message: "Failed to check like status" });
    }
  });

  // Get likes count
  app.get("/api/nfts/:id/likes", async (req, res) => {
    try {
      const likes = await storage.getLikesByNFT(parseInt(req.params.id));
      res.json({ count: likes.length, likes });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch likes" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
