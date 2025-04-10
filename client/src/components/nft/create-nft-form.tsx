import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
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
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import { insertNftSchema } from "@shared/schema";

// Extended schema for NFT creation form
const createNftSchema = insertNftSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(5, "Image URL is required"),
  price: z.number().optional(),
  collection: z.string().optional(),
  propertiesArray: z
    .array(
      z.object({
        key: z.string().min(1, "Property key is required"),
        value: z.string().min(1, "Property value is required"),
      })
    )
    .optional(),
  listForSale: z.boolean().default(false),
  startAuction: z.boolean().default(false),
  auctionEndTime: z.string().optional(),
});

type CreateNftFormValues = z.infer<typeof createNftSchema>;

export default function CreateNftForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [properties, setProperties] = useState<{ key: string; value: string }[]>([]);

  // Fetch user collections
  const { data: collections } = useQuery({
    queryKey: [`/api/users/${user?.id}/collections`],
    enabled: !!user?.id,
  });

  const form = useForm<CreateNftFormValues>({
    resolver: zodResolver(createNftSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: undefined,
      collection: "",
      propertiesArray: [],
      creatorId: user?.id,
      ownerId: user?.id,
      status: "minted",
      listForSale: false,
      startAuction: false,
      auctionEndTime: "",
    },
  });

  // Initialize form values when user is loaded
  React.useEffect(() => {
    if (user) {
      form.setValue("creatorId", user.id);
      form.setValue("ownerId", user.id);
    }
  }, [user, form]);

  // Create NFT mutation
  const createNftMutation = useMutation({
    mutationFn: async (nftData: any) => {
      const res = await apiRequest("POST", "/api/nfts", nftData);
      return res.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "NFT Created Successfully",
        description: "Your NFT has been created and added to your collection.",
      });

      // Handle listing or auction if selected
      if (form.getValues("listForSale")) {
        await apiRequest("POST", `/api/nfts/${data.id}/list`, {
          price: form.getValues("price"),
        });
      } else if (form.getValues("startAuction")) {
        await apiRequest("POST", "/api/auctions", {
          nftId: data.id,
          startingPrice: form.getValues("price"),
          currentPrice: form.getValues("price"),
          endTime: form.getValues("auctionEndTime"),
        });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/nfts`] });
      
      // Navigate to the newly created NFT
      navigate(`/nft/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error Creating NFT",
        description: error.message || "An error occurred while creating your NFT.",
        variant: "destructive",
      });
    },
  });

  // Add property input fields
  const addProperty = () => {
    setProperties([...properties, { key: "", value: "" }]);
  };

  // Remove property at index
  const removeProperty = (index: number) => {
    const newProperties = [...properties];
    newProperties.splice(index, 1);
    setProperties(newProperties);
  };

  // Update property at index
  const updateProperty = (index: number, field: "key" | "value", value: string) => {
    const newProperties = [...properties];
    newProperties[index][field] = value;
    setProperties(newProperties);
    
    // Update form value
    form.setValue("propertiesArray", newProperties);
  };

  // Handle image input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue("image", url);
    setImagePreview(url);
  };

  // Toggle listing for sale
  const toggleListForSale = (value: boolean) => {
    form.setValue("listForSale", value);
    if (value) {
      form.setValue("startAuction", false);
    }
  };

  // Toggle starting auction
  const toggleStartAuction = (value: boolean) => {
    form.setValue("startAuction", value);
    if (value) {
      form.setValue("listForSale", false);
      
      // Set default end time to 3 days from now if not set
      if (!form.getValues("auctionEndTime")) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        form.setValue("auctionEndTime", endDate.toISOString().slice(0, 16));
      }
    }
  };

  // Submit handler
  const onSubmit = (data: CreateNftFormValues) => {
    // Convert properties array to object for storage
    const propertiesObject = properties.reduce(
      (obj, item) => ({ ...obj, [item.key]: item.value }),
      {}
    );

    // Prepare NFT data
    const nftData = {
      name: data.name,
      description: data.description,
      image: data.image,
      creatorId: user?.id,
      ownerId: user?.id,
      price: data.listForSale || data.startAuction ? data.price : null,
      status: data.listForSale ? "listed" : (data.startAuction ? "auctioning" : "minted"),
      collection: data.collection || null,
      properties: Object.keys(propertiesObject).length > 0 ? propertiesObject : null,
    };

    createNftMutation.mutate(nftData);
  };

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">Please log in to create NFTs</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Upload and Preview */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-poppins font-semibold text-lg mb-4">Upload File</h3>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter image URL" 
                          {...field} 
                          onChange={handleImageChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a URL to your NFT image (PNG, JPG, GIF)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {imagePreview && (
                  <div className="mt-4">
                    <img 
                      src={imagePreview} 
                      alt="NFT Preview" 
                      className="max-h-80 max-w-full mx-auto rounded-lg object-contain"
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                )}
                
                {!imagePreview && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mt-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Enter an image URL above to preview
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      PNG, JPG, GIF, WEBP formats supported
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-poppins font-semibold text-lg mb-4">Properties (Optional)</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.
                </p>
                
                {properties.map((property, index) => (
                  <div key={index} className="flex space-x-2 mb-3">
                    <Input
                      placeholder="Type"
                      value={property.key}
                      onChange={(e) => updateProperty(index, "key", e.target.value)}
                      className="w-1/2"
                    />
                    <Input
                      placeholder="Value"
                      value={property.value}
                      onChange={(e) => updateProperty(index, "value", e.target.value)}
                      className="w-1/2"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeProperty(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProperty}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Form fields */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-poppins font-semibold text-lg mb-4">NFT Details</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of your item" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The description will be included on the item's detail page.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="collection"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Collection</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select collection (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No Collection</SelectItem>
                          {collections && collections.map((collection) => (
                            <SelectItem key={collection.id} value={collection.name}>
                              {collection.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Adding to a collection helps organize your NFTs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Listing Options</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 border rounded-md">
                      <input
                        type="checkbox"
                        id="listForSale"
                        className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary mt-1"
                        checked={form.watch("listForSale")}
                        onChange={(e) => toggleListForSale(e.target.checked)}
                      />
                      <div>
                        <label htmlFor="listForSale" className="font-medium block mb-1">
                          List for sale
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Your NFT will be listed at a fixed price
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 border rounded-md">
                      <input
                        type="checkbox"
                        id="startAuction"
                        className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary mt-1"
                        checked={form.watch("startAuction")}
                        onChange={(e) => toggleStartAuction(e.target.checked)}
                      />
                      <div>
                        <label htmlFor="startAuction" className="font-medium block mb-1">
                          Start an auction
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow users to place bids on your NFT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {(form.watch("listForSale") || form.watch("startAuction")) && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>
                          {form.watch("listForSale") ? "Sale Price" : "Starting Price"}*
                        </FormLabel>
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          <div className="w-1/5 px-3 py-2 border-r border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                            ETH
                          </div>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder="Amount" 
                              className="border-0 w-4/5" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Service fee: 2.5%
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {form.watch("startAuction") && (
                  <FormField
                    control={form.control}
                    name="auctionEndTime"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Auction End Time*</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The auction will automatically end at this time
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-secondary hover:bg-primary"
                  disabled={createNftMutation.isPending}
                >
                  {createNftMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create NFT"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
