import { useLocation, useParams } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";

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
import BestSellersPage from "./pages/BestSellersPage";
import CollectionsPage from "./pages/ViewAllPage";
import WomenLaunchingSoonPage from "./pages/WomenLaunchingSoonPage";

import LoginPage from "./components/LoginPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import AccountPage from "./pages/AccountPage";
import SearchPage from "./pages/SearchPage";
import PurchasesPage from "./pages/PurchasesPage";
import ReturnsPage from "./pages/ReturnsPage";

import AIAssistant from "./components/AIAssistant";
import { CartToast } from "./components/CartToast";

const CollectionRouteWrapper = () => {
  const { handle } = useParams<{ handle: string }>();
  return <CollectionPage collectionHandle={handle ?? ""} />;
};

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
          {/* Home */}
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

          {/* Login */}
          <Route
            path="/login"
            element={
              <>
                <Hero />
                <LoginPage />
              </>
            }
          />

          {/* Collections — redirect landing to view-all, keep direct handles */}
          <Route
            path="/collections"
            element={<Navigate to="/men/view-all" replace />}
          />
          <Route
            path="/collections/:handle"
            element={<CollectionRouteWrapper />}
          />

          {/* Test Route */}
          <Route
            path="/test"
            element={<ProductDetailPage productHandle="" />}
          />

          {/* Product Details */}
          <Route
            path="/products/:handle"
            element={<ProductRouteWrapper />}
          />

          {/* Wishlist */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Account */}
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

          {/* FAQ */}
          <Route path="/faqs" element={<FAQPage />} />

          {/* Launching Soon */}
          <Route path="/launching-soon" element={<LaunchingSoonPage />} />

          {/* Men */}
          <Route
            path="/men"
            element={<Navigate to="/men/view-all" replace />}
          />
          <Route path="/men/best-sellers" element={<BestSellersPage />} />
          <Route path="/men/view-all" element={<CollectionsPage />} />
          <Route
            path="/men/:subcategory"
            element={<Navigate to="/launching-soon" replace />}
          />

          {/* Women */}
          <Route path="/women" element={<WomenLaunchingSoonPage />} />
          <Route
            path="/women/:subcategory"
            element={<WomenLaunchingSoonPage />}
          />

          {/* Fabric */}
          <Route
            path="/fabric"
            element={<Navigate to="/launching-soon" replace />}
          />
          <Route
            path="/fabric/:subcategory"
            element={<Navigate to="/launching-soon" replace />}
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isLoginPage && <Footer />}

      <AIAssistant />
      <CartToast />
    </div>
  );
}

export default App;
