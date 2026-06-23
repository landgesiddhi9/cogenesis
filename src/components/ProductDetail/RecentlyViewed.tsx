import { useEffect, useState } from "react";
import type { ShopifyProduct } from "../../types";

interface RecentlyViewedProps {
  currentProductId: string;
}

const RecentlyViewed = ({ currentProductId }: RecentlyViewedProps) => {
  const [recentlyViewed, setRecentlyViewed] = useState<ShopifyProduct[]>([]);

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
    window.history.pushState(
      { path: `/products/${product.handle}` },
      "",
      `/products/${product.handle}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
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
        {recentlyViewed.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            {/* Image */}
            <div className="aspect-[4/5] overflow-hidden bg-stone/5 mb-5">
              <img
                src={product.featuredImage.url}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Product Info */}
            <h3 className="font-sans text-sm md:text-base text-charcoal mb-2 font-medium tracking-wide">
              {product.title}
            </h3>

            <p className="font-sans text-xs md:text-sm text-charcoal/60 tracking-wide">
              ₹{product.priceRange.minVariantPrice.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
