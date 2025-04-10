import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { NFT } from "@shared/schema";
import NftGrid from "@/components/nft/nft-grid";
import NftFilterSidebar from "@/components/nft/nft-filter-sidebar";
import { NFTFilters } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortOption = "recent" | "price-low-high" | "price-high-low" | "popular";

export default function MarketplacePage() {
  const [filters, setFilters] = useState<NFTFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch all NFTs
  const { data: nfts, isLoading } = useQuery<NFT[]>({
    queryKey: ["/api/nfts"],
  });

  // Apply filters, search, and sorting to NFTs
  const filteredNfts = nfts ? nfts.filter(nft => {
    // Apply status filter
    if (filters.status && filters.status.length > 0 && !filters.status.includes(nft.status)) {
      return false;
    }
    
    // Apply price filter
    if (
      (filters.minPrice !== undefined && nft.price !== null && nft.price < filters.minPrice) ||
      (filters.maxPrice !== undefined && nft.price !== null && nft.price > filters.maxPrice)
    ) {
      return false;
    }
    
    // Apply collection filter
    if (
      filters.collections && 
      filters.collections.length > 0 && 
      nft.collection && 
      !filters.collections.includes(nft.collection)
    ) {
      return false;
    }
    
    // Apply search query
    if (
      searchQuery && 
      !nft.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !nft.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  }) : [];

  // Sort filtered NFTs
  const sortedNfts = [...(filteredNfts || [])];
  switch (sortBy) {
    case "price-low-high":
      sortedNfts.sort((a, b) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return a.price - b.price;
      });
      break;
    case "price-high-low":
      sortedNfts.sort((a, b) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return b.price - a.price;
      });
      break;
    case "popular":
      // Would need additional data to sort by popularity
      // For now, just use the default order
      break;
    case "recent":
    default:
      sortedNfts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  return (
    <div className="py-8 px-4 dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-poppins font-bold text-2xl md:text-3xl">Explore Marketplace</h1>
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="icon" 
              onClick={() => setViewMode("grid")}
              className="border border-gray-200 dark:border-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="icon" 
              onClick={() => setViewMode("list")}
              className="border border-gray-200 dark:border-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="relative mb-6 md:hidden">
          <Input
            type="text"
            placeholder="Search NFTs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <NftFilterSidebar filters={filters} setFilters={setFilters} />
          
          {/* NFT Grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="hidden md:flex justify-between items-center mb-6">
              <div className="relative w-full max-w-md">
                <Input
                  type="text"
                  placeholder="Search NFTs by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-secondary" />
              </div>
            ) : (
              <>
                <NftGrid nfts={sortedNfts} viewMode={viewMode} />
                
                {sortedNfts.length > 0 && (
                  <div className="mt-10 text-center">
                    <Button variant="outline" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-8 py-3 h-auto rounded-xl font-medium hover:bg-accent dark:hover:bg-gray-700 transition-colors">
                      Load More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </div>
                )}
                
                {sortedNfts.length === 0 && (
                  <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="w-16 h-16 mx-auto mb-4 bg-accent/50 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No NFTs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      We couldn't find any NFTs matching your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
