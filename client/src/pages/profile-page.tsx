import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  User as UserIcon, 
  Grid, 
  Image, 
  ShoppingBag, 
  Heart, 
  Users, 
  History,
  Loader2
} from "lucide-react";
import { NFTCard } from "@/components/ui/nft-card";
import { CollectionCard } from "@/components/ui/collection-card";
import { NFT, Collection, Transaction } from "@shared/schema";
import { Link, useParams, useLocation, useSearch } from "wouter";

export default function ProfilePage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [search] = useSearch();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  // Get tab from URL or default to "created"
  const searchParams = new URLSearchParams(search);
  const defaultTab = searchParams.get("tab") || "created";
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Determine if we're viewing the current user's profile or someone else's
  const isOwnProfile = !id || (currentUser && parseInt(id) === currentUser.id);
  const userId = isOwnProfile && currentUser ? currentUser.id : parseInt(id || "0");
  
  // Fetch profile data
  const { data: profileUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/users', userId],
    enabled: userId > 0
  });
  
  // Check if following this user
  const { data: followData, isLoading: isLoadingFollowStatus } = useQuery({
    queryKey: ['/api/users', userId, 'following'],
    enabled: !!currentUser && !!profileUser && currentUser.id !== profileUser.id
  });
  
  // Fetch user's created NFTs
  const { data: createdNFTs, isLoading: isLoadingCreated } = useQuery({
    queryKey: ['/api/users', userId, 'created'],
    enabled: userId > 0 && activeTab === "created"
  });
  
  // Fetch user's owned NFTs
  const { data: ownedNFTs, isLoading: isLoadingOwned } = useQuery({
    queryKey: ['/api/users', userId, 'owned'],
    enabled: userId > 0 && activeTab === "owned"
  });
  
  // Fetch user's collections
  const { data: collections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ['/api/users', userId, 'collections'],
    enabled: userId > 0 && activeTab === "collections"
  });
  
  // Fetch user's favorites (liked NFTs)
  // Note: In a real app, this would be a separate endpoint
  const { data: likedNFTs, isLoading: isLoadingLiked } = useQuery({
    queryKey: ['/api/users', userId, 'liked'],
    enabled: userId > 0 && activeTab === "favorites" && isOwnProfile
  });
  
  // Fetch user's transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/users', userId, 'transactions'],
    enabled: userId > 0 && activeTab === "activity" && (isOwnProfile || currentUser?.id === userId)
  });
  
  // Fetch user's followers
  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['/api/users', userId, 'followers'],
    enabled: userId > 0 && activeTab === "followers"
  });
  
  // Fetch user's following
  const { data: following, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['/api/users', userId, 'followings'],
    enabled: userId > 0 && activeTab === "following"
  });
  
  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (followData?.following) {
        await apiRequest("DELETE", `/api/users/${userId}/follow`);
        return { following: false };
      } else {
        await apiRequest("POST", `/api/users/${userId}/follow`);
        return { following: true };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/users', userId, 'following'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'followers'] });
      toast({
        title: data.following ? "Following" : "Unfollowed",
        description: data.following ? `You are now following @${profileUser?.username}` : `You unfollowed @${profileUser?.username}`
      });
    }
  });
  
  // Update URL when tab changes
  useEffect(() => {
    if (isOwnProfile) {
      setLocation(`/profile?tab=${activeTab}`, { replace: true });
    } else {
      setLocation(`/profile/${id}?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, isOwnProfile, id, setLocation]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  if (isLoadingUser && userId > 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }
  
  if (!profileUser && userId > 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The user you're looking for doesn't exist or has been deleted.</p>
          <Link href="/">
            <Button className="mt-6 bg-secondary hover:bg-primary">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // If we need to show the logged-in user's profile but they're not logged in
  if (isOwnProfile && !currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view your profile.</p>
          <Link href="/auth">
            <Button className="mt-6 bg-secondary hover:bg-primary">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // User data to display - either the profile user or the current user
  const displayUser = profileUser || currentUser;
  
  if (!displayUser) {
    return null; // This shouldn't happen based on the checks above, but just to be safe
  }
  
  return (
    <>
      <Helmet>
        <title>{isOwnProfile ? "My Profile" : `${displayUser.username}'s Profile`} | NFTverse</title>
        <meta name="description" content={`View ${isOwnProfile ? 'your' : `${displayUser.username}'s`} NFT collection, creations, and activity on NFTverse.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage src={displayUser.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${displayUser.id}`} />
              <AvatarFallback>
                <UserIcon className="h-12 w-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">@{displayUser.username}</h1>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center mb-4">
                {displayUser.walletAddress && (
                  <div className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {`${displayUser.walletAddress.substring(0, 6)}...${displayUser.walletAddress.substring(displayUser.walletAddress.length - 4)}`}
                  </div>
                )}
                
                <div className="flex gap-6">
                  <div>
                    <span className="font-bold">{followers?.length || 0}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-bold">{following?.length || 0}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">Following</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-xl">
                {displayUser.bio || "No bio provided"}
              </p>
              
              <div className="flex gap-3 justify-center md:justify-start">
                {isOwnProfile ? (
                  <Button variant="outline" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    className={followData?.following ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600" : "bg-secondary hover:bg-primary"}
                    onClick={() => followMutation.mutate()}
                    disabled={followMutation.isPending || isLoadingFollowStatus}
                  >
                    {followMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {followData?.following ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-7 mb-8">
            <TabsTrigger value="created" className="gap-2">
              <Image className="h-4 w-4 hidden md:inline" />
              Created
            </TabsTrigger>
            <TabsTrigger value="owned" className="gap-2">
              <ShoppingBag className="h-4 w-4 hidden md:inline" />
              Owned
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2">
              <Grid className="h-4 w-4 hidden md:inline" />
              Collections
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="h-4 w-4 hidden md:inline" />
                Favorites
              </TabsTrigger>
            )}
            <TabsTrigger value="followers" className="gap-2">
              <Users className="h-4 w-4 hidden md:inline" />
              Followers
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-2">
              <Users className="h-4 w-4 hidden md:inline" />
              Following
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger value="activity" className="gap-2">
                <History className="h-4 w-4 hidden md:inline" />
                Activity
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Created NFTs Tab */}
          <TabsContent value="created">
            {isLoadingCreated ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : createdNFTs?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdNFTs.map((nft: NFT) => (
                  <NFTCard key={nft.id} nft={nft} creator={displayUser} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-xl font-bold mb-2">No Created NFTs</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {isOwnProfile ? "You haven't created any NFTs yet." : `${displayUser.username} hasn't created any NFTs yet.`}
                </p>
                {isOwnProfile && (
                  <Link href="/create">
                    <Button className="bg-secondary hover:bg-primary">
                      Create Your First NFT
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Owned NFTs Tab */}
          <TabsContent value="owned">
            {isLoadingOwned ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : ownedNFTs?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedNFTs.map((nft: NFT) => (
                  <NFTCard key={nft.id} nft={nft} creator={displayUser} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-xl font-bold mb-2">No Owned NFTs</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {isOwnProfile ? "You don't own any NFTs yet." : `${displayUser.username} doesn't own any NFTs yet.`}
                </p>
                {isOwnProfile && (
                  <Link href="/marketplace">
                    <Button className="bg-secondary hover:bg-primary">
                      Browse the Marketplace
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Collections Tab */}
          <TabsContent value="collections">
            {isLoadingCollections ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : collections?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection: Collection) => (
                  <CollectionCard key={collection.id} collection={collection} creator={displayUser} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-xl font-bold mb-2">No Collections</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {isOwnProfile ? "You haven't created any collections yet." : `${displayUser.username} hasn't created any collections yet.`}
                </p>
                {isOwnProfile && (
                  <Button className="bg-secondary hover:bg-primary">
                    Create Your First Collection
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Favorites Tab - Only visible to the user themselves */}
          {isOwnProfile && (
            <TabsContent value="favorites">
              {isLoadingLiked ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
              ) : likedNFTs?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedNFTs.map((nft: NFT) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">No Favorite NFTs</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't added any NFTs to your favorites yet.
                  </p>
                  <Link href="/marketplace">
                    <Button className="bg-secondary hover:bg-primary">
                      Explore the Marketplace
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          )}
          
          {/* Followers Tab */}
          <TabsContent value="followers">
            {isLoadingFollowers ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : followers?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {followers.map((follower: any) => (
                  <Link key={follower.id} href={`/profile/${follower.id}`}>
                    <div className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <Avatar className="mr-4 h-10 w-10">
                        <AvatarImage src={follower.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${follower.id}`} />
                        <AvatarFallback>
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">@{follower.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                          {follower.bio || "No bio provided"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-xl font-bold mb-2">No Followers Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isOwnProfile ? "You don't have any followers yet." : `${displayUser.username} doesn't have any followers yet.`}
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Following Tab */}
          <TabsContent value="following">
            {isLoadingFollowing ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : following?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {following.map((followed: any) => (
                  <Link key={followed.id} href={`/profile/${followed.id}`}>
                    <div className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <Avatar className="mr-4 h-10 w-10">
                        <AvatarImage src={followed.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${followed.id}`} />
                        <AvatarFallback>
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">@{followed.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                          {followed.bio || "No bio provided"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Not Following Anyone</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isOwnProfile ? "You're not following anyone yet." : `${displayUser.username} isn't following anyone yet.`}
                </p>
                {isOwnProfile && (
                  <Link href="/marketplace">
                    <Button className="mt-4 bg-secondary hover:bg-primary">
                      Discover Creators
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Activity/Transactions Tab - Only visible to the user themselves */}
          {isOwnProfile && (
            <TabsContent value="activity">
              {isLoadingTransactions ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
              ) : transactions?.length ? (
                <div className="border rounded-lg border-gray-200 dark:border-gray-800 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">NFT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From/To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
                      {transactions.map((tx: Transaction) => {
                        const isSeller = tx.sellerId === displayUser.id;
                        return (
                          <tr key={tx.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${isSeller ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                {isSeller ? 'Sold' : 'Purchased'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/nft/${tx.nftId}`}>
                                <span className="text-secondary hover:underline">
                                  NFT #{tx.nftId}
                                </span>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {tx.price} {tx.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/profile/${isSeller ? tx.buyerId : tx.sellerId}`}>
                                <span className="text-secondary hover:underline">
                                  {isSeller ? `User #${tx.buyerId}` : `User #${tx.sellerId}`}
                                </span>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">No Transaction History</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't bought or sold any NFTs yet.
                  </p>
                  <Link href="/marketplace">
                    <Button className="bg-secondary hover:bg-primary">
                      Browse the Marketplace
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
