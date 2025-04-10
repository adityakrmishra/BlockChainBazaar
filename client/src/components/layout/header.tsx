import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Search, Bell, Wallet, Menu, X } from "lucide-react";
import { getRandomAvatarUrl } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-gray-900 transition-shadow duration-200 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-poppins font-bold text-lg">NFT</span>
          </div>
          <h1 className="font-poppins font-bold text-2xl hidden sm:block">
            <span className="text-primary">NFT</span>
            <span className="text-secondary">Market</span>
          </h1>
        </div>
        
        {/* Search Bar - Desktop */}
        <div className="relative hidden md:block w-1/4">
          <Input 
            type="text" 
            placeholder="Search items, collections..." 
            className="w-full py-2 px-4 rounded-lg bg-accent dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary transition-all" 
          />
          <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">
            <Search className="h-5 w-5" />
          </span>
        </div>
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-5">
          <Link href="/">
            <span className={`font-medium hover:text-secondary transition-colors cursor-pointer ${location === '/' ? 'text-secondary' : ''}`}>
              Home
            </span>
          </Link>
          <Link href="/marketplace">
            <span className={`font-medium hover:text-secondary transition-colors cursor-pointer ${location === '/marketplace' ? 'text-secondary' : ''}`}>
              Explore
            </span>
          </Link>
          <Link href="/create">
            <span className={`font-medium hover:text-secondary transition-colors cursor-pointer ${location === '/create' ? 'text-secondary' : ''}`}>
              Create
            </span>
          </Link>
          <Link href="/developer">
            <span className={`font-medium hover:text-secondary transition-colors cursor-pointer ${location === '/developer' ? 'text-secondary' : ''}`}>
              Developer
            </span>
          </Link>
        </nav>
        
        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImage || getRandomAvatarUrl(user.id)} alt={user.displayName || user.username} />
                      <AvatarFallback>{(user.displayName || user.username).charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href={`/profile/${user.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer">
                      My Collections
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Favorites
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth">
              <Button className="hidden md:flex items-center space-x-2 bg-secondary hover:bg-primary text-white">
                <Wallet className="mr-2 h-5 w-5" />
                <span>Connect Wallet</span>
              </Button>
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 px-6 shadow-lg">
          <div className="mb-4">
            <Input 
              type="text" 
              placeholder="Search items, collections, and accounts" 
              className="w-full py-2 px-4 rounded-lg bg-accent dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary transition-all" 
            />
          </div>
          
          <nav className="flex flex-col space-y-4">
            <Link href="/">
              <span className={`font-medium hover:text-secondary transition-colors cursor-pointer ${location === '/' ? 'text-secondary' : ''}`} onClick={toggleMenu}>
                Home
              </span>
            </Link>
            <Link href="/marketplace">
              <span className={`font-medium hover:text-secondary transition-colors cursor-pointer ${location === '/marketplace' ? 'text-secondary' : ''}`} onClick={toggleMenu}>
                Explore
              </span>
            </Link>
            <Link href="/create">
              <span className={`font-medium hover:text-secondary transition-colors cursor-pointer ${location === '/create' ? 'text-secondary' : ''}`} onClick={toggleMenu}>
                Create
              </span>
            </Link>
            <Link href="/developer">
              <span className={`font-medium hover:text-secondary transition-colors cursor-pointer ${location === '/developer' ? 'text-secondary' : ''}`} onClick={toggleMenu}>
                Developer
              </span>
            </Link>
            
            {user ? (
              <>
                <Link href={`/profile/${user.id}`}>
                  <span className="font-medium hover:text-secondary transition-colors cursor-pointer" onClick={toggleMenu}>
                    Profile
                  </span>
                </Link>
                <button 
                  className="font-medium text-left text-destructive hover:text-red-700 transition-colors" 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/auth">
                <span className="font-medium text-secondary hover:underline cursor-pointer" onClick={toggleMenu}>
                  Connect Wallet
                </span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
