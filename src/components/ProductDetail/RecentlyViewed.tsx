import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface RecentlyViewedProps {
  currentProductId: string;
}

const RecentlyViewed = ({ currentProductId }: RecentlyViewedProps) => {
  const navigate = useNavigate();
  const [recentlyViewed, setRecentlyViewed] = useState<ShopifyProduct[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => readWL());

  useEffect(() => {
    const stored = JSON.parse(
      sessionStorage.getItem("recentlyViewed") || "[]",
    ) as ShopifyProduct[];
    // Filter out current product and get last 6 items
    const filtered = stored
      .filter((p) => p.id !== currentProductId)
      .slice(0, 6);
    setRecentlyViewed(filtered);
  }, [currentProductId]);

  const handleProductClick = (product: ShopifyProduct) => {
    navigate(`/products/${product.handle}`);
  };

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = wishlist.includes(id)
      ? wishlist.filter((wid) => wid !== id)
      : [...wishlist, id];
    writeWL(next);
    setWishlist(next);
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-12 font-light">
        Recently Viewed
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {recentlyViewed.map((product) => {
          const wishlisted = wishlist.includes(product.id);
          return (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product)}
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
                  className={`absolute top-3 right-3 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-200 ${
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewed;
