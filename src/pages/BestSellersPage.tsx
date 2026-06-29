import { useState, useEffect } from "react";
import { getBestSellerProducts } from "../services/men.service";
import SortDropdown from "../components/SortDropdown";
import FilterPanel from "../components/FilterPanel";
import LayoutSwitcher from "../components/LayoutSwitcher";
import ProductCard from "../components/ProductCard";
import type { ShopifyProduct } from "../types";
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

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "best-selling", label: "Best Selling" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "a-z", label: "Alphabetically A–Z" },
  { id: "z-a", label: "Alphabetically Z–A" },
];

const BestSellersPage = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(4);
  const [sortBy, setSortBy] = useState("best-selling");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ShopifyApiProductFilter[] | null>(null);
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getBestSellerProducts()
      .then((result) => {
        if (!active) return;
        setAllProducts(result);
        setProducts(result);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    let sorted = [...allProducts];

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

    if (activeFilters && activeFilters.length > 0) {
      const productTypeFilters = activeFilters.filter((f) => f.productType);
      const otherFilters = activeFilters.filter((f) => !f.productType);

      sorted = sorted.filter((p) => {
        if (productTypeFilters.length > 0) {
          const matchesProductType = productTypeFilters.some(
            (f) => f.productType === p.productType,
          );
          if (!matchesProductType) return false;
        }

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
  }, [sortBy, activeFilters, allProducts]);

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
    const shopifyFilters: ShopifyApiProductFilter[] = [];

    uiFilters.category.forEach((cat) => {
      shopifyFilters.push({ productType: cat });
    });

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

    setActiveFilters(shopifyFilters.length > 0 ? shopifyFilters : null);
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
            Best Sellers
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
              <ProductCard animate
                key={product.id}
                product={product}
                index={index}
              />
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

export default BestSellersPage;
