import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NFTCard } from "@/components/ui/nft-card";
import { Bid, NFT } from "@shared/schema";
import { 
  Heart, 
  Share2, 
  Clock, 
  User as UserIcon, 
  ArrowLeft, 
  Eye, 
  Tag, 
  Loader2, 
  AlertTriangle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NFTDetailPage() {
  const { id } = useParams();
  const nftId = parseInt(id);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState("");
  const [comment, setComment] = useState("");
  
  // Fetch NFT data
  const { data: nft, isLoading: isLoadingNFT, error: nftError } = useQuery({
    queryKey: ['/api/nfts', nftId],
    enabled: !!nftId
  });
  
  // Fetch NFT creator
  const { data: creator, isLoading: isLoadingCreator } = useQuery({
    queryKey: ['/api/users', nft?.creatorId],
    enabled: !!nft?.creatorId
  });
  
  // Fetch NFT owner
  const { data: owner, isLoading: isLoadingOwner } = useQuery({
    queryKey: ['/api/users', nft?.ownerId],
    enabled: !!nft?.ownerId && nft?.ownerId !== nft?.creatorId
  });
  
  // Fetch NFT bids
  const { data: bids, isLoading: isLoadingBids } = useQuery({
    queryKey: ['/api/nfts', nftId, 'bids'],
    enabled: !!nft?.isAuction
  });
  
  // Fetch NFT comments
  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['/api/nfts', nftId, 'comments'],
    enabled: !!nftId
  });
  
  // Fetch similar NFTs (same collection or from same creator)
  const { data: similarNFTs, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['/api/nfts'],
    select: (data) => {
      if (!nft) return [];
      return data.filter((item: NFT) => 
        (item.id !== nft.id) && 
        (item.creatorId === nft.creatorId || item.collectionId === nft.collectionId)
      ).slice(0, 3);
    },
    enabled: !!nft
  });
  
  // Get like status
  const { data: likeData } = useQuery({
    queryKey: ['/api/nfts', nftId, 'liked'],
    enabled: !!user
  });
  
  // Get like count
  const { data: likesData } = useQuery({
    queryKey: ['/api/nfts', nftId, 'likes']
  });
  
  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (likeData?.liked) {
        await apiRequest("DELETE", `/api/nfts/${nftId}/like`);
        return { liked: false };
      } else {
        await apiRequest("POST", `/api/nfts/${nftId}/like`);
        return { liked: true };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/nfts', nftId, 'liked'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/nfts', nftId, 'likes'] });
      toast({
        title: data.liked ? "Added to favorites" : "Removed from favorites",
        description: data.liked ? "NFT added to your favorites" : "NFT removed from your favorites"
      });
    }
  });
  
  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/nfts/${nftId}/buy`);
    },
    onSuccess: () => {
      toast({
        title: "Purchase successful",
        description: `You are now the owner of ${nft.name}`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/nfts', nftId] });
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
  
  // Bid mutation
  const bidMutation = useMutation({
    mutationFn: async (amount: number) => {
      await apiRequest("POST", `/api/nfts/${nftId}/bid`, { amount });
    },
    onSuccess: () => {
      toast({
        title: "Bid placed",
        description: `Your bid of ${bidAmount} ${nft.currency} has been placed`
      });
      setBidAmount("");
      queryClient.invalidateQueries({ queryKey: ['/api/nfts', nftId, 'bids'] });
    },
    onError: (error) => {
      toast({
        title: "Bid failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/nfts/${nftId}/comments`, { content });
    },
    onSuccess: () => {
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully"
      });
      setComment("");
      queryClient.invalidateQueries({ queryKey: ['/api/nfts', nftId, 'comments'] });
    },
    onError: (error) => {
      toast({
        title: "Comment failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Calculate highest bid
  const getHighestBid = (): number => {
    if (!bids || bids.length === 0) return 0;
    return Math.max(...bids.map((bid: Bid) => bid.amount));
  };
  
  // Format auction end time
  const formatAuctionEnd = () => {
    if (!nft?.auctionEndTime) return null;
    
    const endTime = new Date(nft.auctionEndTime);
    const now = new Date();
    
    if (endTime <= now) {
      return "Auction ended";
    }
    
    return formatDistanceToNow(endTime, { addSuffix: true });
  };
  
  // Handle bid submission
  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place a bid",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid bid amount",
        description: "Please enter a valid bid amount",
        variant: "destructive"
      });
      return;
    }
    
    const highestBid = getHighestBid();
    if (amount <= highestBid) {
      toast({
        title: "Bid too low",
        description: `Your bid must be higher than the current highest bid (${highestBid} ${nft.currency})`,
        variant: "destructive"
      });
      return;
    }
    
    if (amount <= (nft.price || 0)) {
      toast({
        title: "Bid too low",
        description: `Your bid must be higher than the starting price (${nft.price} ${nft.currency})`,
        variant: "destructive"
      });
      return;
    }
    
    bidMutation.mutate(amount);
  };
  
  // Handle comment submission
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }
    
    commentMutation.mutate(comment);
  };
  
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: nft?.name || "NFT on NFTverse",
        text: `Check out this NFT: ${nft?.name}`,
        url: window.location.href,
      }).catch((error) => {
        console.error("Error sharing", error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "NFT link copied to clipboard"
      });
    }
  };
  
  // Loading state
  if (isLoadingNFT) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }
  
  // Error state
  if (nftError || !nft) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">NFT Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The NFT you're looking for doesn't exist or has been removed.</p>
          <Button 
            className="bg-secondary hover:bg-primary"
            onClick={() => navigate('/marketplace')}
          >
            Explore Marketplace
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{nft.name} | NFT Detail | NFTverse</title>
        <meta name="description" content={nft.description || `View details of ${nft.name} NFT on NFTverse marketplace.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 pl-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* NFT Image */}
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="w-full h-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x800?text=Image+Not+Available";
              }}
            />
          </div>
          
          {/* NFT Details */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{nft.name}</h1>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => likeMutation.mutate()}
                  disabled={!user || likeMutation.isPending}
                >
                  <Heart className={`h-5 w-5 ${likeData?.liked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Creator & Owner */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-secondary">
                  <AvatarImage src={creator?.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${nft.creatorId}`} />
                  <AvatarFallback>
                    <UserIcon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Creator</p>
                  <Link href={`/profile/${nft.creatorId}`}>
                    <p className="font-medium hover:text-secondary transition-colors">
                      {isLoadingCreator ? "Loading..." : creator ? `@${creator.username}` : `User #${nft.creatorId}`}
                    </p>
                  </Link>
                </div>
              </div>
              
              {nft.ownerId !== nft.creatorId && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={owner?.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${nft.ownerId}`} />
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                    <Link href={`/profile/${nft.ownerId}`}>
                      <p className="font-medium hover:text-secondary transition-colors">
                        {isLoadingOwner ? "Loading..." : owner ? `@${owner.username}` : `User #${nft.ownerId}`}
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {nft.description || "No description provided."}
              </p>
            </div>
            
            {/* NFT Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Token ID</p>
                <p className="font-medium truncate">{nft.tokenId || `#${nft.id}`}</p>
              </div>
              
              {nft.collectionId && (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Collection</p>
                  <Link href={`/collection/${nft.collectionId}`}>
                    <p className="font-medium text-secondary hover:underline">{`Collection #${nft.collectionId}`}</p>
                  </Link>
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Likes</p>
                <p className="font-medium">{likesData?.count || 0}</p>
              </div>
            </div>
            
            {/* Price/Auction Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
              {nft.isAuction ? (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current Bid</p>
                      <p className="text-2xl font-bold">{getHighestBid() || nft.price} {nft.currency}</p>
                    </div>
                    
                    <div className="flex items-center text-sm bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 mr-1 text-secondary" />
                      <span>{formatAuctionEnd()}</span>
                    </div>
                  </div>
                  
                  {user && user.id !== nft.ownerId && (
                    <form onSubmit={handleBid} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={`Enter bid amount (min: ${Math.max(getHighestBid(), nft.price || 0) + 0.01})`}
                          step="0.01"
                          min={Math.max(getHighestBid(), nft.price || 0) + 0.01}
                          className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-white"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          {nft.currency}
                        </span>
                      </div>
                      <Button 
                        type="submit" 
                        className="bg-secondary hover:bg-primary" 
                        disabled={bidMutation.isPending}
                      >
                        {bidMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Place Bid"
                        )}
                      </Button>
                    </form>
                  )}
                  
                  {!user && (
                    <Link href="/auth">
                      <Button className="w-full bg-secondary hover:bg-primary mt-4">
                        Sign In to Place Bid
                      </Button>
                    </Link>
                  )}
                  
                  {user && user.id === nft.ownerId && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 text-sm text-yellow-800 dark:text-yellow-200 mt-4">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      You can't bid on your own NFT
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-2xl font-bold">{nft.price} {nft.currency}</p>
                    </div>
                    
                    <div className="flex items-center text-sm bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>Fixed Price</span>
                    </div>
                  </div>
                  
                  {user && user.id !== nft.ownerId && (
                    <Button 
                      className="w-full bg-secondary hover:bg-primary"
                      onClick={() => purchaseMutation.mutate()}
                      disabled={purchaseMutation.isPending}
                    >
                      {purchaseMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Buy Now
                    </Button>
                  )}
                  
                  {!user && (
                    <Link href="/auth">
                      <Button className="w-full bg-secondary hover:bg-primary">
                        Sign In to Purchase
                      </Button>
                    </Link>
                  )}
                  
                  {user && user.id === nft.ownerId && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 text-sm text-blue-800 dark:text-blue-200">
                      <Eye className="h-4 w-4 inline mr-2" />
                      You own this NFT
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Tabs: Bids, Comments */}
            <Tabs defaultValue="bids" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bids">
                  Bids {bids?.length ? `(${bids.length})` : ""}
                </TabsTrigger>
                <TabsTrigger value="comments">
                  Comments {comments?.length ? `(${comments.length})` : ""}
                </TabsTrigger>
              </TabsList>
              
              {/* Bids Tab */}
              <TabsContent value="bids" className="mt-4">
                {isLoadingBids ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                  </div>
                ) : bids?.length ? (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {bids.map((bid: Bid) => (
                      <div key={bid.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${bid.bidderId}`} />
                            <AvatarFallback>
                              <UserIcon className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link href={`/profile/${bid.bidderId}`}>
                              <p className="font-medium hover:text-secondary transition-colors">
                                User #{bid.bidderId}
                              </p>
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(bid.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold">{bid.amount} {bid.currency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No bids yet</p>
                    {nft.isAuction && user && user.id !== nft.ownerId && (
                      <p className="mt-2 text-sm">Be the first to place a bid!</p>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {/* Comments Tab */}
              <TabsContent value="comments" className="mt-4">
                {user && (
                  <form onSubmit={handleComment} className="mb-6">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 resize-none"
                      rows={3}
                      required
                    />
                    <Button 
                      type="submit" 
                      className="mt-2 bg-secondary hover:bg-primary" 
                      disabled={commentMutation.isPending}
                    >
                      {commentMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Post Comment
                    </Button>
                  </form>
                )}
                
                {!user && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Sign in to leave a comment</p>
                    <Link href="/auth">
                      <Button className="bg-secondary hover:bg-primary">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
                
                {isLoadingComments ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                  </div>
                ) : comments?.length ? (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${comment.userId}`} />
                            <AvatarFallback>
                              <UserIcon className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <Link href={`/profile/${comment.userId}`}>
                              <p className="font-medium hover:text-secondary transition-colors">
                                User #{comment.userId}
                              </p>
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
                    {user && (
                      <p className="mt-2 text-sm">Be the first to comment!</p>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Similar NFTs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">More from this {nft.collectionId ? "Collection" : "Creator"}</h2>
          {isLoadingSimilar ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          ) : similarNFTs?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarNFTs.map((similarNFT: NFT) => (
                <NFTCard key={similarNFT.id} nft={similarNFT} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No similar NFTs found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
