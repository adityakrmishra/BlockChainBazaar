import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AuthForm from "@/components/auth/auth-form";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Auth form column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>

      {/* Hero/info column */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center p-8 md:p-16">
        <div className="max-w-lg">
          <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
            Unlock the World of Digital Collectibles
          </h1>
          <p className="text-xl mb-8">
            Join our vibrant community of creators and collectors in the evolving NFT marketplace.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-sm opacity-80">Digital Artists</div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">200K+</div>
              <div className="text-sm opacity-80">NFT Collections</div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">$500M+</div>
              <div className="text-sm opacity-80">Trading Volume</div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-80">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
