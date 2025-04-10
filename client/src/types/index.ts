export interface NFTFilters {
  status?: string[];
  minPrice?: number;
  maxPrice?: number;
  collections?: string[];
  categories?: string[];
}

export interface NftMetadata {
  name: string;
  description: string;
  image: string;
  properties?: Record<string, string>;
}

export interface CreatorStats {
  artworks: number;
  sales: number;
  volumeEth: number;
}

export interface NftWithDetails {
  id: number;
  name: string;
  description: string;
  image: string;
  creatorId: number;
  creator?: {
    id: number;
    username: string;
    displayName: string;
    profileImage: string;
  };
  ownerId: number;
  owner?: {
    id: number;
    username: string;
    displayName: string;
    profileImage: string;
  };
  price: number | null;
  status: string;
  collection: string | null;
  properties: Record<string, string> | null;
  createdAt: string;
  auction?: {
    id: number;
    startingPrice: number;
    currentPrice: number;
    endTime: string;
  };
  bids?: {
    id: number;
    bidderId: number;
    amount: number;
    createdAt: string;
  }[];
}
