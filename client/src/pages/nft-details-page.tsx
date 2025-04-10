import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Heart, Share2, Clock, ArrowUpRight, MessageSquare } from "lucide-react";
import { formatEth, getNftImageUrl, getRandomAvatarUrl } from "@/lib/utils";
import EthIcon from "@/components/ui/eth-icon";
import Countdown from "@/components/ui/countdown";
import { NFT, Auction, Bid, User, Comment } from "@shared/schema";

export default function NftDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [commentText, setCommentText] = useState("");
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  
  // Fetch NFT details
  const { data: nft, isLoading: isLoadingNft } = useQuery<NFT>({
    queryKey: [`/api/nfts/${id}`],
    enabled: !!id,
  });
  
  // Fetch creator and owner details
  const { data: creator } = useQuery<User>({
    queryKey: [`/api/users/${nft?.creatorId}`],
    enabled: !!nft?.creatorId,
  });
  
  const { data: owner } = useQuery<User>({
    queryKey: [`/api/users/${nft?.ownerId}`],
    enabled: !!nft?.ownerId,
  });
  
  // Fetch auction details if NFT is auctioning
  const { data: auction } = useQuery<Auction>({
    queryKey: [`/api/auctions/by-nft/${id}`],
    enabled: !!id && nft?.status === "auctioning",
  });
  
  // Fetch bids if there's an auction
  const { data: bids } = useQuery<Bid[]>({
    queryKey: [`/api/auctions/${auction?.id}/bids`],
    enabled: !!auction?.id,
  });
  
  // Fetch comments on this NFT
  const { data: comments, isLoading: isLoadingComments } = useQuery<Comment[]>({
    queryKey: [`/api/nfts/${id}/comments`],
    enabled: !!id,
  });
  
  // Bid mutation
  const bidMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!auction) throw new Error("No active auction found");
      return apiRequest("POST", "/api/bids", {
        auctionId: auction.id,
        bidderId: user?.id,
        amount
      });
    },
    onSuccess: () => {
      toast({
        title: "Bid placed successfully",
        description: `Your bid of ${bidAmount} ETH has been placed.`,
      });
      setBidAmount("");
      setIsBidDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/auctions/${auction?.id}/bids`] });
      queryClient.invalidateQueries({ queryKey: [`/api/auctions/by-nft/${id}`] });
    },
    onError: (error) => {
      toast({
        title: "Error placing bid",
        description: error.message || "Your bid could not be placed.",
        variant: "destructive",
      });
    },
  });
  
  // Buy NFT mutation
  const buyNftMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/nfts/${id}/buy`, {});
    },
    onSuccess: () => {
      toast({
        title: "NFT purchased successfully",
        description: "Congratulations! You now own this NFT.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/nfts/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/nfts`] });
    },
    onError: (error) => {
      toast({
        title: "Error purchasing NFT",
        description: error.message || "The NFT could not be purchased.",
        variant: "destructive",
      });
    },
  });
  
  // Post comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/comments", {
        nftId: parseInt(id),
        userId: user?.id,
        content
      });
    },
    onSuccess: () => {
      toast({
        title: "Comment posted",
        description: "Your comment has been added.",
      });
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`/api/nfts/${id}/comments`] });
    },
    onError: (error) => {
      toast({
        title: "Error posting comment",
        description: error.message || "Your comment could not be posted.",
        variant: "destructive",
      });
    },
  });
  
  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place a bid.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid bid amount",
        description: "Please enter a valid bid amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (auction && amount <= auction.currentPrice) {
      toast({
        title: "Bid too low",
        description: `Bid must be higher than the current bid (${auction.currentPrice} ETH).`,
        variant: "destructive",
      });
      return;
    }
    
    bidMutation.mutate(amount);
  };
  
  const handleBuyNft = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase this NFT.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    buyNftMutation.mutate();
  };
  
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!commentText.trim()) {
      toast({
        title: "Comment cannot be empty",
        description: "Please enter a valid comment.",
        variant: "destructive",
      });
      return;
    }
    
    commentMutation.mutate(commentText);
  };
  
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "NFT removed from your favorites" : "NFT added to your favorites",
    });
  };
  
  const handleShareNft = () => {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied",
        description: "NFT link copied to clipboard",
      });
    });
  };
  
  if (isLoadingNft) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-12">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      </div>
    );
  }
  
  if (!nft) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">NFT Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The NFT you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/marketplace")}
            className="bg-secondary hover:bg-primary text-white"
          >
            Explore Marketplace
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - NFT Image */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={getNftImageUrl(nft.image)} 
              alt={nft.name} 
              className="w-full object-contain max-h-[600px]"
            />
          </div>
        </div>
        
        {/* Right Column - NFT Details */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold font-poppins mb-2">{nft.name}</h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="capitalize px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-sm mr-2">
                  {nft.status}
                </span>
                {nft.collection && (
                  <span className="text-sm">
                    Collection: <span className="font-medium">{nft.collection}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleLikeToggle}
                className="rounded-full"
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShareNft}
                className="rounded-full"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="mr-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Creator</p>
              <div className="flex items-center mt-1">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage 
                    src={creator?.profileImage || getRandomAvatarUrl(nft.creatorId)} 
                    alt={creator?.displayName || "Creator"} 
                  />
                  <AvatarFallback>
                    {(creator?.displayName?.[0] || "C").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <a 
                  href={`/profile/${nft.creatorId}`} 
                  className="text-secondary hover:underline"
                >
                  {creator?.displayName || creator?.username || `Creator #${nft.creatorId}`}
                </a>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
              <div className="flex items-center mt-1">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage 
                    src={owner?.profileImage || getRandomAvatarUrl(nft.ownerId)} 
                    alt={owner?.displayName || "Owner"} 
                  />
                  <AvatarFallback>
                    {(owner?.displayName?.[0] || "O").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <a 
                  href={`/profile/${nft.ownerId}`} 
                  className="text-secondary hover:underline"
                >
                  {owner?.displayName || owner?.username || `Owner #${nft.ownerId}`}
                </a>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {nft.description || "No description provided."}
            </p>
          </div>
          
          {/* If NFT is on auction */}
          {nft.status === "auctioning" && auction && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-secondary" />
                  Live Auction
                </CardTitle>
                <CardDescription>
                  Place your bid before the auction ends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Bid</p>
                    <div className="flex items-center">
                      <EthIcon className="mr-2" />
                      <span className="text-2xl font-bold">{formatEth(auction.currentPrice)}</span>
                    </div>
                  </div>
                  <Countdown 
                    endTime={auction.endTime} 
                    onEnd={() => {
                      toast({
                        title: "Auction ended",
                        description: "This auction has ended.",
                      });
                      queryClient.invalidateQueries({ queryKey: [`/api/nfts/${id}`] });
                    }} 
                  />
                </div>
                
                {bids && bids.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">{bids.length} bids so far</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {bids.map((bid, index) => (
                        <div key={bid.id} className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={getRandomAvatarUrl(bid.bidderId)} />
                              <AvatarFallback>
                                {`B${bid.bidderId}`}
                              </AvatarFallback>
                            </Avatar>
                            <span>Bidder #{bid.bidderId}</span>
                          </div>
                          <div className="flex items-center">
                            <EthIcon size="sm" className="mr-1" />
                            <span>{bid.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-secondary hover:bg-primary">
                      Place Bid
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Place a Bid</DialogTitle>
                      <DialogDescription>
                        Enter your bid amount. It must be higher than the current bid.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBidSubmit}>
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden my-4">
                        <div className="w-1/5 px-3 py-2 border-r border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center">
                          <EthIcon size="sm" className="mr-2" />
                          <span>ETH</span>
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={`Min: ${(auction.currentPrice + 0.01).toFixed(2)}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="border-0 w-4/5"
                          required
                        />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <p>
                          You must bid at least{" "}
                          <span className="font-medium">
                            {formatEth(auction.currentPrice + 0.01)}
                          </span>
                        </p>
                        <p className="mt-1">Service fee: 2.5%</p>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsBidDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-secondary hover:bg-primary"
                          disabled={bidMutation.isPending}
                        >
                          {bidMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Place Bid"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          )}
          
          {/* If NFT is listed for sale */}
          {nft.status === "listed" && nft.price && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Current Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <EthIcon className="mr-2" />
                  <span className="text-2xl font-bold">{formatEth(nft.price)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-secondary hover:bg-primary"
                  onClick={handleBuyNft}
                  disabled={buyNftMutation.isPending || (user?.id === nft.ownerId)}
                >
                  {buyNftMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : user?.id === nft.ownerId ? (
                    "You Own This NFT"
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* NFT Details Tabs */}
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-4 border rounded-b-md">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contract Address</span>
                  <span className="font-mono">0x1234...5678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Token ID</span>
                  <span>{nft.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Token Standard</span>
                  <span>ERC-721</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Blockchain</span>
                  <span>Ethereum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span>{new Date(nft.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="properties" className="p-4 border rounded-b-md">
              {nft.properties && Object.keys(nft.properties).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(nft.properties).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-secondary/10 p-3 rounded-md text-center"
                    >
                      <p className="text-xs text-gray-500 uppercase">{key}</p>
                      <p className="font-medium truncate">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No properties found</p>
              )}
            </TabsContent>
            <TabsContent value="history" className="p-4 border rounded-b-md">
              <p className="text-gray-500 dark:text-gray-400">
                Transaction history will appear here
              </p>
            </TabsContent>
          </Tabs>
          
          {/* Comments section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Comments
            </h2>
            
            {user ? (
              <form onSubmit={handlePostComment} className="mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-2"
                />
                <Button 
                  type="submit"
                  className="bg-secondary hover:bg-primary"
                  disabled={commentMutation.isPending}
                >
                  {commentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Post Comment
                </Button>
              </form>
            ) : (
              <div className="bg-accent/20 p-4 rounded-md mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please{" "}
                  <a href="/auth" className="text-secondary hover:underline">
                    sign in
                  </a>{" "}
                  to leave a comment.
                </p>
              </div>
            )}
            
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-secondary" />
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={getRandomAvatarUrl(comment.userId)} />
                        <AvatarFallback>
                          {`U${comment.userId}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <a
                          href={`/profile/${comment.userId}`}
                          className="text-sm font-medium hover:text-secondary"
                        >
                          User #{comment.userId}
                        </a>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 pl-10">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Related NFTs Section - Would be added here */}
    </div>
  );
}
