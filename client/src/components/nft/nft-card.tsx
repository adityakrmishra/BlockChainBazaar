import { useState } from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatEth, formatUsd, getNftImageUrl, getRandomAvatarUrl } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { NFT } from "@shared/schema";
import { Heart, Clock } from "lucide-react";
import EthIcon from "@/components/ui/eth-icon";
import Countdown from "@/components/ui/countdown";
import { useQuery } from "@tanstack/react-query";

interface NftCardProps {
  nft: NFT;
  showBidButton?: boolean;
}

export default function NftCard({ nft, showBidButton = false }: NftCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  
  // Fetch creator data
  const { data: creator } = useQuery({
    queryKey: [`/api/users/${nft.creatorId}`],
    enabled: !!nft.creatorId,
  });
  
  // Fetch auction data if the NFT is auctioning
  const { data: auction } = useQuery({
    queryKey: [`/api/nfts/${nft.id}/auction`],
    enabled: nft.status === "auctioning",
  });

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const getStatusBadge = () => {
    switch (nft.status) {
      case "auctioning":
        return (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>Auction</span>
            </span>
          </div>
        );
      case "listed":
        return (
          <div className="absolute bottom-3 left-3">
            <span className="bg-secondary/90 text-white text-xs px-2 py-0.5 rounded-md">For Sale</span>
          </div>
        );
      case "minted":
        return (
          <div className="absolute bottom-3 left-3">
            <span className="bg-secondary/90 text-white text-xs px-2 py-0.5 rounded-md">New</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="nft-card overflow-hidden">
      <Link href={`/nft/${nft.id}`}>
        <a className="block">
          <div className="relative">
            <img 
              src={getNftImageUrl(nft.image)} 
              alt={nft.name} 
              className="w-full h-64 object-cover"
            />
            <button 
              className="absolute top-3 right-3 bg-white/70 dark:bg-gray-800/70 p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              onClick={toggleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            {getStatusBadge()}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-poppins font-semibold text-lg truncate">{nft.name}</h3>
                <div className="flex items-center mt-1 mb-2">
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage 
                      src={creator?.profileImage || getRandomAvatarUrl(nft.creatorId)} 
                      alt={creator?.displayName || "Creator"} 
                    />
                    <AvatarFallback>
                      {(creator?.displayName?.[0] || "C").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    @{creator?.username || "creator"}
                  </span>
                </div>
              </div>
            </div>
            
            {nft.status === "auctioning" && auction ? (
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">Current Bid</span>
                <div className="flex items-center">
                  <EthIcon size="sm" className="mr-1" />
                  <span className="font-medium">{formatEth(auction.currentPrice)}</span>
                </div>
                <div className="mt-1">
                  <Countdown endTime={auction.endTime} compact />
                </div>
              </div>
            ) : (
              nft.price && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Price</span>
                  <div className="flex items-center">
                    <EthIcon size="sm" className="mr-1" />
                    <span className="font-medium">{formatEth(nft.price)}</span>
                  </div>
                </div>
              )
            )}
          </CardContent>
          
          {(showBidButton || nft.status === "listed") && (
            <CardFooter className="p-4 pt-0">
              {nft.status === "auctioning" && auction ? (
                <Button className="w-full bg-secondary hover:bg-primary text-white">
                  Place Bid
                </Button>
              ) : nft.status === "listed" && nft.price ? (
                <Button className="w-full bg-secondary hover:bg-primary text-white">
                  Buy Now
                </Button>
              ) : null}
            </CardFooter>
          )}
        </a>
      </Link>
    </Card>
  );
}
