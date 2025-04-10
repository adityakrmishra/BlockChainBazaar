import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NFTFilters } from "@/types";
import { Collection } from "@shared/schema";

interface NftFilterSidebarProps {
  filters: NFTFilters;
  setFilters: (filters: NFTFilters) => void;
}

export default function NftFilterSidebar({ filters, setFilters }: NftFilterSidebarProps) {
  // Local state for filter inputs
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || "");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(filters.status || []);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(filters.collections || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.categories || []);
  const [currency, setCurrency] = useState<"ETH" | "USD">("ETH");

  // Fetch collections for filter
  const { data: collections } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

  // Update filters when local state changes
  useEffect(() => {
    const newFilters: NFTFilters = { ...filters };
    
    if (selectedStatuses.length > 0) {
      newFilters.status = selectedStatuses;
    } else {
      delete newFilters.status;
    }

    if (selectedCollections.length > 0) {
      newFilters.collections = selectedCollections;
    } else {
      delete newFilters.collections;
    }

    if (selectedCategories.length > 0) {
      newFilters.categories = selectedCategories;
    } else {
      delete newFilters.categories;
    }

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min)) {
      newFilters.minPrice = min;
    } else {
      delete newFilters.minPrice;
    }

    if (!isNaN(max)) {
      newFilters.maxPrice = max;
    } else {
      delete newFilters.maxPrice;
    }

    setFilters(newFilters);
  }, [selectedStatuses, selectedCollections, selectedCategories]);

  // Apply price range
  const applyPriceRange = () => {
    const newFilters = { ...filters };
    
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min)) {
      newFilters.minPrice = min;
    } else {
      delete newFilters.minPrice;
    }

    if (!isNaN(max)) {
      newFilters.maxPrice = max;
    } else {
      delete newFilters.maxPrice;
    }

    setFilters(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedStatuses([]);
    setSelectedCollections([]);
    setSelectedCategories([]);
    setFilters({});
  };

  // Toggle status selection
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Toggle collection selection
  const toggleCollection = (collection: string) => {
    if (selectedCollections.includes(collection)) {
      setSelectedCollections(selectedCollections.filter(c => c !== collection));
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="w-full md:w-1/4 lg:w-1/5 order-2 md:order-1">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md sticky top-24">
        <h3 className="font-poppins font-semibold text-lg mb-4">Filters</h3>
        
        {/* Status Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Status</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary" 
                checked={selectedStatuses.includes("listed")}
                onChange={() => toggleStatus("listed")}
              />
              <span className="ml-2 text-sm">Buy Now</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary" 
                checked={selectedStatuses.includes("auctioning")}
                onChange={() => toggleStatus("auctioning")}
              />
              <span className="ml-2 text-sm">On Auction</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary" 
                checked={selectedStatuses.includes("minted")}
                onChange={() => toggleStatus("minted")}
              />
              <span className="ml-2 text-sm">New</span>
            </label>
          </div>
        </div>
        
        {/* Price Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="flex items-center space-x-2">
            <select 
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-1/4"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "ETH" | "USD")}
            >
              <option value="ETH">ETH</option>
              <option value="USD">USD</option>
            </select>
            <Input 
              type="number" 
              placeholder="Min" 
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-1/3"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <div className="text-gray-500">to</div>
            <Input 
              type="number" 
              placeholder="Max" 
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-1/3"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button 
            variant="outline"
            className="mt-2 w-full bg-accent hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-text dark:text-white py-1 px-4 rounded-lg text-sm transition-colors"
            onClick={applyPriceRange}
          >
            Apply
          </Button>
        </div>
        
        {/* Collections Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Collections</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {collections && collections.length > 0 ? (
              collections.map((collection) => (
                <label key={collection.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary" 
                    checked={selectedCollections.includes(collection.name)}
                    onChange={() => toggleCollection(collection.name)}
                  />
                  <span className="ml-2 text-sm truncate">{collection.name}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No collections available</p>
            )}
          </div>
        </div>
        
        {/* Categories Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary" 
                checked={selectedCategories.includes("Art")}
                onChange={() => toggleCategory("Art")}
              />
              <span className="ml-2 text-sm">Art</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary" 
                checked={selectedCategories.includes("Gaming")}
                onChange={() => toggleCategory("Gaming")}
              />
              <span className="ml-2 text-sm">Gaming</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary" 
                checked={selectedCategories.includes("Photography")}
                onChange={() => toggleCategory("Photography")}
              />
              <span className="ml-2 text-sm">Photography</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary" 
                checked={selectedCategories.includes("Music")}
                onChange={() => toggleCategory("Music")}
              />
              <span className="ml-2 text-sm">Music</span>
            </label>
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-text dark:text-white py-2 px-4 rounded-lg font-medium transition-colors"
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
