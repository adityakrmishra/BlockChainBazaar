import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Collection, User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Flame, TrendingUp } from "lucide-react";

type CollectionCardProps = {
  collection: Collection;
  creator?: User;
};

export function CollectionCard({ collection, creator }: CollectionCardProps) {
  // Get creator details if not provided
  const { data: creatorData, isLoading: isLoadingCreator } = useQuery({
    queryKey: ['/api/users', collection.creatorId],
    enabled: !creator
  });

  const displayCreator = creator || creatorData;
  
  // Helper to get trending status
  const getTrendingStatus = () => {
    if (collection.volume && collection.volume >= 500) {
      return "hot";
    } else if (collection.volume && collection.volume >= 200) {
      return "trending";
    }
    return null;
  };
  
  const trendingStatus = getTrendingStatus();

  return (
    <Link href={`/collection/${collection.id}`}>
      <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-800">
        <div className="h-40 overflow-hidden">
          <img 
            src={collection.bannerUrl || `https://source.unsplash.com/random/800x600?digital,art&sig=${collection.id}`} 
            alt={`${collection.name} Banner`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={displayCreator?.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${collection.creatorId}`} 
                alt="Creator Avatar" 
                className="w-12 h-12 rounded-full border-2 border-white -mt-8" 
              />
              <div>
                <h3 className="font-bold text-lg">{collection.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  by <span className="text-secondary">@{displayCreator?.username || "unknown"}</span>
                </p>
              </div>
            </div>
            
            {trendingStatus && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary px-2 py-1">
                {trendingStatus === "hot" ? (
                  <><Flame className="h-3 w-3 mr-1" /> Hot</>
                ) : (
                  <><TrendingUp className="h-3 w-3 mr-1" /> Trending</>
                )}
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {collection.description || `A fantastic collection of unique digital assets.`}
          </p>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Floor</p>
              <p className="font-medium">{collection.floorPrice || "N/A"} ETH</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Volume</p>
              <p className="font-medium">{collection.volume || "N/A"} ETH</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
              <p className="font-medium">{collection.itemCount || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
