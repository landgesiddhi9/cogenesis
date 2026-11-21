import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { getProductByHandle, getFeaturedProducts } from "../services/product.service";
import { createCart as serviceCreateCart, cartLinesAdd as serviceCartLinesAdd } from "../services/cart.service";
import { readCartId, writeCartId, removeCartId } from "../utils/cartStorage";
import {
  resolveProductVariant,
  getProductSizes,
  getProductColors,
  resolveSiblingHandleForColor,
  getFabricComposition,
} from "../utils/variant";
import ImageGallery from "../components/ProductDetail/ImageGallery";
import ProductInfo from "../components/ProductDetail/ProductInfo";
import ProductAccordion from "../components/ProductDetail/ProductAccordion";
import RelatedProducts from "../components/ProductDetail/RelatedProducts";
import RecentlyViewed from "../components/ProductDetail/RecentlyViewed";
import type { ShopifyProduct, ShopifyProductVariant } from "../types";

interface ProductDetailPageProps {
  productHandle?: string;
}

const ProductDetailPage = ({ productHandle }: ProductDetailPageProps) => {
  const navigate = useNavigate();
  const { handle: routeHandle } = useParams<{ handle: string }>();
  const activeHandle = productHandle || routeHandle || "";

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [catalog, setCatalog] = useState<ShopifyProduct[]>([]);
  const [activeVariant, setActiveVariant] = useState<ShopifyProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart: addToCartService } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [prevHandle, setPrevHandle] = useState(activeHandle);

  // Pre-load full catalog to identify sibling color products
  useEffect(() => {
    let active = true;
    getFeaturedProducts(50)
      .then(({ products }) => {
        if (active) setCatalog(products);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (activeHandle !== prevHandle) {
    setPrevHandle(activeHandle);
    setLoading(true);
    setError(null);
    setProduct(null);
    setActiveVariant(null);
  }

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        let foundProduct: ShopifyProduct | null = null;

        if (activeHandle) {
          const res = await getProductByHandle(activeHandle);
          foundProduct = res.product;
        } else {
          // If no handle provided (e.g. test route), fetch the first available product
          const res = await getFeaturedProducts(1);
          foundProduct = res.products[0] || null;
        }

        if (!active) return;

        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);

          // Detect active color from this product's title or handle if separate products exist
          const dynamicColors = getProductColors(foundProduct);
          const currentProductColor =
            dynamicColors.find((c) => {
              const clean = c.trim().toLowerCase();
              const slug = clean.replace(/\s+/g, "-");
              return (
                foundProduct.title.toLowerCase().includes(clean) ||
                foundProduct.handle.toLowerCase().includes(slug)
              );
            }) || (dynamicColors.length > 0 ? dynamicColors[0] : "");

          setSelectedColor(currentProductColor);
          setSelectedSize("");

          // Initialize active variant to the matching variant
          const initialVariant = resolveProductVariant(
            foundProduct,
            "",
            currentProductColor,
          );
          setActiveVariant(initialVariant);

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
          setActiveVariant(null);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load product details.");
        setProduct(null);
        setActiveVariant(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [activeHandle]);

  // Color selection:
  // 1. If separate products exist for each color in Shopify, navigate to that product's URL handle!
  // 2. If variants belong to one single product, update state in-place.
  const handleColorChange = useCallback(
    (colorName: string, directVariant?: ShopifyProductVariant | null) => {
      if (!product) return;

      const cleanTarget = colorName.trim().toLowerCase();
      if (selectedColor.trim().toLowerCase() === cleanTarget) {
        return;
      }

      // 1. Check if a separate sibling product exists for this color in the store
      const targetHandle = resolveSiblingHandleForColor(product, colorName, catalog);
      if (targetHandle && targetHandle.toLowerCase() !== product.handle.toLowerCase()) {
        navigate(`/products/${targetHandle}`);
        return;
      }

      // 2. Single product setup: update state in-place
      setSelectedColor(colorName);
      const resolved =
        resolveProductVariant(product, selectedSize, colorName) ||
        directVariant ||
        null;
      setActiveVariant(resolved);
    },
    [product, selectedColor, selectedSize, catalog, navigate],
  );

  // Size selection: updates active variant matching both size and color
  const handleSizeChange = useCallback(
    (size: string) => {
      setSelectedSize(size);
      if (product) {
        const resolved = resolveProductVariant(product, size, selectedColor);
        setActiveVariant(resolved);
      }
    },
    [product, selectedColor],
  );

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

    const variant = activeVariant || resolveProductVariant(product, selectedSize, selectedColor);
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

    const variant = activeVariant || resolveProductVariant(product, selectedSize, selectedColor);
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
  }, [product, selectedSize, selectedColor, activeVariant, quantity, buyingNow, navigate, showToast]);

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
  const fabricComposition = getFabricComposition(product);

  const productDescriptionLines = productDescription
    .split(".")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `${line}.`)
    .join("\n");

  return (
    <div className="bg-ivory min-h-screen">
      {/* Main Product Section with Sticky Info Panel */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-12 lg:gap-20">
          {/* Left Side - Image Gallery */}
          <div className="h-full">
            <ImageGallery
              product={product}
              selectedColor={selectedColor}
              activeVariant={activeVariant}
            />
          </div>

          {/* Right Side - Sticky Product Info Panel */}
          <div className="sticky top-20 h-fit lg:pr-16">
            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              setSelectedColor={handleColorChange}
              selectedSize={selectedSize}
              setSelectedSize={handleSizeChange}
              activeVariant={activeVariant}
              onColorChange={handleColorChange}
              quantity={quantity}
              setQuantity={setQuantity}
              isWishlisted={isWishlisted(product.id)}
              toggleWishlist={handleWishlistToggle}
              addToCart={handleAddToCart}
              buyNow={handleBuyNow}
              buyingNow={buyingNow}
              catalog={catalog}
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
                content={productDescriptionLines}
              />
              <ProductAccordion
                title="Fabric & Composition"
                content={fabricComposition}
              />
              <ProductAccordion
                title="Care Instructions"
                content={"Turn inside out\nMachine wash on cool cycle\nWash with like colors\nOnly non chlorine (bleach)\nLine dry\nDo not wring\nTumble dry low heat\nLow iron heat"}
              />
              <ProductAccordion
                title="Shipping Information"
                content="Free shipping on orders above ₹2,099. Standard delivery: 5-7 business days. Express delivery available for select locations."
              />
              <ProductAccordion
                title="Return & Exchange"
                content="Easy 10-day returns on unworn items with original tags. Free exchanges for different sizes. Full refund within 14 days."
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
