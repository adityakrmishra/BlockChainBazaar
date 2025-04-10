import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wallet, ImageIcon, Tag } from "lucide-react";

export default function CreateAndSell() {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Create and Sell Your NFTs</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join the NFT revolution. Create, collect, and trade your digital assets securely on our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <Wallet className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-sans mb-3">Setup Your Wallet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with MetaMask or other compatible wallets to manage your digital assets and transactions.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-sans mb-3">Create Your Collection</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your artwork, set properties, and customize your NFTs with our easy-to-use creation tools.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <Tag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-sans mb-3">List for Sale</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set your price, choose between auctions or fixed price listings, and start selling to collectors worldwide.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/create">
            <Button className="px-8 py-3 bg-secondary hover:bg-primary text-white text-lg font-medium h-auto">
              Start Creating
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
