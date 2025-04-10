import { NFT } from "@shared/schema";
import NftCard from "./nft-card";

interface NftGridProps {
  nfts: NFT[];
  viewMode?: "grid" | "list";
}

export default function NftGrid({ nfts, viewMode = "grid" }: NftGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No NFTs found.</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col space-y-4">
        {nfts.map((nft) => (
          <div 
            key={nft.id} 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all flex"
          >
            <div className="w-1/4">
              <img 
                src={`https://source.unsplash.com/random/400x400/?nft,digital,art&sig=${nft.image}`}
                alt={nft.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-poppins font-semibold text-xl mb-2">{nft.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {nft.description || "No description available"}
                </p>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nft.creatorId}`}
                      alt="Creator" 
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Creator ID: {nft.creatorId}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {nft.status === "listed" ? "Price" : "Status"}
                  </span>
                  <div className="flex items-center">
                    {nft.price && (
                      <>
                        <svg 
                          className="w-4 h-4 mr-1" 
                          viewBox="0 0 256 417" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fill="#343434" d="M127.9611 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
                          <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
                        </svg>
                        <span className="font-medium">{nft.price} ETH</span>
                      </>
                    )}
                    {!nft.price && (
                      <span className="font-medium capitalize">{nft.status}</span>
                    )}
                  </div>
                </div>
                {nft.status === "listed" && (
                  <button className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Buy Now
                  </button>
                )}
                {nft.status === "auctioning" && (
                  <button className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Place Bid
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {nfts.map((nft) => (
        <NftCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}
