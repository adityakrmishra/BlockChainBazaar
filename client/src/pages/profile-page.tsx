import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NftGrid from "@/components/nft/nft-grid";
import { Loader2, Edit, Share2 } from "lucide-react";
import { getRandomAvatarUrl } from "@/lib/utils";
import { User, NFT, Collection, Follow } from "@shared/schema";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Fetch profile user data
  const { data: profileUser, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: [`/api/users/${id}`],
    enabled: !!id,
  });
  
  // Fetch user's owned NFTs
  const { data: ownedNfts, isLoading: isLoadingOwned } = useQuery<NFT[]>({
    queryKey: [`/api/users/${id}/nfts`],
    enabled: !!id,
  });
  
  // Fetch user's created NFTs
  const { data: createdNfts, isLoading: isLoadingCreated } = useQuery<NFT[]>({
    queryKey: [`/api/users/${id}/created`],
    enabled: !!id && profileUser?.isCreator,
  });
  
  // Fetch user's collections
  const { data: collections, isLoading: isLoadingCollections } = useQuery<Collection[]>({
    queryKey: [`/api/users/${id}/collections`],
    enabled: !!id,
  });
  
  // Fetch followers
  const { data: followers, isLoading: isLoadingFollowers } = useQuery<Follow[]>({
    queryKey: [`/api/users/${id}/followers`],
    enabled: !!id,
  });
  
  // Fetch following
  const { data: following, isLoading: isLoadingFollowing } = useQuery<Follow[]>({
    queryKey: [`/api/users/${id}/following`],
    enabled: !!id,
  });
  
  // Check if current user is following this profile
  useQuery<Follow[]>({
    queryKey: [`/api/users/${currentUser?.id}/following`],
    enabled: !!currentUser && currentUser.id !== parseInt(id || "0"),
    onSuccess: (data) => {
      if (data && Array.isArray(data)) {
        setIsFollowing(data.some(follow => follow.followingId === parseInt(id || "0")));
      }
    }
  });
  
  const isOwnProfile = currentUser && profileUser && currentUser.id === profileUser.id;
  
  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-12">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400">
            The user profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Profile Banner */}
      <div className="w-full h-64 bg-gradient-to-r from-primary to-secondary relative">
        {profileUser.coverImage && (
          <img 
            src={profileUser.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Profile Info */}
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 rounded-full">
            <AvatarImage 
              src={profileUser.profileImage || getRandomAvatarUrl(profileUser.id)} 
              alt={profileUser.displayName || profileUser.username} 
            />
            <AvatarFallback className="text-2xl">
              {(profileUser.displayName || profileUser.username)[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="mt-4 md:mt-0 md:ml-6 mb-4 text-center md:text-left">
            <h1 className="text-3xl font-bold font-poppins">{profileUser.displayName || profileUser.username}</h1>
            <p className="text-gray-600 dark:text-gray-400">@{profileUser.username}</p>
            
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="text-center">
                <span className="text-lg font-semibold">{ownedNfts?.length || 0}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold">{followers?.length || 0}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold">{following?.length || 0}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
              </div>
            </div>
          </div>
          
          <div className="md:ml-auto flex gap-2 mt-4 md:mt-0">
            {isOwnProfile ? (
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button 
                className={isFollowing ? "bg-primary" : "bg-secondary"}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Bio */}
        {profileUser.bio && (
          <div className="mb-8 max-w-3xl">
            <p className="text-gray-600 dark:text-gray-300">{profileUser.bio}</p>
          </div>
        )}
        
        {/* Content Tabs */}
        <Tabs defaultValue="owned" className="mb-12">
          <TabsList className="border-b w-full justify-start rounded-none bg-transparent">
            <TabsTrigger 
              value="owned" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-secondary bg-transparent"
            >
              Owned
            </TabsTrigger>
            {profileUser.isCreator && (
              <TabsTrigger 
                value="created" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-secondary bg-transparent"
              >
                Created
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="collections" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-secondary bg-transparent"
            >
              Collections
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-secondary bg-transparent"
            >
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="owned" className="mt-6">
            {isLoadingOwned ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : (
              <NftGrid nfts={ownedNfts || []} />
            )}
          </TabsContent>
          
          <TabsContent value="created" className="mt-6">
            {isLoadingCreated ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : (
              <NftGrid nfts={createdNfts || []} />
            )}
          </TabsContent>
          
          <TabsContent value="collections" className="mt-6">
            {isLoadingCollections ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : collections && collections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collections.map(collection => (
                  <div 
                    key={collection.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md"
                  >
                    <div className="h-40 bg-gradient-to-r from-secondary/30 to-primary/30">
                      {collection.image && (
                        <img 
                          src={collection.image} 
                          alt={collection.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-poppins font-semibold text-lg">{collection.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {collection.description || "No description"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No collections found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Activity history will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
