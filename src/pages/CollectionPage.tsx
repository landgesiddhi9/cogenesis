import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import { useWishlist } from "../hooks/useWishlist";
import { getCollectionByHandle, getProductsByCollection } from "../services/collection.service";
import { logProductImageFailure } from "../lib/shopifyImageDiagnostics";
import SortDropdown from "../components/SortDropdown";
import FilterPanel from "../components/FilterPanel";
import SalePrice from "../components/SalePrice";
import { getBestCompareAtPrice } from "../utils/price";
import { toTitleCase } from "../utils/text";
import type { ShopifyProduct, ShopifyCollection } from "../types";
import type { ShopifyApiProductFilter, ShopifyProductSortKeys } from "../graphql/queries/getProductsByCollection";

const SORT_CONFIG: Record<string, { sortKey: ShopifyProductSortKeys; reverse: boolean } | null> = {
  featured: null,
  newest: { sortKey: "CREATED", reverse: true },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  "price-low": { sortKey: "PRICE", reverse: false },
  "price-high": { sortKey: "PRICE", reverse: true },
  "a-z": { sortKey: "TITLE", reverse: false },
  "z-a": { sortKey: "TITLE", reverse: true },
};

const MATERIAL_TAG_MAP: Record<string, string> = {
  Linen: "linen",
  Cotton: "cotton",
  "Cotton Linen Blend": "linen-blend",
};

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



// Product card for collection grid
  const CollectionProductCard = ({
    product,
    index,
    rawProduct,
  }: {
    product: ShopifyProduct;
    index: number;
    rawProduct: unknown;
  }) => {
    const navigate = useNavigate();
    const { ref, isInView } = useInView({ threshold: 0.1 });
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(product.id);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleProductClick = () => {
      navigate(`/products/${product.handle}`);
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(product.id);
    };

    const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    };

    const handleNextImage = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        handlePrevImage(e);
      } else if (e.key === "ArrowRight") {
        handleNextImage(e);
      }
    };

    // Extract fabric from description or tags
    const fabric = product.tags
      .find((tag) => ["cotton", "linen", "linen-blend"].includes(tag))
      ?.toUpperCase();

    // Get color swatches
    const colors = getColorSwatches(product.tags);

    // Get all product images (fallback to featuredImage if images array is empty)
    const allImages =
      product.images.length > 0 ? product.images : [product.featuredImage];
    const currentImage = allImages[currentImageIndex];
    const showNavigation = allImages.length > 1;

    return (
      <div
        ref={ref}
        className={`group relative overflow-hidden transition-all duration-700 cursor-pointer ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: `${index * 50}ms` }}
        onClick={handleProductClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View ${product.title}`}
      >
        {/* Image container with navigation */}
        <div className="aspect-3/4 overflow-hidden bg-stone/5 relative group/image">
          {/* Product images carousel */}
          {currentImage && (
            <img
              src={currentImage.url}
              alt={currentImage.altText || product.title}
              className="w-full h-full object-cover object-center transition-opacity duration-200"
              loading="lazy"
              onError={() => {
                logProductImageFailure(
                  `collection-card:${product.handle}`,
                  rawProduct,
                  product,
                  currentImage.url,
                );
              }}
            />
          )}

          {/* Navigation arrows */}
          {showNavigation && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-stone/20 text-charcoal flex items-center justify-center text-xl font-light transition-all duration-200 hover:bg-white hover:border-charcoal/30 focus:outline-none focus:ring-2 focus:ring-charcoal/30 opacity-0 group-hover/image:opacity-100 focus:opacity-100"
                aria-label="Previous image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-stone/20 text-charcoal flex items-center justify-center text-xl font-light transition-all duration-200 hover:bg-white hover:border-charcoal/30 focus:outline-none focus:ring-2 focus:ring-charcoal/30 opacity-0 group-hover/image:opacity-100 focus:opacity-100"
                aria-label="Next image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter indicator */}
          {showNavigation && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentImageIndex
                      ? "bg-charcoal w-5"
                      : "bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                  aria-current={idx === currentImageIndex ? "true" : "false"}
                />
              ))}
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-5 right-5 z-20 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-300 ${wishlisted
              ? "opacity-100"
              : "opacity-0 group-hover/image:opacity-100"
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
          <SalePrice
            price={product.priceRange.minVariantPrice.amount}
            compareAtPrice={getBestCompareAtPrice(product)}
            className="text-center"
          />

          {/* Color swatches */}
          {colors.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {colors.slice(0, 5).map((color, idx) => (
                <button
                  key={color.name}
                  className={`w-4 h-4 rounded-full border transition-all duration-200 hover:scale-110 ${selectedColorIndex === idx
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
  const [collection, setCollection] = useState<ShopifyCollection | null>(null);
  const [rawProductsByHandle, setRawProductsByHandle] = useState<
    Record<string, unknown>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [activeFilters, setActiveFilters] = useState<ShopifyApiProductFilter[] | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const lastFetchRef = useRef(0);
  const initializedHandle = useRef<string | null>(null);

  // Initial load: collection metadata + products
  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);
    setCollection(null);
    setRawProductsByHandle({});
    setSortBy("featured");
    setActiveFilters(null);

    getCollectionByHandle(collectionHandle)
      .then(({ collection: data, raw }) => {
        if (!active) return;

        if (raw?.products?.edges) {
          const rawMap: Record<string, unknown> = {};
          raw.products.edges.forEach(({ node }) => {
            rawMap[node.handle] = node;
          });
          setRawProductsByHandle(rawMap);
        }

        setCollection(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [collectionHandle]);

  // Re-fetch products when sort or filters change
  useEffect(() => {
    if (loading) return;

    if (initializedHandle.current !== collectionHandle) {
      initializedHandle.current = collectionHandle;
      return;
    }

    const sortConfig = SORT_CONFIG[sortBy];
    const fetchId = ++lastFetchRef.current;
    setProductsLoading(true);

    getProductsByCollection({
      handle: collectionHandle,
      sortKey: sortConfig?.sortKey ?? null,
      reverse: sortConfig?.reverse ?? null,
      filters: activeFilters ?? undefined,
    })
      .then(({ products, raw }) => {
        if (fetchId !== lastFetchRef.current) return;
        const rawMap: Record<string, unknown> = {};
        raw.forEach((node) => {
          rawMap[node.handle] = node;
        });
        setRawProductsByHandle(rawMap);
        setCollection((prev) =>
          prev ? { ...prev, products } : null,
        );
      })
      .catch((err) => {
        if (fetchId !== lastFetchRef.current) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (fetchId === lastFetchRef.current) {
          setProductsLoading(false);
        }
      });
  }, [sortBy, activeFilters, collectionHandle, loading]);

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

  // Convert UI filters to Shopify API filters
  const handleApplyFilters = (uiFilters: {
    size: string[];
    material: string[];
    color: string[];
    price: [number, number];
    fit: string[];
    category: string[];
  }) => {
    const shopifyFilters: ShopifyApiProductFilter[] = [];

    uiFilters.category.forEach((cat) => {
      shopifyFilters.push({ productType: cat });
    });

    uiFilters.size.forEach((size) => {
      shopifyFilters.push({ variantOption: { name: "Size", value: size } });
    });

    uiFilters.material.forEach((mat) => {
      const tag = MATERIAL_TAG_MAP[mat];
      if (tag) shopifyFilters.push({ tag });
    });

    const [priceMin, priceMax] = uiFilters.price;
    shopifyFilters.push({ price: { min: priceMin, max: priceMax } });

    setActiveFilters(shopifyFilters.length > 0 ? shopifyFilters : null);
  };

  if (loading) {
    return (
      <main className="bg-ivory min-h-[100svh]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex items-center justify-center">
          <p className="text-center text-lg text-charcoal font-sans">
            Loading collection...
          </p>
        </div>
      </main>
    );
  }

  if (error || !collection || !collection.products.length) {
    return (
      <main className="bg-ivory min-h-[100svh]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <h1 className="text-center text-2xl text-charcoal font-sans">
            {error ? "Error loading collection" : "Collection not found"}
          </h1>
          {error && (
            <p className="text-center text-sm text-charcoal/60 mt-2 font-sans">
              {error}
            </p>
          )}
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
            {toTitleCase(collectionTitle)}
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
            Products ({collection.products.length})
            {productsLoading && (
              <span className="ml-2 text-warm-brown/60">Loading...</span>
            )}
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
          {collection.products.map((product, index) => (
            <CollectionProductCard
              key={product.id}
              product={product}
              index={index}
              rawProduct={rawProductsByHandle[product.handle] ?? null}
            />
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </main>
  );
};

export default CollectionPage;
