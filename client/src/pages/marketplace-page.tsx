import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { NFTCard } from "@/components/ui/nft-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter, X } from "lucide-react";
import { NFT } from "@shared/schema";
import { useLocation, useSearch } from "wouter";

type FilterState = {
  category: string;
  minPrice: number;
  maxPrice: number;
  isAuction: boolean;
  sortBy: string;
  searchQuery: string;
};

export default function MarketplacePage() {
  const [, setLocation] = useLocation();
  const [search] = useSearch();
  const searchParams = new URLSearchParams(search);
  
  // Set initial filters based on URL params
  const initialCategory = searchParams.get("category") || "all";
  
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    minPrice: 0,
    maxPrice: 100,
    isAuction: false,
    sortBy: "newest",
    searchQuery: ""
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Fetch all NFTs
  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ['/api/nfts']
  });
  
  // Filter NFTs based on the current filters
  const filterNFTs = (nfts: NFT[]) => {
    if (!nfts) return [];
    
    return nfts.filter(nft => {
      // Filter by category
      if (filters.category !== "all" && nft.collectionId?.toString() !== filters.category) {
        return false;
      }
      
      // Filter by price range
      if (nft.price && (nft.price < filters.minPrice || nft.price > filters.maxPrice)) {
        return false;
      }
      
      // Filter by auction status
      if (filters.isAuction && !nft.isAuction) {
        return false;
      }
      
      // Filter by search query
      if (filters.searchQuery && !nft.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by selected criteria
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });
  };
  
  const filteredNFTs = nfts ? filterNFTs(nfts) : [];
  
  // Update URL when category changes
  useEffect(() => {
    if (filters.category !== "all") {
      setLocation(`/marketplace?category=${filters.category}`, { replace: true });
    } else {
      setLocation("/marketplace", { replace: true });
    }
  }, [filters.category, setLocation]);
  
  return (
    <>
      <Helmet>
        <title>Marketplace | NFTverse</title>
        <meta name="description" content="Browse and discover unique digital art and collectibles on the NFTverse marketplace." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Mobile Filter Toggle */}
          <div className="w-full md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Marketplace</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          {/* Filter Sidebar */}
          <div className={`w-full md:w-64 md:block mb-6 ${isFilterOpen ? 'block' : 'hidden'}`}>
            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by name"
                    className="pl-10"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <Label className="block mb-2">Category</Label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => setFilters({...filters, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="1">Art</SelectItem>
                      <SelectItem value="2">Music</SelectItem>
                      <SelectItem value="3">Photography</SelectItem>
                      <SelectItem value="4">Sports</SelectItem>
                      <SelectItem value="5">Collectibles</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <Label className="block mb-2">Price Range (ETH)</Label>
                <div className="space-y-4">
                  <Slider 
                    defaultValue={[filters.minPrice, filters.maxPrice]} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => setFilters({
                      ...filters, 
                      minPrice: value[0], 
                      maxPrice: value[1]
                    })}
                  />
                  <div className="flex justify-between">
                    <span>{filters.minPrice} ETH</span>
                    <span>{filters.maxPrice} ETH</span>
                  </div>
                </div>
              </div>
              
              {/* Auction Only Toggle */}
              <div className="mb-6 flex items-center space-x-2">
                <Checkbox 
                  id="auctions" 
                  checked={filters.isAuction}
                  onCheckedChange={(checked) => 
                    setFilters({...filters, isAuction: checked as boolean})
                  }
                />
                <Label htmlFor="auctions">Auctions Only</Label>
              </div>
              
              {/* Sort By */}
              <div className="mb-6">
                <Label className="block mb-2">Sort By</Label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => setFilters({...filters, sortBy: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Reset Filters */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({
                  category: "all",
                  minPrice: 0,
                  maxPrice: 100,
                  isAuction: false,
                  sortBy: "newest",
                  searchQuery: ""
                })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* NFTs Grid */}
          <div className="flex-1">
            <div className="hidden md:flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Marketplace</h1>
              
              <p className="text-gray-600 dark:text-gray-400">
                {filteredNFTs.length} {filteredNFTs.length === 1 ? "item" : "items"}
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-600 dark:text-red-400">Error loading NFTs. Please try again later.</p>
              </div>
            ) : filteredNFTs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">No NFTs found matching your filters.</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => setFilters({
                    category: "all",
                    minPrice: 0,
                    maxPrice: 100,
                    isAuction: false,
                    sortBy: "newest",
                    searchQuery: ""
                  })}
                >
                  Clear filters and try again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}
            
            {/* Load More */}
            {filteredNFTs.length > 0 && (
              <div className="text-center mt-12">
                <Button 
                  variant="outline"
                  className="px-6 py-3 border-secondary text-secondary hover:bg-secondary hover:text-white"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
