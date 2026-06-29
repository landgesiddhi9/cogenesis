import { useEffect, useState } from "react";
import { getProductByHandle } from "../../services/product.service";
import type { ShopifyProduct } from "../../types";
import ProductCard from "../ProductCard";

interface RecentlyViewedProps {
  currentProductId: string;
}

const RecentlyViewed = ({ currentProductId }: RecentlyViewedProps) => {
  const [recentlyViewed, setRecentlyViewed] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    let active = true;
    const stored = JSON.parse(
      sessionStorage.getItem("recentlyViewed") || "[]",
    ) as ShopifyProduct[];
    const handles = stored
      .filter((product) => product.id !== currentProductId)
      .map((product) => product.handle)
      .filter((handle, index, allHandles) => allHandles.indexOf(handle) === index)
      .slice(0, 6);

    Promise.all(handles.map((handle) => getProductByHandle(handle)))
      .then((results) => {
        if (!active) return;

        setRecentlyViewed(
          results
            .map(({ product }) => product)
            .filter((product): product is ShopifyProduct => product !== null),
        );
      })
      .catch(() => {
        if (active) {
          setRecentlyViewed([]);
        }
      });

    return () => {
      active = false;
    };
  }, [currentProductId]);

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
          <ProductCard
            key={product.id}
            product={product}
            aspectRatio="aspect-[4/5]"
            hoverScale="group-hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
