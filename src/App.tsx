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
import FAQPage from "./pages/FAQPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./components/LoginPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import AccountPage from "./pages/AccountPage";
import SearchPage from "./pages/SearchPage";
import AIAssistant from "./components/AIAssistant";
import PurchasesPage from "./pages/PurchasesPage";
import ReturnsPage from "./pages/ReturnsPage";

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

          {/* Wishlist */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Account dashboard */}
          <Route path="/account" element={<AccountPage />} />

          {/* Cart */}
          <Route path="/cart" element={<CartPage />} />

          {/* Search */}
          <Route path="/search" element={<SearchPage />} />

          {/* Purchases */}
          <Route path="/purchases" element={<PurchasesPage />} />

          {/* Returns */}
          <Route path="/returns" element={<ReturnsPage />} />

          {/* New Arrivals */}
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />

          {/* Product Detail pages */}
          <Route path="/products/:handle" element={<ProductRouteWrapper />} />

          {/* Launching soon */}
          <Route path="/launching-soon" element={<LaunchingSoonPage />} />

          {/* FAQ */}
          <Route path="/faqs" element={<FAQPage />} />
        </Routes>
      </main>

      {/* Hide footer while the login drawer is open */}
      {!isLoginPage && <Footer />}

      <AIAssistant />
    </div>
  );
}

export default App;
