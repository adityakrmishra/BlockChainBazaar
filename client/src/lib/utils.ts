import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEth(amount: number): string {
  return `${amount.toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 4 
  })} ETH`;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function calculateTimeLeft(endTime: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasEnded: boolean;
} {
  const endTimeDate = typeof endTime === 'string' ? new Date(endTime) : endTime;
  const difference = endTimeDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasEnded: true };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    hasEnded: false,
  };
}

export function getRandomAvatarUrl(seed: string | number): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

export function getNftImageUrl(imageUrl: string): string {
  // If it's a full URL, return it
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // For now, return a placeholder image for NFTs
  return `https://source.unsplash.com/random/800x800/?nft,digital,art&sig=${imageUrl}`;
}

export function getCollectionImageUrl(imageUrl: string): string {
  // If it's a full URL, return it
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // For now, return a placeholder image for collections
  return `https://source.unsplash.com/random/800x400/?collection&sig=${imageUrl}`;
}
