import { Link } from "wouter";
import { Twitter, Instagram, Youtube } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.6 3.6c-1.5-1.5-3.8-2.3-6.1-1.9-2.2 0.4-4.2 1.8-5.3 3.8-1.1 2-1.1 4.4 0 6.6 1.2 2.2 3.4 3.8 5.9 4.2h0.2c0.7 0 1.2-0.5 1.2-1.2s-0.5-1.2-1.2-1.2h-0.2c-1.8-0.3-3.4-1.5-4.3-3.2-0.8-1.6-0.8-3.5 0-5.1 0.8-1.5 2.3-2.5 3.9-2.8 1.8-0.3 3.5 0.3 4.6 1.4 1.7 1.7 2 4.5 0.7 6.5-0.6 0.9-0.6 1.5-0.6 1.8 0 0.5 0.2 0.9 0.6 1.1 0.5 0.3 1 0.3 1.4 0.1 0.5-0.2 0.9-0.7 0.9-1.3-0.1-1 0.1-2 0.8-3.1 1.8-2.8 1.5-6.7-1.5-9.7z"/>
                <path d="M12 11.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4z"/>
              </svg>
              <span className="text-xl font-bold font-sans tracking-tight text-primary dark:text-white">NFTverse</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The world's first and largest NFT marketplace for crypto collectibles and non-fungible tokens.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <FaDiscord className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li><Link href="/marketplace" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">All NFTs</Link></li>
              <li><Link href="/marketplace?category=art" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Art</Link></li>
              <li><Link href="/marketplace?category=music" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Music</Link></li>
              <li><Link href="/marketplace?category=photography" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Photography</Link></li>
              <li><Link href="/marketplace?category=sports" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Sports</Link></li>
              <li><Link href="/marketplace?category=collectibles" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Collectibles</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/profile" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Profile</Link></li>
              <li><Link href="/profile?tab=collections" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">My Collections</Link></li>
              <li><Link href="/profile?tab=favorites" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Favorites</Link></li>
              <li><Link href="/profile?tab=watchlist" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Watchlist</Link></li>
              <li><Link href="/profile?tab=settings" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Settings</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Platform Status</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Partners</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors">Newsletter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} NFTverse, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 dark:text-gray-400 text-sm hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 text-sm hover:text-secondary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
