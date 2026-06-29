import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import { useWishlist } from "../hooks/useWishlist";
import { getProductsFromMenCollections } from "../services/men.service";
import { getProductsByCollection } from "../services/collection.service";
import SortDropdown from "../components/SortDropdown";
import FilterPanel from "../components/FilterPanel";
import LayoutSwitcher from "../components/LayoutSwitcher";
import type { ShopifyProduct } from "../types";
import type { ShopifyApiProductFilter, ShopifyProductSortKeys } from "../graphql/queries/getProductsByCollection";

const CATEGORY_COLLECTION_MAP: Record<string, string> = {
  Shirts: "shirts",
  Trousers: "trousers",
};

const SORT_CONFIG: Record<string, { sortKey: ShopifyProductSortKeys; reverse: boolean } | null> = {
  featured: null,
  newest: { sortKey: "CREATED", reverse: true },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  "price-low": { sortKey: "PRICE", reverse: false },
  "price-high": { sortKey: "PRICE", reverse: true },
  "a-z": { sortKey: "TITLE", reverse: false },
  "z-a": { sortKey: "TITLE", reverse: true },
};

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "best-selling", label: "Best Selling" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "a-z", label: "Alphabetically A–Z" },
  { id: "z-a", label: "Alphabetically Z–A" },
];

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleProductClick = () => {
    navigate(`/products/${product.handle}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden transition-all duration-700 cursor-pointer ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={handleProductClick}
    >
      <div className="aspect-[3/4] overflow-hidden bg-[#f0ede8] relative">
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 z-20 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-300 ${
            wishlisted
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#431c1c" : "none"}
            stroke={wishlisted ? "#431c1c" : "white"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2h12v16l-6-4l-6 4V2z" />
          </svg>
        </button>
      </div>

      <div className="pt-4 pb-3 px-0">
        <h3 className="font-sans text-[13px] md:text-[14px] tracking-[0.03em] text-[#111] leading-snug truncate">
          {product.title}
        </h3>
        <p className="font-sans text-[12px] text-[#888] mt-1 tracking-[0.02em] tabular-nums">
          ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
};

const ViewAllPage = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(4);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [otherFilters, setOtherFilters] = useState<ShopifyApiProductFilter[] | null>(null);
  const [baseProducts, setBaseProducts] = useState<ShopifyProduct[]>([]);

  const fetchCategoryProducts = useCallback(async (categories: string[]) => {
    if (categories.length === 0) {
      const result = await getProductsFromMenCollections();
      return result;
    }

    const handles = categories.map((cat) => CATEGORY_COLLECTION_MAP[cat]).filter(Boolean);
    if (handles.length === 0) return [];

    const results = await Promise.all(
      handles.map((h) => getProductsByCollection({ handle: h })),
    );

    const seen = new Set<string>();
    return results.flatMap(({ products }) =>
      products.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      }),
    );
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchCategoryProducts(selectedCategories)
      .then((result) => {
        if (!active) return;
        setBaseProducts(result);
      })
      .catch(() => {
        if (active) setBaseProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [selectedCategories, fetchCategoryProducts]);

  useEffect(() => {
    let sorted = [...baseProducts];

    const sortConfig = SORT_CONFIG[sortBy];
    if (sortConfig) {
      sorted.sort((a, b) => {
        let comparison = 0;
        if (sortConfig.sortKey === "PRICE") {
          const aPrice = parseFloat(a.priceRange.minVariantPrice.amount);
          const bPrice = parseFloat(b.priceRange.minVariantPrice.amount);
          comparison = aPrice - bPrice;
        } else if (sortConfig.sortKey === "TITLE") {
          comparison = a.title.localeCompare(b.title);
        } else if (sortConfig.sortKey === "CREATED") {
          comparison = a.id.localeCompare(b.id);
        }
        return sortConfig.reverse ? -comparison : comparison;
      });
    }

    if (otherFilters && otherFilters.length > 0) {
      sorted = sorted.filter((p) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        return otherFilters.every((f) => {
          if (f.price) {
            if (f.price.min && price < f.price.min) return false;
            if (f.price.max && price > f.price.max) return false;
          }
          if (f.tag && !p.tags.includes(f.tag)) return false;
          if (f.variantOption) {
            const match = p.variants.some(
              (v) => v.title === f.variantOption?.value,
            );
            if (!match) return false;
          }
          return true;
        });
      });
    }

    setProducts(sorted);
  }, [sortBy, otherFilters, baseProducts]);

  const gridCols =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-4";

  const handleApplyFilters = (uiFilters: {
    size: string[];
    material: string[];
    color: string[];
    price: [number, number];
    fit: string[];
    category: string[];
  }) => {
    setSelectedCategories(uiFilters.category);

    const shopifyFilters: ShopifyApiProductFilter[] = [];

    uiFilters.size.forEach((size) => {
      shopifyFilters.push({ variantOption: { name: "Size", value: size } });
    });

    const MATERIAL_TAG_MAP: Record<string, string> = {
      Linen: "linen",
      Cotton: "cotton",
      "Cotton Linen Blend": "linen-blend",
    };

    uiFilters.material.forEach((mat) => {
      const tag = MATERIAL_TAG_MAP[mat];
      if (tag) shopifyFilters.push({ tag });
    });

    const [priceMin, priceMax] = uiFilters.price;
    shopifyFilters.push({ price: { min: priceMin, max: priceMax } });

    setOtherFilters(shopifyFilters.length > 0 ? shopifyFilters : null);
  };

  return (
    <main className="bg-ivory min-h-[100svh]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-light tracking-wide text-charcoal mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              letterSpacing: "0.05em",
              fontWeight: 400,
            }}
          >
            View All
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="shrink-0 w-8 h-px bg-stone/20"></div>
            <div className="shrink-0 w-2 h-2 rounded-full bg-stone/20"></div>
            <div className="shrink-0 w-8 h-px bg-stone/20"></div>
          </div>
        </div>

        <div className="border-t border-b border-stone/10 py-4 mb-12 flex items-center justify-between">
          <div className="text-sm text-charcoal/70 tracking-wide font-sans">
            Products ({products.length})
            {loading && <span className="ml-2 text-warm-brown/60">Loading...</span>}
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="text-sm text-charcoal/70 hover:text-charcoal transition-colors tracking-wide font-sans"
            >
              Filter
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-charcoal/70 tracking-wide font-sans">Sort:</label>
              <SortDropdown options={sortOptions} selectedId={sortBy} onSelect={setSortBy} />
            </div>

            <LayoutSwitcher columns={columns} onChange={setColumns} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-center text-lg text-charcoal font-sans">Loading...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-center text-lg text-charcoal font-sans">No products found.</p>
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-6 md:gap-8`}>
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </main>
  );
};

export default ViewAllPage;
