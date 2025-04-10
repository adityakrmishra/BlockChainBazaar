import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Collection } from "@shared/schema";
import { getCollectionImageUrl, getRandomAvatarUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import EthIcon from "../ui/eth-icon";

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  // Fetch creator information
  const { data: creator } = useQuery({
    queryKey: [`/api/users/${collection.creatorId}`],
    enabled: !!collection.creatorId,
  });

  // Fetch collection stats (NFTs in collection)
  const { data: collectionNfts } = useQuery({
    queryKey: [`/api/nfts?collection=${collection.name}`],
    enabled: !!collection.name,
  });

  return (
    <Link href={`/collection/${collection.id}`}>
      <a>
        <Card className="nft-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
          <div className="relative">
            <img 
              src={getCollectionImageUrl(collection.image || collection.id.toString())} 
              alt={collection.name} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage 
                    src={creator?.profileImage || getRandomAvatarUrl(collection.creatorId)} 
                    alt={creator?.displayName || "Creator"} 
                  />
                  <AvatarFallback>
                    {(creator?.displayName?.[0] || "C").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2 text-white">
                  <p className="font-medium text-sm">{collection.name}</p>
                  <p className="text-xs">by @{creator?.username || "creator"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Floor Price</span>
              <div className="flex items-center">
                <EthIcon size="sm" className="mr-1" />
                <span className="font-medium">
                  {collectionNfts && collectionNfts.length > 0
                    ? Math.min(...collectionNfts.map(nft => nft.price || Infinity)).toFixed(2)
                    : "—"} ETH
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Items</span>
              <span className="font-medium">{collectionNfts?.length || 0}</span>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}
