import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type WalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type WalletOption = {
  name: string;
  icon: string;
  onClick: () => void;
};

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { toast } = useToast();
  
  const handleWalletConnect = (walletName: string) => {
    toast({
      title: "Wallet Connection",
      description: `This is a mock connection to ${walletName}. Real blockchain integration would be implemented here.`,
    });
    onClose();
  };
  
  const walletOptions: WalletOption[] = [
    {
      name: "MetaMask",
      icon: "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg",
      onClick: () => handleWalletConnect("MetaMask")
    },
    {
      name: "WalletConnect",
      icon: "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.svg",
      onClick: () => handleWalletConnect("WalletConnect")
    },
    {
      name: "Trust Wallet",
      icon: "https://trustwallet.com/assets/images/media/assets/trust_platform.svg",
      onClick: () => handleWalletConnect("Trust Wallet")
    }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect with one of our available wallet providers or create a new one.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full py-3 px-4 justify-between h-auto"
              onClick={wallet.onClick}
            >
              <div className="flex items-center gap-3">
                <img src={wallet.icon} alt={wallet.name} className="w-8 h-8" />
                <span className="font-medium">{wallet.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Button>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          By connecting your wallet, you agree to our <a href="#" className="text-secondary hover:underline">Terms of Service</a> and <a href="#" className="text-secondary hover:underline">Privacy Policy</a>.
        </p>
      </DialogContent>
    </Dialog>
  );
}
