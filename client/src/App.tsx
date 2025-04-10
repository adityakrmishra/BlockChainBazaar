import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import MarketplacePage from "@/pages/marketplace-page";
import ProfilePage from "@/pages/profile-page";
import NFTDetailPage from "@/pages/nft-detail-page";
import CreateNFTPage from "@/pages/create-nft-page";
import CollectionPage from "@/pages/collection-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/marketplace" component={MarketplacePage} />
          <Route path="/nft/:id" component={NFTDetailPage} />
          <Route path="/collection/:id" component={CollectionPage} />
          <ProtectedRoute path="/create" component={CreateNFTPage} />
          <ProtectedRoute path="/profile/:id?" component={ProfilePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="nftverse-theme">
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
