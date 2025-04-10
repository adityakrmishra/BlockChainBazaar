import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import NftCard from "@/components/nft/nft-card";
import CollectionCard from "@/components/nft/collection-card";
import CreatorCard from "@/components/nft/creator-card";
import { Loader2 } from "lucide-react";
import { NFT, Collection, User } from "@shared/schema";

export default function HomePage() {
  // Fetch trending collections
  const { data: collections, isLoading: isLoadingCollections } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

  // Fetch auctions/NFTs
  const { data: nfts, isLoading: isLoadingNfts } = useQuery<NFT[]>({
    queryKey: ["/api/nfts"],
  });

  // Fetch users for creators section
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const trendingNfts = nfts?.filter(nft => nft.status === "auctioning").slice(0, 4) || [];
  const topCreators = users?.filter(user => user.isCreator).slice(0, 4) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-accent to-background dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto text-center">
          <h1 className="font-poppins font-bold text-4xl md:text-6xl mb-6">
            Discover, collect, and sell<br/>extraordinary NFTs
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Marketplace for non-fungible tokens. Buy, sell, and discover exclusive digital assets.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/marketplace">
              <Button className="bg-secondary hover:bg-primary text-white px-8 py-6 h-auto rounded-lg font-medium transition-colors">
                Explore
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" className="border-2 border-secondary hover:border-primary text-secondary hover:text-primary px-8 py-6 h-auto rounded-lg font-medium transition-colors dark:text-white dark:border-white">
                Create
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center mt-12 space-x-8 md:space-x-16">
            <div className="text-center">
              <p className="font-poppins font-bold text-2xl md:text-3xl">200K+</p>
              <p className="text-gray-600 dark:text-gray-400">Collections</p>
            </div>
            <div className="text-center">
              <p className="font-poppins font-bold text-2xl md:text-3xl">10K+</p>
              <p className="text-gray-600 dark:text-gray-400">Artists</p>
            </div>
            <div className="text-center">
              <p className="font-poppins font-bold text-2xl md:text-3xl">423K+</p>
              <p className="text-gray-600 dark:text-gray-400">NFTs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Collections Section */}
      <section className="py-16 px-4 dark:bg-gray-950">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl">Trending</h2>
            <Link href="/marketplace">
              <a className="text-secondary hover:underline">View All</a>
            </Link>
          </div>
          
          {isLoadingCollections ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-secondary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections && collections.length > 0 ? (
                collections.slice(0, 4).map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))
              ) : (
                <div className="col-span-4 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No collections found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Live Auctions Section */}
      <section className="py-16 px-4 bg-accent/30 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl">Live Auctions</h2>
            <Link href="/marketplace">
              <a className="text-secondary hover:underline">View All</a>
            </Link>
          </div>
          
          {isLoadingNfts ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-secondary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingNfts && trendingNfts.length > 0 ? (
                trendingNfts.map((nft) => (
                  <NftCard key={nft.id} nft={nft} showBidButton />
                ))
              ) : (
                <div className="col-span-4 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No live auctions found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Top Creators Section */}
      <section className="py-16 px-4 dark:bg-gray-950">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl">Top Creators</h2>
            <Link href="/marketplace">
              <a className="text-secondary hover:underline">View All</a>
            </Link>
          </div>
          
          {isLoadingUsers ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-secondary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCreators && topCreators.length > 0 ? (
                topCreators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))
              ) : (
                <div className="col-span-4 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No creators found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-accent/30 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-4">Create and sell your NFTs</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of artists and collectors already using our marketplace to create and trade unique digital assets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-md">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Set up your wallet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect your wallet to our marketplace, we support MetaMask, Coinbase Wallet, and WalletConnect.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-md">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Create your collection</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your work, add a title and description, and customize your NFTs with properties and unlockable content.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-md">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-2.6.9l-.7.7a4 4 0 00-.9 2.6v.2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.1 0 2.1-.4 2.9-1.2.8-.8 1.2-1.7 1.2-2.9 0-1.1-.4-2.1-1.2-2.9C14.1 0 13.1 0 12 0s-2.1.4-2.9 1.2C8.4 2 8 3 8 4.1c0 1.1.4 2.1 1.2 2.9C9.9 7.6 10.9 8 12 8z" />
                </svg>
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">List them for sale</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose between auction, fixed-price listings, and declining-price listings. You control how you want to sell your NFTs.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/create">
              <Button className="bg-secondary hover:bg-primary text-white px-8 py-3 h-auto rounded-lg font-medium transition-colors">
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
