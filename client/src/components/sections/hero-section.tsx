import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans leading-tight mb-4">
              Discover, Collect &<br /> Sell <span className="text-secondary">Digital Art</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              NFTverse is the world's first and largest marketplace for non-fungible tokens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketplace">
                <Button 
                  className="px-8 py-3 bg-secondary hover:bg-primary text-white text-lg font-medium h-auto"
                  size="lg"
                >
                  Explore
                </Button>
              </Link>
              <Link href="/create">
                <Button 
                  variant="outline" 
                  className="px-8 py-3 border-secondary text-secondary hover:bg-secondary/10 text-lg font-medium h-auto"
                  size="lg"
                >
                  Create
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-8 mt-12">
              <div>
                <p className="text-3xl font-bold font-sans">200K+</p>
                <p className="text-gray-600 dark:text-gray-400">Collections</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-sans">10M+</p>
                <p className="text-gray-600 dark:text-gray-400">NFTs</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-sans">2M+</p>
                <p className="text-gray-600 dark:text-gray-400">Users</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            {/* Featured NFT Card */}
            <div className="relative group w-full max-w-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Featured NFT" 
                  className="w-full h-72 object-cover" 
                />
                
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="https://api.dicebear.com/7.x/micah/svg?seed=1" 
                      alt="Creator" 
                      className="w-8 h-8 rounded-full border-2 border-white" 
                    />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Creator</p>
                      <p className="font-medium">@digitalartist</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold font-sans mb-2">Cosmic Perspective #024</h3>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current Bid</p>
                      <p className="text-lg font-bold">2.5 ETH</p>
                    </div>
                    <Link href="/nft/1">
                      <Button className="px-4 py-2 bg-secondary text-white rounded-lg font-medium transition-colors hover:bg-primary">
                        Place Bid
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
