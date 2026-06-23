import { useState, useMemo } from "react";
import { useInView } from "../hooks/useInView";
import { getCollectionByHandle } from "../data/mockData";
import SortDropdown from "../components/SortDropdown";
import FilterPanel from "../components/FilterPanel";
import type { ShopifyProduct } from "../types";

interface CollectionPageProps {
  collectionHandle: string;
}

// Get color swatches based on product tags
const getColorSwatches = (tags: string[]) => {
  const colorMap: Record<string, { name: string; hex: string }> = {
    white: { name: "White", hex: "#FFFFFF" },
    beige: { name: "Beige", hex: "#F5E6D3" },
    navy: { name: "Navy", hex: "#0F2847" },
    blue: { name: "Blue", hex: "#4A90E2" },
    olive: { name: "Olive", hex: "#6B7043" },
    black: { name: "Black", hex: "#1A1512" },
    cream: { name: "Cream", hex: "#FFFAED" },
    stone: { name: "Stone", hex: "#D4C5B0" },
    green: { name: "Green", hex: "#8BA68C" },
  };

  return tags
    .filter((tag) => tag in colorMap)
    .map((tag) => colorMap[tag])
    .slice(0, 3); // Show max 3 swatches
};

// Get model image URL based on product type and color
const getModelImageUrl = (tags: string[]) => {
  // Return model wearing shirt Unsplash images based on product colors
  const isWhite = tags.includes("white");
  const isBlue = tags.includes("blue") || tags.includes("navy");
  const isGreen = tags.includes("green") || tags.includes("olive");
  const isBlack = tags.includes("black");
  const isBeige = tags.includes("beige") || tags.includes("cream");

  if (isWhite) {
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=top";
  } else if (isBlue) {
    return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=750&fit=crop&crop=top";
  } else if (isGreen) {
    return "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop&crop=top";
  } else if (isBlack) {
    return "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=750&fit=crop&crop=top";
  } else if (isBeige) {
    return "https://images.unsplash.com/photo-1532073150508-0c1df022e452?w=600&h=750&fit=crop&crop=top";
  }

  // Default fallback
  return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=top";
};

// Product card for collection grid
const CollectionProductCard = ({
  product,
  index,
}: {
  product: ShopifyProduct;
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
    return wishlist.includes(product.id);
  });
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const handleProductClick = () => {
    window.history.pushState(
      { path: `/products/${product.handle}` },
      "",
      `/products/${product.handle}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wishlist = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
    if (isWishlisted) {
      const updated = wishlist.filter((id: string) => id !== product.id);
      sessionStorage.setItem("wishlist", JSON.stringify(updated));
    } else {
      wishlist.push(product.id);
      sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    setIsWishlisted(!isWishlisted);
  };

  // Extract fabric from description or tags
  const fabric = product.tags
    .find((tag) => ["cotton", "linen", "linen-blend"].includes(tag))
    ?.toUpperCase();

  // Get color swatches
  const colors = getColorSwatches(product.tags);

  // Get model image
  const modelImageUrl = getModelImageUrl(product.tags);

  // Determine which image to show
  const displayImage = isHovered ? modelImageUrl : product.featuredImage.url;

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden transition-all duration-700 cursor-pointer ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={handleProductClick}
    >
      {/* Image container with hover effect */}
      <div
        className="aspect-3/4 overflow-hidden bg-stone/5 relative group/image"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Base image */}
        <img
          src={displayImage}
          alt={product.featuredImage.altText}
          style={{
            transform: isHovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 300ms ease-in-out",
          }}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-5 right-5 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-300 ${
            isHovered
              ? "opacity-100"
              : "opacity-0 group-hover/image:opacity-100"
          }`}
          aria-label="Add to wishlist"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#482C1B" : "none"}
            stroke={isWishlisted ? "#482C1B" : "#482C1B"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          >
            <path d="M6 2h12v16l-6-4l-6 4V2z" />
          </svg>
        </button>
      </div>

      {/* Product info */}
      <div className="pt-5 pb-4 px-0">
        {/* Product name */}
        <h3 className="text-center font-medium text-[14px] md:text-[15px] tracking-wide text-charcoal mb-2 font-sans">
          {product.title}
        </h3>

        {/* Fabric */}
        {fabric && (
          <p className="text-center text-[12px] md:text-[13px] tracking-wide text-warm-brown/70 mb-3 font-sans">
            {fabric}
          </p>
        )}

        {/* Price */}
        <p className="text-center font-light text-[13px] md:text-[14px] tracking-wide text-charcoal mb-3 font-sans">
          ₹{product.priceRange.minVariantPrice.amount}
        </p>

        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {colors.slice(0, 5).map((color, idx) => (
              <button
                key={color.name}
                className={`w-4 h-4 rounded-full border transition-all duration-200 hover:scale-110 ${
                  selectedColorIndex === idx
                    ? "border-charcoal/60 ring-1 ring-charcoal/30"
                    : "border-stone/30 hover:border-charcoal/40"
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColorIndex(idx)}
                title={color.name}
                aria-label={`${color.name} option`}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-[11px] text-charcoal/50 font-light tracking-wide ml-1">
                +{colors.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CollectionPage = ({ collectionHandle }: CollectionPageProps) => {
  const collection = getCollectionByHandle(collectionHandle);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sort options
  const sortOptions = [
    { id: "featured", label: "Featured" },
    { id: "newest", label: "Newest" },
    { id: "best-selling", label: "Best Selling" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "a-z", label: "Alphabetically A–Z" },
    { id: "z-a", label: "Alphabetically Z–A" },
  ];

  // Sort products
  const sortedProducts = useMemo(() => {
    const products = [...collection.products];

    switch (sortBy) {
      case "price-low":
        return products.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount),
        );
      case "price-high":
        return products.sort(
          (a, b) =>
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount),
        );
      case "a-z":
        return products.sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return products.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return products;
    }
  }, [sortBy, collection.products]);

  if (!collection.products.length) {
    return (
      <main className="bg-ivory min-h-[100svh]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <h1 className="text-center text-2xl text-charcoal font-sans">
            Collection not found
          </h1>
        </div>
      </main>
    );
  }

  const collectionTitle = collection.title;

  return (
    <main className="bg-ivory">
      {/* Collection header - refined */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Title with serif typography */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-light tracking-wide text-charcoal mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              letterSpacing: "0.05em",
              fontWeight: 400,
            }}
          >
            {collectionTitle}
          </h1>
          {/* Subtle divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="shrink-0 w-8 h-px bg-stone/20"></div>
            <div className="shrink-0 w-2 h-2 rounded-full bg-stone/20"></div>
            <div className="shrink-0 w-8 h-px bg-stone/20"></div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="border-t border-stone/10 py-4 mb-12 flex items-center justify-between">
          <div className="text-sm text-charcoal/70 tracking-wide font-sans">
            Products ({sortedProducts.length})
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="text-sm text-charcoal/70 hover:text-charcoal transition-colors tracking-wide font-sans"
            >
              Filters
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-charcoal/70 tracking-wide font-sans">
                Sort:
              </label>
              <SortDropdown
                options={sortOptions}
                selectedId={sortBy}
                onSelect={setSortBy}
              />
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {sortedProducts.map((product, index) => (
            <CollectionProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => {}}
      />
    </main>
  );
};

export default CollectionPage;
