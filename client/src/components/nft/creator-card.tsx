import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";
import { getRandomAvatarUrl } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, Plus } from "lucide-react";

interface CreatorCardProps {
  creator: User;
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Fetch creator stats
  const { data: createdNfts } = useQuery({
    queryKey: [`/api/users/${creator.id}/created`],
    enabled: !!creator.id,
  });
  
  const { data: followers } = useQuery({
    queryKey: [`/api/users/${creator.id}/followers`],
    enabled: !!creator.id,
  });
  
  // Check if current user is following this creator
  useQuery({
    queryKey: [`/api/users/${user?.id}/following`],
    enabled: !!user,
    onSuccess: (data) => {
      if (data && Array.isArray(data)) {
        setIsFollowing(data.some(followedUser => followedUser.id === creator.id));
      }
    }
  });
  
  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await apiRequest("DELETE", `/api/users/${creator.id}/follow`);
      } else {
        await apiRequest("POST", `/api/users/${creator.id}/follow`);
      }
    },
    onSuccess: () => {
      setIsFollowing(!isFollowing);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${creator.id}/followers`] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/following`] });
      }
    }
  });
  
  const handleFollowClick = () => {
    if (!user) return; // User must be logged in
    followMutation.mutate();
  };
  
  // Calculate stats
  const artworksCount = createdNfts?.length || 0;
  const salesCount = 0; // Would need transaction data for this
  const volumeEth = 0; // Would need transaction data for this
  
  // Select a gradient based on creator id for visual variety
  const gradients = [
    "from-secondary to-primary",
    "from-purple-500 to-pink-500",
    "from-green-400 to-blue-500",
    "from-yellow-400 to-orange-500"
  ];
  
  const gradientClass = gradients[creator.id % gradients.length];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
      <div className={`relative h-32 bg-gradient-to-r ${gradientClass}`}>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-800">
            <AvatarImage 
              src={creator.profileImage || getRandomAvatarUrl(creator.id)} 
              alt={creator.displayName || creator.username} 
            />
            <AvatarFallback>
              {(creator.displayName || creator.username)[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="pt-12 pb-6 px-6 text-center">
        <Link href={`/profile/${creator.id}`}>
          <a>
            <h3 className="font-poppins font-semibold text-lg hover:text-secondary transition-colors">
              {creator.displayName || creator.username}
            </h3>
          </a>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">@{creator.username}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Artworks</p>
            <p className="font-semibold">{artworksCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
            <p className="font-semibold">{followers?.length || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Volume</p>
            <p className="font-semibold">{volumeEth.toFixed(1)} ETH</p>
          </div>
        </div>
        
        {user && user.id !== creator.id && (
          <Button 
            className={`w-full ${
              isFollowing 
                ? "bg-secondary hover:bg-primary text-white" 
                : "bg-accent dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={handleFollowClick}
            disabled={followMutation.isPending}
          >
            {isFollowing ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
