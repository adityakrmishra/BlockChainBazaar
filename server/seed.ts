import { storage } from "./storage";
import { InsertUser, InsertNFT, InsertCollection, InsertAuction, InsertBid } from "@shared/schema";
import { randomBytes } from "crypto";
import { promisify } from "util";
import { scrypt } from "crypto";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase() {
  console.log("Seeding database...");
  
  // Check if we already have users
  const existingUsers = await storage.getAllUsers();
  if (existingUsers.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }
  
  // Create Users
  const users: InsertUser[] = [
    {
      username: "john_creator",
      password: await hashPassword("password123"),
      displayName: "John Artist",
      bio: "Digital artist specializing in abstract and futuristic art",
      profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=1&backgroundColor=059ff2",
      coverImage: "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6",
      isCreator: true
    },
    {
      username: "alice_collector",
      password: await hashPassword("password123"),
      displayName: "Alice Collector",
      bio: "NFT enthusiast and collector of digital art",
      profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=2&backgroundColor=ff5733",
      coverImage: "https://images.unsplash.com/photo-1617791160505-6f00504e3519",
      isCreator: false
    },
    {
      username: "bob_trader",
      password: await hashPassword("password123"),
      displayName: "Bob Trader",
      bio: "Trading digital assets and NFTs since 2020",
      profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=3&backgroundColor=33ff57",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
      isCreator: true
    }
  ];
  
  const createdUsers = [];
  for (const userData of users) {
    const user = await storage.createUser(userData);
    createdUsers.push(user);
    console.log(`Created user: ${user.username}`);
  }
  
  // Create Collections
  const collections = [
    {
      name: "Abstract Futures",
      description: "A collection of abstract digital art representing the future",
      image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3",
      creatorId: createdUsers[0].id
    },
    {
      name: "Crypto Punks",
      description: "Unique pixel art characters with proof of ownership",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
      creatorId: createdUsers[2].id
    },
    {
      name: "Digital Landscapes",
      description: "Beautiful digital landscapes from imaginary worlds",
      image: "https://images.unsplash.com/photo-1604871000636-074fa5117945",
      creatorId: createdUsers[0].id
    }
  ];
  
  const createdCollections = [];
  for (const collectionData of collections) {
    const collection = await storage.createCollection(collectionData);
    createdCollections.push(collection);
    console.log(`Created collection: ${collection.name}`);
  }
  
  // Create NFTs
  const nfts: InsertNFT[] = [
    {
      name: "Nebula Dreamer",
      description: "A cosmic journey through digital space",
      image: "https://images.unsplash.com/photo-1604871000636-074fa5117945",
      creatorId: createdUsers[0].id,
      ownerId: createdUsers[0].id,
      price: 1.5,
      status: "listed",
      collection: "Abstract Futures",
      properties: {
        rarity: "Rare",
        size: "Large",
        medium: "Digital",
        colors: "Blue, Purple"
      }
    },
    {
      name: "Cyber Samurai",
      description: "Futuristic warrior in a neon-lit digital world",
      image: "https://images.unsplash.com/photo-1614729375290-b2a429db7cdf",
      creatorId: createdUsers[0].id,
      ownerId: createdUsers[0].id,
      price: 2.2,
      status: "listed",
      collection: "Abstract Futures",
      properties: {
        rarity: "Epic",
        size: "Medium",
        medium: "Digital",
        colors: "Red, Blue, Neon"
      }
    },
    {
      name: "Punk #3457",
      description: "One of a kind pixel art character",
      image: "https://images.unsplash.com/photo-1578321911954-6efb9e68ed6e",
      creatorId: createdUsers[2].id,
      ownerId: createdUsers[2].id,
      price: 3.5,
      status: "listed",
      collection: "Crypto Punks",
      properties: {
        rarity: "Legendary",
        traits: "Mohawk, Glasses, Gold Chain",
        series: "Original",
        generation: "Gen 1"
      }
    },
    {
      name: "Ethereal Valley",
      description: "A peaceful valley in a digital dreamscape",
      image: "https://images.unsplash.com/photo-1618172193763-c511deb635ca",
      creatorId: createdUsers[0].id,
      ownerId: createdUsers[0].id,
      price: null,
      status: "minted",
      collection: "Digital Landscapes",
      properties: {
        rarity: "Uncommon",
        size: "Large",
        medium: "Digital Painting",
        colors: "Green, Blue, Purple"
      }
    },
    {
      name: "Quantum Fragments",
      description: "Abstract visualization of quantum particles",
      image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7",
      creatorId: createdUsers[0].id,
      ownerId: createdUsers[1].id,
      price: 1.8,
      status: "auctioning",
      collection: "Abstract Futures",
      properties: {
        rarity: "Rare",
        size: "Medium",
        medium: "3D Render",
        colors: "Multiple"
      }
    }
  ];
  
  const createdNfts = [];
  for (const nftData of nfts) {
    const nft = await storage.createNft(nftData);
    createdNfts.push(nft);
    console.log(`Created NFT: ${nft.name}`);
  }
  
  // Create Auctions for NFTs with 'auctioning' status
  const auctioningNfts = createdNfts.filter(nft => nft.status === 'auctioning');
  const auctions: InsertAuction[] = auctioningNfts.map(nft => ({
    nftId: nft.id,
    startingPrice: 1.0,
    currentPrice: 1.0,
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }));
  
  const createdAuctions = [];
  for (const auctionData of auctions) {
    const auction = await storage.createAuction(auctionData);
    createdAuctions.push(auction);
    console.log(`Created auction for NFT ID: ${auction.nftId}`);
  }
  
  // Create Bids for auctions
  if (createdAuctions.length > 0) {
    const bids: InsertBid[] = [
      {
        auctionId: createdAuctions[0].id,
        bidderId: createdUsers[1].id,
        amount: 1.2
      },
      {
        auctionId: createdAuctions[0].id,
        bidderId: createdUsers[2].id,
        amount: 1.5
      },
      {
        auctionId: createdAuctions[0].id,
        bidderId: createdUsers[1].id,
        amount: 1.8
      }
    ];
    
    for (const bidData of bids) {
      const bid = await storage.createBid(bidData);
      console.log(`Created bid of ${bid.amount} ETH by user ID: ${bid.bidderId}`);
      
      // Update auction current price
      const auction = await storage.getAuction(bidData.auctionId);
      if (auction) {
        await storage.updateAuction(auction.id, { currentPrice: bidData.amount });
      }
    }
  }
  
  // Create some follows
  await storage.createFollow({ followerId: createdUsers[1].id, followingId: createdUsers[0].id });
  await storage.createFollow({ followerId: createdUsers[2].id, followingId: createdUsers[0].id });
  await storage.createFollow({ followerId: createdUsers[0].id, followingId: createdUsers[2].id });
  
  // Create some comments
  await storage.createComment({ nftId: createdNfts[0].id, userId: createdUsers[1].id, content: "Absolutely gorgeous work! I love the color palette." });
  await storage.createComment({ nftId: createdNfts[0].id, userId: createdUsers[2].id, content: "The detail in this piece is incredible!" });
  await storage.createComment({ nftId: createdNfts[2].id, userId: createdUsers[1].id, content: "This punk is awesome! One of the best in the collection." });
  
  console.log("Database seeding completed successfully!");
}