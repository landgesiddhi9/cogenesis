import { useState, useEffect } from "react";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { getProductByHandle } from "../services/product.service";
import ImageGallery from "../components/ProductDetail/ImageGallery";
import ProductInfo from "../components/ProductDetail/ProductInfo";
import ProductAccordion from "../components/ProductDetail/ProductAccordion";
import RelatedProducts from "../components/ProductDetail/RelatedProducts";
import RecentlyViewed from "../components/ProductDetail/RecentlyViewed";
import type { ShopifyProduct } from "../types";

interface ProductDetailPageProps {
  productHandle: string;
}

const ProductDetailPage = ({ productHandle }: ProductDetailPageProps) => {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart: addToCartService } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [prevHandle, setPrevHandle] = useState(productHandle);

  if (productHandle !== prevHandle) {
    setPrevHandle(productHandle);
    setLoading(true);
    setProduct(null);
  }

  useEffect(() => {
    let active = true;

    getProductByHandle(productHandle)
      .then(({ product: foundProduct }) => {
        if (!active) return;

        if (foundProduct) {
          setProduct(foundProduct);
          const recentlyViewedData = sessionStorage.getItem("recentlyViewed");
          const recentlyViewed: ShopifyProduct[] = recentlyViewedData
            ? JSON.parse(recentlyViewedData)
            : [];
          if (!recentlyViewed.find((p) => p.id === foundProduct.id)) {
            recentlyViewed.unshift(foundProduct);
            if (recentlyViewed.length > 10) recentlyViewed.pop();
            sessionStorage.setItem(
              "recentlyViewed",
              JSON.stringify(recentlyViewed),
            );
          }

        } else {
          setProduct(null);
        }
      })
      .catch(() => {
        if (!active) return;
        setProduct(null);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [productHandle]);

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product.id);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (!product) {
      alert("Product not found");
      return;
    }

    const variant = product.variants.find((v) => v.title === selectedSize);
    if (!variant) {
      alert("Selected size is not available");
      return;
    }

    if (addingToCart) return;

    setAddingToCart(true);

    try {
      await addToCartService(variant.id, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch {
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F8F7F5]">
        <p className="text-charcoal text-lg font-sans">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F8F7F5]">
        <p className="text-charcoal text-lg font-sans">Product not found</p>
      </div>
    );
  }

  const productDescription =
    product.description ||
    `Crafted with meticulous attention to detail, this ${product.title.toLowerCase()} exemplifies the pinnacle of luxury craftsmanship. Made from premium ${
      product.tags?.find((t: string) =>
        ["cotton", "linen", "blend"].includes(t.toLowerCase()),
      ) || "fabric"
    }, this piece combines timeless elegance with contemporary design. Perfect for the discerning gentleman who appreciates quality, durability, and understated sophistication.`;

  return (
    <div className="bg-[#F8F7F5] min-h-screen">
      {/* Main Product Section with Sticky Info Panel */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-12 lg:gap-20">
          {/* Left Side - Image Gallery */}
          <div className="h-full">
            <ImageGallery product={product} selectedColor={selectedColor} />
          </div>

          {/* Right Side - Sticky Product Info Panel */}
          <div className="sticky top-20 h-fit">
            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              isWishlisted={isWishlisted(product.id)}
              toggleWishlist={handleWishlistToggle}
              addToCart={handleAddToCart}
              description={productDescription}
            />

            {/* Success notification */}
            <div
              className={`font-sans text-[12px] text-[#111] transition-all duration-300 overflow-hidden ${
                showSuccess ? "max-h-10 mb-4 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              Added to bag ✓
            </div>

            {/* Accordions in the sticky panel */}
            <div className="mt-16 space-y-0">
              <ProductAccordion
                title="Product Details"
                content={`Type: ${product.productType}\nVendor: ${product.vendor}\nAvailable in multiple colors and sizes.`}
              />
              <ProductAccordion
                title="Fabric & Composition"
                content="Premium quality material with a lightweight structure. Made from sustainably sourced fibers. Designed for breathability and comfort throughout the day."
              />
              <ProductAccordion
                title="Care Instructions"
                content="Gentle hand wash in cold water. Lay flat to dry. Do not bleach. Iron at low temperature if needed. For best longevity, avoid frequent washing."
              />
              <ProductAccordion
                title="Shipping Information"
                content="Free shipping on orders above ₹3,000. Standard delivery: 5-7 business days. Express delivery available for select locations."
              />
              <ProductAccordion
                title="Return & Exchange"
                content="Easy 7-day returns on unworn items with original tags. Free exchanges for different sizes. Full refund within 14 days."
              />
              <ProductAccordion
                title="Payment & Security"
                content="All transactions are encrypted and secured. We accept all major payment methods including credit cards, digital wallets, and bank transfers."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 border-t border-[#e7e1d8]">
        <RelatedProducts currentProduct={product} />
      </div>

      {/* Recently Viewed */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 border-t border-[#e7e1d8]">
        <RecentlyViewed currentProductId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
