import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import MarketplacePage from "@/pages/marketplace-page";
import NftDetailsPage from "@/pages/nft-details-page";
import ProfilePage from "@/pages/profile-page";
import CreateNftPage from "@/pages/create-nft-page";
import DeveloperPage from "@/pages/developer-page";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/marketplace" component={MarketplacePage} />
      <Route path="/nft/:id" component={NftDetailsPage} />
      <Route path="/profile/:id" component={ProfilePage} />
      <ProtectedRoute path="/create" component={CreateNftPage} />
      <Route path="/developer" component={DeveloperPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
