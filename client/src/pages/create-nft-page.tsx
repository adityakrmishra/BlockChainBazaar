import { Helmet } from "react-helmet";
import NFTForm from "@/components/forms/nft-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CreateNFTPage() {
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>Create NFT | NFTverse</title>
        <meta name="description" content="Create and mint your unique digital assets as NFTs on the NFTverse marketplace." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New NFT</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Mint your digital creation as an NFT and publish it to the marketplace
          </p>
        </div>
        
        {user ? (
          <NFTForm />
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4">Authentication Required</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You need to be logged in to create and mint NFTs.
            </p>
            <Link href="/auth">
              <Button className="bg-secondary hover:bg-primary">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
