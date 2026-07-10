import { useState, useEffect } from "react";
import { getFeaturedProducts } from "../services/product.service";
import type { ShopifyProduct } from "../types";
import ProductCard from "../components/ProductCard";


// ── Shirt sizes shown in the hover panel ──────────────────────────────────────
const SIZES = ["S", "M", "L", "XL"];

// ── Size selector panel — slides up on hover ──────────────────────────────────
const SizeSelector = () => {
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const handleAdd = (size: string) => {
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1800);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0">
      <div className="bg-[#f5f2ed]/96 backdrop-blur-sm px-4 pt-4 pb-3">
        {addedSize ? (
          <p className="text-center font-sans text-[11px] uppercase tracking-[0.18em] text-[#555] py-2">
            Added to bag — {addedSize} ✓
          </p>
        ) : (
          <>
            <p className="text-center font-sans text-[9px] uppercase tracking-[0.2em] text-[#999] mb-2.5">
              Select size
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(s); }}
                  className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#444] hover:text-[#111] hover:font-semibold transition-all duration-100 py-0.5"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── New Arrivals page ─────────────────────────────────────────────────────────────────
// Shows exactly 4 featured products in a full-width editorial grid.
const NewArrivalsPage = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getFeaturedProducts(4)
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

  return (
    <main className="bg-ivory min-h-[100svh] pb-24">
      <div className="h-14 md:h-16" />

      {/* ── Page header ──────────────────────────────────────────────── */}
      <header className="px-10 md:px-16 pt-10 md:pt-14 pb-10">
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#aaa] mb-3">
          Collection
        </p>
        <h1 className="font-sans text-[28px] md:text-[36px] font-light tracking-[-0.5px] text-[#111]">
          What's New
        </h1>
      </header>

      {/* ── 4-product editorial grid ─────────────────────────────────────── */}
      <section className="px-10 md:px-16" aria-label="New arrivals products">
        {loading ? (
          <div className="text-center py-20">
            <p className="font-sans text-[13px] text-[#888] tracking-[0.02em]">
              Loading...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#e0ddd8]">
            {products.map((product) => (
              <div key={product.id} className="bg-ivory p-0">
                <ProductCard
                  product={product}
                  imageChildren={<SizeSelector />}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default NewArrivalsPage;
