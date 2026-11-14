import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { getProductByHandle } from "../services/product.service";
import { createCart as serviceCreateCart, cartLinesAdd as serviceCartLinesAdd } from "../services/cart.service";
import { readCartId, writeCartId, removeCartId } from "../utils/cartStorage";
import { resolveProductVariant, getProductSizes } from "../utils/variant";
import ImageGallery from "../components/ProductDetail/ImageGallery";
import ProductInfo from "../components/ProductDetail/ProductInfo";
import ProductAccordion from "../components/ProductDetail/ProductAccordion";
import RelatedProducts from "../components/ProductDetail/RelatedProducts";
import RecentlyViewed from "../components/ProductDetail/RecentlyViewed";
import type { ShopifyProduct } from "../types";

interface ProductDetailPageProps {
  productHandle: string;
}

const COLOR_NAMES = ["White", "Beige", "Stone", "Olive", "Charcoal", "Black"];

const ProductDetailPage = ({ productHandle }: ProductDetailPageProps) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart: addToCartService } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [prevHandle, setPrevHandle] = useState(productHandle);

  if (productHandle !== prevHandle) {
    setPrevHandle(productHandle);
    setLoading(true);
    setError(null);
    setProduct(null);
  }

  useEffect(() => {
    let active = true;

    getProductByHandle(productHandle)
      .then(({ product: foundProduct }) => {
        if (!active) return;

        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
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
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load product details.");
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

  const showToast = useCallback((message: string, type: "success" | "error" = "error") => {
    window.dispatchEvent(new CustomEvent("cart-toast", { detail: { message, type } }));
  }, []);

  const handleAddToCart = async () => {
    if (!product) {
      showToast("Product not found");
      return;
    }

    const availableSizes = getProductSizes(product);
    if (availableSizes.length > 0 && !selectedSize) {
      showToast("Please select a size");
      return;
    }

    const colorName = COLOR_NAMES[selectedColor] || "";
    const variant = resolveProductVariant(product, selectedSize, colorName);
    if (!variant) {
      showToast("Selected option is not available");
      return;
    }

    if (!variant.availableForSale) {
      showToast("Selected item is currently out of stock");
      return;
    }

    if (addingToCart) return;

    setAddingToCart(true);

    try {
      await addToCartService(variant.id, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add to cart. Please try again.";
      showToast(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  // Buy Now: adds variant to cart and navigates directly to Shopify checkoutUrl
  const handleBuyNow = useCallback(async () => {
    if (!product) {
      showToast("Product not found");
      return;
    }

    const availableSizes = getProductSizes(product);
    if (availableSizes.length > 0 && !selectedSize) {
      showToast("Please select a size");
      return;
    }

    const colorName = COLOR_NAMES[selectedColor] || "";
    const variant = resolveProductVariant(product, selectedSize, colorName);
    if (!variant) {
      showToast("Selected option is not available");
      return;
    }

    if (!variant.availableForSale) {
      showToast("Selected item is currently out of stock");
      return;
    }

    if (buyingNow) return;
    setBuyingNow(true);

    try {
      let cartId = readCartId();
      let updatedCart: ShopifyProduct | any = null;

      if (cartId) {
        try {
          updatedCart = await serviceCartLinesAdd(cartId, [
            { merchandiseId: variant.id, quantity },
          ]);
        } catch {
          removeCartId();
          cartId = null;
        }
      }

      if (!cartId || !updatedCart) {
        const newCart = await serviceCreateCart({
          lines: [{ merchandiseId: variant.id, quantity }],
        });
        writeCartId(newCart.id);
        updatedCart = newCart;
      }

      if (updatedCart?.checkoutUrl) {
        window.location.href = updatedCart.checkoutUrl;
      } else {
        navigate("/cart");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to proceed to checkout. Please try again.";
      showToast(msg);
      setBuyingNow(false);
    }
  }, [product, selectedSize, selectedColor, quantity, buyingNow, navigate, showToast]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-ivory">
        <p className="text-charcoal text-lg font-sans">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-ivory px-6 text-center">
        <p className="text-charcoal text-lg font-sans mb-4">
          {error || "Product not found"}
        </p>
        <button
          onClick={() => navigate("/men/view-all")}
          className="text-xs uppercase tracking-[0.2em] font-sans text-charcoal border-b border-charcoal pb-0.5 hover:opacity-70 transition-opacity"
        >
          Return to Collection
        </button>
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
    <div className="bg-ivory min-h-screen">
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
              buyNow={handleBuyNow}
              buyingNow={buyingNow}
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
