import { useState } from "react";
import { products } from "../../data/mockData";
import type { ShopifyProduct } from "../../types";

interface RelatedProductsProps {
  currentProductId: string;
}

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
    window.history.pushState(
      { path: `/products/${product.handle}` },
      "",
      `/products/${product.handle}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-12 font-light">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer"
            onClick={() => handleProductClick(product)}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
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

            <p className="font-sans text-xs md:text-sm text-charcoal/60 mb-3 tracking-wide">
              ₹{product.priceRange.minVariantPrice.amount}
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

            {/* Wishlist Icon */}
            <button
              className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                hoveredId === product.id ? "opacity-100" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                // Handle wishlist toggle
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2A2420"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2h12v16l-6-4l-6 4V2z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
