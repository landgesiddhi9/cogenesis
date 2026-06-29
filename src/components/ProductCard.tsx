import { useNavigate } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import { useWishlist } from "../hooks/useWishlist";
import SalePrice from "./SalePrice";
import { getBestCompareAtPrice } from "../utils/price";
import type { ShopifyProduct } from "../types";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
  animate?: boolean;
  showFabric?: boolean;
  /** Controlled wishlist mode — pass both to override the internal useWishlist hook */
  wishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  /** Rendered below the price */
  children?: React.ReactNode;
  /** Rendered inside the image container, after the wishlist button */
  imageChildren?: React.ReactNode;
  aspectRatio?: string;
  imageBg?: string;
  hoverScale?: string;
}

const ProductCard = ({
  product,
  index = 0,
  animate = false,
  showFabric = false,
  wishlisted: controlledWishlisted,
  onWishlistToggle: controlledToggle,
  children,
  imageChildren,
  aspectRatio = "aspect-[3/4]",
  imageBg = "bg-stone/5",
  hoverScale = "",
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { isWishlisted: hookIsWishlisted, toggleWishlist: hookToggle } = useWishlist();

  const isControlled = controlledWishlisted !== undefined;
  const wishlisted = isControlled ? controlledWishlisted! : hookIsWishlisted(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (controlledToggle) {
      controlledToggle(product.id);
    } else {
      hookToggle(product.id);
    }
  };

  const fabric = showFabric
    ? product.tags
        .find((tag) => ["cotton", "linen", "linen-blend"].includes(tag))
        ?.toUpperCase()
    : undefined;

  return (
    <div
      ref={animate ? ref : undefined}
      className={`group relative cursor-pointer${
        animate
          ? ` overflow-hidden transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`
          : ""
      }`}
      style={animate ? { transitionDelay: `${index * 50}ms` } : undefined}
      onClick={() => navigate(`/products/${product.handle}`)}
    >
      <div className={`${aspectRatio} overflow-hidden ${imageBg} relative group/image`}>
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          className={`w-full h-full object-cover object-top transition-all duration-200 ${hoverScale}`}
          loading="lazy"
        />

        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-5 right-5 z-20 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-300 ${
            wishlisted ? "opacity-100" : "opacity-0 group-hover/image:opacity-100"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#431c1c" : "none"}
            stroke={wishlisted ? "#431c1c" : "#431c1c"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          >
            <path d="M6 2h12v16l-6-4l-6 4V2z" />
          </svg>
        </button>

        {imageChildren}
      </div>

      <div className="pt-5 pb-4 px-0">
        <h3 className="text-center font-medium text-[14px] md:text-[15px] tracking-wide text-charcoal mb-2 font-sans">
          {product.title}
        </h3>

        {fabric && (
          <p className="text-center text-[12px] md:text-[13px] tracking-wide text-warm-brown/70 mb-3 font-sans">
            {fabric}
          </p>
        )}

        <SalePrice
          price={product.priceRange.minVariantPrice.amount}
          compareAtPrice={getBestCompareAtPrice(product)}
          className="text-center"
        />

        {children}
      </div>
    </div>
  );
};

export default ProductCard;
