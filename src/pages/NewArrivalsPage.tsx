import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getShopifyProducts } from "../lib/shopifyProducts";
import type { ShopifyProduct } from "../types";


// ── Shirt sizes shown in the hover panel ──────────────────────────────────────
const SIZES = ["S", "M", "L", "XL"];
const WISHLIST_KEY = "wishlist";

const readWishlist = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeWishlist = (ids: string[]) =>
  sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = ({
  product,
  wishlisted,
  onWishlistToggle,
}: {
  product: ShopifyProduct;
  wishlisted: boolean;
  onWishlistToggle: (id: string) => void;
}) => {
  console.log("PRODUCTCARD RENDER", product.title);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const handleProductClick = () => {
    navigate(`/products/${product.handle}`);
  };

  return (
    <article
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setAddedSize(null);
      }}
      onClick={handleProductClick}
    >
      {/* Image wrapper */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#f0ede8]">
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          className="w-full h-full object-cover object-top
                     transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* ── Bookmark icon ─────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          className={`absolute top-3 right-3 z-20 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-200
            ${wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
            <path d="M6 2h12v16l-6-4l-6 4V2z" />
          </svg>
        </button>

        {/* ── Size selector panel — slides up on hover ────────────────────── */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out
            ${hovered ? "translate-y-0" : "translate-y-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#f5f2ed]/96 backdrop-blur-sm px-4 pt-4 pb-3">
            {addedSize ? (
              /* Confirmation state */
              <p className="text-center font-sans text-[11px] uppercase tracking-[0.18em] text-[#555] py-2">
                Added to bag — {addedSize} ✓
              </p>
            ) : (
              <>
                <p
                  className="text-center font-sans text-[9px] uppercase tracking-[0.2em]
                              text-[#999] mb-2.5"
                >
                  Select size
                </p>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setAddedSize(size);
                        setTimeout(() => setAddedSize(null), 1800);
                      }}
                      className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#444]
                                 hover:text-[#111] hover:font-semibold transition-all duration-100
                                 py-0.5"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="pt-3 pb-2">
        <p className="font-sans text-[12px] tracking-[0.03em] text-[#111] leading-snug truncate">
          {product.title}
        </p>
        <p className="font-sans text-[12px] text-[#888] mt-1 tracking-[0.02em] tabular-nums">
          ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
};

// ── New Arrivals page ─────────────────────────────────────────────────────────────────
// Shows exactly 4 featured products in a full-width editorial grid.
const NewArrivalsPage = () => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(readWishlist);

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeWishlist(next);
      return next;
    });
  };

  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getShopifyProducts(4)
      .then((data) => {
        if (active) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="bg-[#F7F5F2] min-h-[100svh] pb-24">
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
              <div key={product.id} className="bg-[#F7F5F2] p-0">
                <ProductCard
                  product={product}
                  wishlisted={wishlistIds.includes(product.id)}
                  onWishlistToggle={toggleWishlist}
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
