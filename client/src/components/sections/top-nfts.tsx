import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NFTCard } from "@/components/ui/nft-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { NFT } from "@shared/schema";
import { Loader2 } from "lucide-react";

type Category = "all" | "art" | "gaming" | "music";

export default function TopNFTs() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Fetch NFTs from the API
  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ['/api/nfts']
  });
  
  // Filter NFTs based on selected category
  const filteredNFTs = (nfts || []).filter((nft: NFT) => {
    if (activeCategory === "all") return true;
    
    // In a real app, you would filter based on actual NFT category data
    // For this demo, we'll use a simplified approach based on collectionId
    switch (activeCategory) {
      case "art":
        return nft.collectionId === 1;
      case "gaming":
        return nft.collectionId === 2;
      case "music":
        return nft.collectionId === 3;
      default:
        return true;
    }
  });
  
  // Handle load more
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-sans">Top NFTs</h2>
          
          <div className="flex border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <Button
              className={activeCategory === "all" ? "bg-secondary text-white" : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"}
              onClick={() => setActiveCategory("all")}
            >
              All
            </Button>
            <Button
              className={activeCategory === "art" ? "bg-secondary text-white" : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"}
              onClick={() => setActiveCategory("art")}
            >
              Art
            </Button>
            <Button
              className={activeCategory === "gaming" ? "bg-secondary text-white" : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"}
              onClick={() => setActiveCategory("gaming")}
            >
              Gaming
            </Button>
            <Button
              className={activeCategory === "music" ? "bg-secondary text-white" : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"}
              onClick={() => setActiveCategory("music")}
            >
              Music
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">Error loading NFTs. Please try again later.</p>
          </div>
        ) : filteredNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.slice(0, visibleCount).map((nft: NFT) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No NFTs found in this category.</p>
          </div>
        )}
        
        {filteredNFTs.length > visibleCount && (
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              className="px-6 py-3 border-secondary text-secondary hover:bg-secondary hover:text-white"
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
