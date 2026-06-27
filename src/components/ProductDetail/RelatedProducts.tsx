import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../../data/mockData";
import type { ShopifyProduct } from "../../types";

const WL_KEY = "wishlist";
const readWL = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(WL_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeWL = (ids: string[]) =>
  sessionStorage.setItem(WL_KEY, JSON.stringify(ids));

interface RelatedProductsProps {
  currentProductId: string;
}

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const navigate = useNavigate();
  const [_hoveredId, setHoveredId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(() => readWL());

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const next = wishlist.includes(id)
      ? wishlist.filter((wid) => wid !== id)
      : [...wishlist, id];
    writeWL(next);
    setWishlist(next);
  };

  // Get related products (same category, different product)
  const currentProduct = products.find((p) => p.id === currentProductId);
  const relatedProducts = products
    .filter(
      (p) =>
        p.productType === currentProduct?.productType &&
        p.id !== currentProductId,
    )
    .slice(0, 4);

  const handleProductClick = (product: ShopifyProduct) => {
    navigate(`/products/${product.handle}`);
  };

  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-12 font-light">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {relatedProducts.map((product) => {
          const wishlisted = wishlist.includes(product.id);
          return (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product)}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden bg-stone/5 mb-5 relative">
                <img
                  src={product.featuredImage.url}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                <button
                  type="button"
                  onClick={(e) => toggleWishlist(e, product.id)}
                  className={`absolute top-3 right-3 z-20 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-200 ${
                    wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill={wishlisted ? "#431c1c" : "none"}
                    stroke={wishlisted ? "#431c1c" : "#2A2420"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2h12v16l-6-4l-6 4V2z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <h3 className="font-sans text-sm md:text-base text-charcoal mb-2 font-medium tracking-wide">
                {product.title}
              </h3>

              <p className="font-sans text-[12px] text-[#888] mt-1 tracking-[0.02em] tabular-nums">
                ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
              </p>

              {/* Color Swatches */}
              {product.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {product.tags.slice(0, 3).map((tag, idx) => (
                    <div
                      key={idx}
                      className="w-3 h-3 rounded-full border border-stone/30"
                      style={{
                        backgroundColor:
                          tag === "white"
                            ? "#FFFFFF"
                            : tag === "beige"
                              ? "#F5E6D3"
                              : tag === "stone"
                                ? "#D4C5B0"
                                : tag === "olive"
                                  ? "#6B7043"
                                  : tag === "charcoal"
                                    ? "#2A2420"
                                    : tag === "black"
                                      ? "#1A1512"
                                      : "#E7E1D8",
                      }}
                      title={tag}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
