import CreateNftForm from "@/components/nft/create-nft-form";

export default function CreateNftPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold font-poppins mb-6">Create New NFT</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
        Create your unique NFT to list on the marketplace. Fill in the details below to mint your digital asset.
      </p>
      
      <CreateNftForm />
    </div>
  );
}
