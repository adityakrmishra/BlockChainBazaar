import { useState } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock } from "lucide-react";
import { NFT, User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

type NFTCardProps = {
  nft: NFT;
  creator?: User;
  showActions?: boolean;
};

export function NFTCard({ nft, creator, showActions = true }: NFTCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  // Fetch like status if user is logged in
  const { data: likeData } = useQuery({
    queryKey: ['/api/nfts', nft.id, 'liked'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });
  
  // Get creator details if not provided
  const { data: creatorData } = useQuery({
    queryKey: ['/api/users', nft.creatorId],
    enabled: !creator
  });

  const displayCreator = creator || creatorData;
  
  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (likeData?.liked) {
        await apiRequest("DELETE", `/api/nfts/${nft.id}/like`);
        return { liked: false };
      } else {
        await apiRequest("POST", `/api/nfts/${nft.id}/like`);
        return { liked: true };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/nfts', nft.id, 'liked'], data);
      toast({
        title: data.liked ? "Added to favorites" : "Removed from favorites",
        description: data.liked ? "NFT added to your favorites" : "NFT removed from your favorites"
      });
    }
  });
  
  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/nfts/${nft.id}/buy`);
    },
    onSuccess: () => {
      toast({
        title: "Purchase successful",
        description: `You are now the owner of ${nft.name}`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/nfts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'owned'] });
    },
    onError: (error) => {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Calculate time remaining for auctions
  const getTimeRemaining = () => {
    if (nft.isAuction && nft.auctionEndTime) {
      const endTime = new Date(nft.auctionEndTime);
      if (endTime > new Date()) {
        return formatDistanceToNow(endTime, { addSuffix: true });
      }
      return "Auction ended";
    }
    return null;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <Card 
      className="overflow-hidden transition-all group hover:shadow-xl dark:border-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link href={`/nft/${nft.id}`}>
          <img 
            src={nft.imageUrl} 
            alt={nft.name} 
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Overlay actions */}
        {showActions && (
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {user && (
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full bg-white/90 text-gray-900 hover:bg-white"
                onClick={() => likeMutation.mutate()}
                disabled={likeMutation.isPending}
              >
                <Heart className={`h-5 w-5 ${likeData?.liked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
            
            <Link href={`/nft/${nft.id}`}>
              <Button className="bg-secondary hover:bg-primary">
                {nft.isAuction ? "Place Bid" : "View Details"}
              </Button>
            </Link>
          </div>
        )}
        
        {/* Timer for auctions */}
        {timeRemaining && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4 inline mr-1" />
            {timeRemaining}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/profile/${nft.creatorId}`}>
            <img 
              src={displayCreator?.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${nft.creatorId}`} 
              alt={displayCreator?.username || "Creator"} 
              className="w-6 h-6 rounded-full border border-white"
            />
          </Link>
          <Link href={`/profile/${nft.creatorId}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">
              @{displayCreator?.username || "unknown"}
            </p>
          </Link>
        </div>
        
        <Link href={`/nft/${nft.id}`}>
          <h3 className="text-lg font-bold mb-1 hover:text-secondary transition-colors">{nft.name}</h3>
        </Link>
        
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {nft.isAuction ? "Current Bid" : "Price"}
            </p>
            <p className="font-medium">{nft.price} {nft.currency || "ETH"}</p>
          </div>
          
          {nft.isAuction && timeRemaining && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Ending</p>
              <p className="font-medium text-secondary">{timeRemaining}</p>
            </div>
          )}
          
          {!nft.isAuction && nft.ownerId !== user?.id && (
            <Button 
              size="sm" 
              onClick={() => purchaseMutation.mutate()}
              disabled={purchaseMutation.isPending || !user}
              className="bg-secondary hover:bg-primary text-sm"
            >
              {purchaseMutation.isPending ? "Processing..." : "Buy Now"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
