import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { WalletModal } from "./wallet-modal";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logoutMutation } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState(false);

  if (!isOpen) return null;
  
  const handleWalletClick = () => {
    setShowWalletModal(true);
    onClose();
  };
  
  return (
    <>
      <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
          <Link href="/" onClick={onClose}>
            <Button variant="ghost" className="justify-start w-full">Home</Button>
          </Link>
          
          <Link href="/marketplace" onClick={onClose}>
            <Button variant="ghost" className="justify-start w-full">Explore</Button>
          </Link>
          
          <Link href="/create" onClick={onClose}>
            <Button variant="ghost" className="justify-start w-full">Create</Button>
          </Link>
          
          {user ? (
            <>
              <Link href={`/profile/${user.id}`} onClick={onClose}>
                <Button variant="ghost" className="justify-start w-full">Profile</Button>
              </Link>
              
              <Button 
                variant="ghost" 
                className="justify-start w-full"
                onClick={handleWalletClick}
              >
                Wallet
              </Button>
              
              <Button 
                variant="ghost"
                className="justify-start w-full text-red-500"
                onClick={() => {
                  logoutMutation.mutate();
                  onClose();
                }}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth" onClick={onClose}>
                <Button variant="ghost" className="justify-start w-full">Sign In</Button>
              </Link>
              
              <Button 
                className="mt-2 w-full bg-secondary hover:bg-primary"
                onClick={handleWalletClick}
              >
                Connect Wallet
              </Button>
            </>
          )}
        </div>
      </div>
      
      <WalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </>
  );
}
