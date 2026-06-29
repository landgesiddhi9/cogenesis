import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import { useWishlist } from "../hooks/useWishlist";
import { getFeaturedProducts } from "../services/product.service";
import SalePrice from "./SalePrice";
import { getBestCompareAtPrice } from "../utils/price";
import type { ShopifyProduct } from "../types";

const ProductCard = ({
  product,
  index,
}: {
  product: ShopifyProduct;
  index: number;
}) => {
  const navigate = useNavigate();
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { isWishlisted, toggleWishlist: toggleWishlistItem } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem(product.id);
  };

  const handleProductClick = () => {
    navigate(`/products/${product.handle}`);
  };

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden cursor-pointer scroll-strip__panel w-[280px] md:w-[320px] lg:w-[360px] transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      id={`product-card-${product.handle}`}
      onClick={handleProductClick}
    >
      {/* Image */}
      <div className="aspect-[5/8] overflow-hidden media-cover relative">
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          className="product-img object-top"
          loading="lazy"
        />

        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-20 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-200 ${
            wishlisted
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#431c1c" : "none"}
            stroke={wishlisted ? "#431c1c" : "white"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2h12v16l-6-4-6 4V2z" />
          </svg>
        </button>
      </div>

      {/* Hover overlay */}
      <div className="product-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/8 to-transparent opacity-0 group-hover:opacity-100" />

      {/* Product info */}
      <div className="product-info absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="block font-sans text-[10px] tracking-[0.25em] uppercase text-white/70 mb-1.5 text-center">
          {product.productType}
        </span>

        <h3 className="font-sans text-[15px] md:text-base font-light tracking-wide text-white mb-1.5 text-center">
          {product.title}
        </h3>

        <SalePrice
          price={product.priceRange.minVariantPrice.amount}
          compareAtPrice={getBestCompareAtPrice(product)}
          className="font-sans text-[12px] tracking-wider text-white/60 tabular-nums text-center"
        />
      </div>
    </div>
  );
};

const ProductStrip = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getFeaturedProducts(12)
      .then(({ products: featuredProducts }) => {
        if (active) {
          setProducts(featuredProducts);
        }
      })
      .catch(() => {
        if (active) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section id="product-collection" className="section-content">
      <div className="scroll-strip">
        <div className="scroll-strip__track">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductStrip;
