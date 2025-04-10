import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/ui/creator-card";
import { User } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function TopCreators() {
  // In a real application, you would have an API endpoint to fetch top creators
  // For now, we'll use the regular users endpoint and sort/filter on the client side
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['/api/users'],
  });
  
  // We'll consider "top creators" as users who have created NFTs
  // In a real app, you'd have a dedicated endpoint with metrics
  const topCreators = users ? 
    users.filter((user: User) => user.id <= 4) : // Simplified logic for demo purposes
    [];

  return (
    <section className="py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-sans">Top Creators</h2>
          <Link href="/marketplace">
            <Button variant="link" className="text-secondary hover:underline font-medium">
              View All
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">Error loading creators. Please try again later.</p>
          </div>
        ) : topCreators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topCreators.map((creator: User) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No creators found yet.</p>
            <Link href="/auth">
              <Button variant="link" className="mt-2 text-secondary">
                Sign up to become a creator
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
