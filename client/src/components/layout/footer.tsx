import { Link } from "wouter";
import { FaTwitter, FaInstagram, FaDiscord, FaTelegram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-lg">NFT</span>
              </div>
              <h2 className="font-poppins font-bold text-xl">
                <span className="text-primary">NFT</span>
                <span className="text-secondary">Market</span>
              </h2>
            </div>
            <p className="text-gray-400 mb-4">
              The world's largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs).
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaDiscord size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTelegram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Marketplace</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/marketplace"><a className="hover:text-white transition-colors">All NFTs</a></Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Art</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Collectibles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Domain Names</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Music</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Photography</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">My Account</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Profile</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Favorites</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Watchlist</a></li>
              <li><a href="#" className="hover:text-white transition-colors">My Collections</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Settings</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Platform Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} NFTMarket, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
