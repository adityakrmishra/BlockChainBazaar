import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Search, Menu, Sun, Moon, Wallet } from "lucide-react";
import { MobileMenu } from "./mobile-menu";
import { WalletModal } from "./wallet-modal";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.6 3.6c-1.5-1.5-3.8-2.3-6.1-1.9-2.2 0.4-4.2 1.8-5.3 3.8-1.1 2-1.1 4.4 0 6.6 1.2 2.2 3.4 3.8 5.9 4.2h0.2c0.7 0 1.2-0.5 1.2-1.2s-0.5-1.2-1.2-1.2h-0.2c-1.8-0.3-3.4-1.5-4.3-3.2-0.8-1.6-0.8-3.5 0-5.1 0.8-1.5 2.3-2.5 3.9-2.8 1.8-0.3 3.5 0.3 4.6 1.4 1.7 1.7 2 4.5 0.7 6.5-0.6 0.9-0.6 1.5-0.6 1.8 0 0.5 0.2 0.9 0.6 1.1 0.5 0.3 1 0.3 1.4 0.1 0.5-0.2 0.9-0.7 0.9-1.3-0.1-1 0.1-2 0.8-3.1 1.8-2.8 1.5-6.7-1.5-9.7z"/>
              <path d="M12 11.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4z"/>
            </svg>
            <span className="text-xl font-bold font-sans tracking-tight text-primary dark:text-white">NFTverse</span>
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Input 
              type="text"
              placeholder="Search for NFTs, collections, or creators"
              className="w-full pl-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 md:gap-3">
          {/* Mobile Search Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Desktop Nav Links */}
          <Link href="/marketplace">
            <Button 
              variant="ghost" 
              className={`hidden md:flex ${location === '/marketplace' ? 'text-secondary' : ''}`}
            >
              Explore
            </Button>
          </Link>
          
          <Link href="/create">
            <Button 
              variant="ghost" 
              className={`hidden md:flex ${location === '/create' ? 'text-secondary' : ''}`}
            >
              Create
            </Button>
          </Link>
          
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* Connect Wallet/Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 md:p-2 rounded-full">
                  <img 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${user.id}`} 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full border-2 border-secondary" 
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/profile/${user.id}`}>
                  <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                </Link>
                <Link href="/create">
                  <DropdownMenuItem className="cursor-pointer">Create NFT</DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => setShowWalletModal(true)}
                >
                  Wallet
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                className="hidden md:flex items-center gap-2 bg-secondary hover:bg-primary"
                onClick={() => setShowWalletModal(true)}
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
              
              <Link href="/auth">
                <Button variant="outline" className="hidden md:flex">
                  Sign In
                </Button>
              </Link>
            </>
          )}
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </nav>
      </div>
      
      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="relative w-full">
            <Input 
              type="text"
              placeholder="Search for NFTs, collections, or creators"
              className="w-full pl-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      
      {/* Wallet Modal */}
      <WalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </header>
  );
}
