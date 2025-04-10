import { useEffect } from "react";
import { Redirect } from "wouter";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  
  // Redirect if already logged in
  if (!isLoading && user) {
    return <Redirect to="/" />;
  }
  
  return (
    <>
      <Helmet>
        <title>Sign In or Register | NFTverse</title>
        <meta name="description" content="Sign in to your NFTverse account or register to start collecting and trading NFTs." />
      </Helmet>
      
      <div className="min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Auth Forms */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                
                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Auth Description */}
            <div className="order-first md:order-last">
              <div className="text-center md:text-left max-w-md mx-auto md:ml-0">
                <h1 className="text-4xl font-bold font-sans mb-6 text-primary dark:text-white">
                  Welcome to <span className="text-secondary">NFTverse</span>
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Join the world's premier digital art marketplace to discover, collect, and trade extraordinary NFTs.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-xl mb-4">Why Join NFTverse?</h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-secondary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Discover unique digital artworks from talented creators</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-secondary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Buy, sell, and auction NFTs with secure blockchain technology</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-secondary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Connect with a global community of digital art enthusiasts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
