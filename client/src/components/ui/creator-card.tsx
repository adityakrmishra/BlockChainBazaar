import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { User } from "@shared/schema";
import { Link } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type CreatorCardProps = {
  creator: User;
  stats?: {
    items?: number;
    owners?: number;
    volume?: number;
  };
};

export function CreatorCard({ creator, stats }: CreatorCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get follow status if user is logged in
  const { data: followData } = useQuery({
    queryKey: ['/api/users', creator.id, 'following'],
    enabled: !!user && user.id !== creator.id
  });
  
  // Get stats if not provided
  const { data: creatorNFTs } = useQuery({
    queryKey: ['/api/users', creator.id, 'created'],
    enabled: !stats,
  });
  
  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (followData?.following) {
        await apiRequest("DELETE", `/api/users/${creator.id}/follow`);
        return { following: false };
      } else {
        await apiRequest("POST", `/api/users/${creator.id}/follow`);
        return { following: true };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/users', creator.id, 'following'], data);
      toast({
        title: data.following ? "Following" : "Unfollowed",
        description: data.following ? `You are now following @${creator.username}` : `You unfollowed @${creator.username}`
      });
    }
  });
  
  // Calculate stats
  const displayStats = stats || {
    items: creatorNFTs?.length || 0,
    owners: Math.floor(Math.random() * 1000), // This would ideally be fetched from the API
    volume: creatorNFTs?.reduce((acc, nft) => acc + (nft.price || 0), 0) || 0
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Link href={`/profile/${creator.id}`}>
            <img 
              src={creator.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${creator.id}`} 
              alt={creator.username} 
              className="w-16 h-16 rounded-full object-cover border-2 border-secondary" 
            />
          </Link>
          
          <div>
            <Link href={`/profile/${creator.id}`}>
              <h3 className="font-bold text-lg hover:text-secondary transition-colors">@{creator.username}</h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {creator.walletAddress ? 
                `${creator.walletAddress.substring(0, 6)}...${creator.walletAddress.substring(creator.walletAddress.length - 4)}` : 
                creator.bio?.substring(0, 30) || 'Digital Artist'}
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-2xl font-bold">{displayStats.items}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{displayStats.owners?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Owners</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{displayStats.volume?.toLocaleString('en-US', { maximumFractionDigits: 1 })}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Volume</p>
          </div>
        </div>
        
        {user && user.id !== creator.id && (
          <div className="mt-6 flex gap-2">
            <Button 
              className={`flex-1 ${followData?.following ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600' : 'bg-secondary hover:bg-primary'}`}
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
            >
              {followMutation.isPending ? "Processing..." : followData?.following ? "Following" : "Follow"}
            </Button>
            <Button variant="outline" size="icon" className="px-3">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
