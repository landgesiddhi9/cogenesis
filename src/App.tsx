import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EditorialGrid from "./components/EditorialGrid";
import ProductStrip from "./components/ProductStrip";
import CampaignBanner from "./components/CampaignBanner";
import TripleVideoSection from "./components/TripleVideoSection";
import BrandStorySplitSection from "./components/BrandStorySplitSection";
import GallerySection from "./components/GallerySection";
import VideoSection from "./components/VideoSection";
import Footer from "./components/Footer";
import CollectionPage from "./pages/CollectionPage";
import LaunchingSoonPage from "./pages/LaunchingSoonPage";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePathChange);
    return () => window.removeEventListener("popstate", handlePathChange);
  }, []);

  // Launching Soon route
  if (currentPath === "/launching-soon") {
    return (
      <div className="bg-ivory">
        <Navbar />
        <LaunchingSoonPage />
        <Footer />
      </div>
    );
  }

  // Collection routes
  if (currentPath.startsWith("/collections/")) {
    const collectionHandle = currentPath
      .replace("/collections/", "")
      .replace("/", "");
    return (
      <div className="bg-ivory">
        <Navbar />
        <CollectionPage collectionHandle={collectionHandle} />
        <Footer />
      </div>
    );
  }

  // Homepage (default)
  return (
    <div className="section-content bg-ivory">
      <Navbar />
      <main>
        <Hero />
        <EditorialGrid />
        <ProductStrip />
        <CampaignBanner />
        <GallerySection />
        <VideoSection />
        <TripleVideoSection />
        <BrandStorySplitSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
