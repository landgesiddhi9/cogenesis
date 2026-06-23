import { useLocation, useParams, Routes, Route } from "react-router-dom";
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
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./components/LoginPage";

// Wrapper so CollectionPage receives its collectionHandle prop via React Router params
const CollectionRouteWrapper = () => {
  const { handle } = useParams<{ handle: string }>();
  return <CollectionPage collectionHandle={handle ?? ""} />;
};

// Wrapper so ProductDetailPage receives its productHandle prop via React Router params
const ProductRouteWrapper = () => {
  const { handle } = useParams<{ handle: string }>();
  return <ProductDetailPage productHandle={handle ?? ""} />;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="section-content bg-ivory">
      <Navbar />
      <main>
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <EditorialGrid />
                <ProductStrip />
                <CampaignBanner />
                <GallerySection />
                <VideoSection />
                <TripleVideoSection />
                <BrandStorySplitSection />
              </>
            }
          />

          {/* Login — drawer overlaid on hero */}
          <Route
            path="/login"
            element={
              <>
                <Hero />
                <LoginPage />
              </>
            }
          />

          {/* Collection pages */}
          <Route
            path="/collections/:handle"
            element={<CollectionRouteWrapper />}
          />

          {/* Product Detail pages */}
          <Route path="/products/:handle" element={<ProductRouteWrapper />} />

          {/* Launching soon */}
          <Route path="/launching-soon" element={<LaunchingSoonPage />} />
        </Routes>
      </main>

      {/* Hide footer while the login drawer is open */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
