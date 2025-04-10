import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertNftSchema, Collection } from "@shared/schema";
import { Loader2, CalendarIcon } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { useLocation } from "wouter";

// Extend the NFT schema for the form
const nftFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500, "Description must be less than 500 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  collectionId: z.number().optional(),
  price: z.coerce.number().min(0.001, "Price must be at least 0.001"),
  currency: z.string().default("ETH"),
  isAuction: z.boolean().default(false),
  auctionEndTime: z.date().optional(),
});

type NftFormData = z.infer<typeof nftFormSchema>;

export default function NFTForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [previewUrl, setPreviewUrl] = useState("");
  
  // Fetch user's collections
  const { data: collections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ['/api/users', user?.id, 'collections'],
    enabled: !!user
  });
  
  // Form setup
  const form = useForm<NftFormData>({
    resolver: zodResolver(nftFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: 0.1,
      currency: "ETH",
      isAuction: false,
    },
  });
  
  // Watch auction toggle to conditionally show fields
  const isAuction = form.watch("isAuction");
  
  // Handle image URL change for preview
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
    form.setValue("imageUrl", url);
  };
  
  // Create NFT mutation
  const createNFTMutation = useMutation({
    mutationFn: async (data: NftFormData) => {
      return await apiRequest("POST", "/api/nfts", data);
    },
    onSuccess: () => {
      toast({
        title: "NFT Created",
        description: "Your NFT has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/nfts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'created'] });
      navigate("/marketplace");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create NFT. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (data: NftFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an NFT",
        variant: "destructive",
      });
      return;
    }
    
    createNFTMutation.mutate(data);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter NFT name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your NFT" 
                      className="resize-none" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter image URL" 
                      type="url"
                      value={field.value}
                      onChange={handleImageUrlChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a URL for your NFT image. Use a high-quality image for best results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingCollections || !collections?.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collection" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {collections?.map((collection: Collection) => (
                        <SelectItem key={collection.id} value={collection.id.toString()}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {isLoadingCollections 
                      ? "Loading collections..."
                      : !collections?.length
                        ? "You don't have any collections yet. You can still create an NFT without a collection."
                        : "Select a collection for your NFT."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.001"
                        min="0.001"
                        placeholder="0.1" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ETH" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="MATIC">MATIC</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isAuction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Auction</FormLabel>
                    <FormDescription>
                      Turn on auction mode to allow bidding on your NFT.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isAuction && (
              <FormField
                control={form.control}
                name="auctionEndTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Auction End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select when the auction will end.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-primary"
              disabled={createNFTMutation.isPending}
            >
              {createNFTMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating NFT...
                </>
              ) : (
                "Create NFT"
              )}
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="order-first md:order-last">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 sticky top-24">
          <h3 className="text-xl font-bold mb-4">Preview</h3>
          {previewUrl ? (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
              <div className="relative aspect-square">
                <img 
                  src={previewUrl} 
                  alt="NFT Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Invalid+Image+URL";
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg">{form.watch("name") || "Untitled NFT"}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {form.watch("description") || "No description provided"}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                    <p className="font-medium">{form.watch("price") || 0} {form.watch("currency")}</p>
                  </div>
                  {form.watch("isAuction") && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Auction</p>
                      <p className="text-sm text-secondary font-medium">Enabled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Enter an image URL to preview your NFT</p>
            </div>
          )}
          
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Tips for Creating a Successful NFT:</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-secondary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Use high-resolution images (3000x3000px recommended)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-secondary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Write a detailed description to help buyers understand your work</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-secondary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Set a fair price based on your reputation and the quality of your work</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-secondary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Consider enabling auctions for rare or high-value pieces</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
