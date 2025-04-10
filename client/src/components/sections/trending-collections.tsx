import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CollectionCard } from "@/components/ui/collection-card";
import { Collection } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function TrendingCollections() {
  // Fetch collections from the API
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['/api/collections'],
  });

  return (
    <section className="py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-sans">Trending Collections</h2>
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
            <p className="text-red-600 dark:text-red-400">Error loading collections. Please try again later.</p>
          </div>
        ) : collections && collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.slice(0, 4).map((collection: Collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          // Default display with dummy content if no collections exist yet
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder for empty state */}
            <div className="text-center py-12 col-span-full bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No collections available yet.</p>
              <Link href="/create">
                <Button variant="link" className="mt-2 text-secondary">
                  Create the first collection
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
