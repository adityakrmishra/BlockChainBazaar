import HeroSection from "@/components/sections/hero-section";
import TrendingCollections from "@/components/sections/trending-collections";
import TopNFTs from "@/components/sections/top-nfts";
import TopCreators from "@/components/sections/top-creators";
import CreateAndSell from "@/components/sections/create-and-sell";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>NFTverse | Digital Art Marketplace</title>
        <meta name="description" content="Discover, collect, and sell exclusive digital assets on the NFTverse marketplace." />
      </Helmet>
      
      <HeroSection />
      <TrendingCollections />
      <TopNFTs />
      <TopCreators />
      <CreateAndSell />
    </>
  );
}
