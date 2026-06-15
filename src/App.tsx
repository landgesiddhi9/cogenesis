import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EditorialGrid from './components/EditorialGrid';
import ProductStrip from './components/ProductStrip';
import CampaignBanner from './components/CampaignBanner';
import TripleVideoSection from './components/TripleVideoSection';
import BrandStorySplitSection from './components/BrandStorySplitSection';
import GallerySection from './components/GallerySection';
import VideoSection from './components/VideoSection';
import ModelLineup from './components/ModelLineup';
import CraftsmanshipSection from './components/CraftsmanshipSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-ivory">
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
        <ModelLineup />
        <CraftsmanshipSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
