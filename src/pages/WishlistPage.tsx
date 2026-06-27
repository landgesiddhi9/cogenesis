import { useState, useRef, useEffect } from "react";
import { getShopifyProducts, getShopifyProductsByIds } from "../lib/shopifyProducts";
import type { ShopifyProduct } from "../types";

// ── Wishlist sessionStorage helpers ──────────────────────────────────────────
// Matches the key used in CollectionPage so wishlist state is shared site-wide
const WISHLIST_KEY = "wishlist";

const readIds = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeIds = (ids: string[]) =>
  sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));

// ── Bookmark icon ─────────────────────────────────────────────────────────────
const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={filled ? "#431c1c" : "none"}
    stroke={filled ? "#431c1c" : "white"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2h12v16l-6-4l-6 4V2z" />
  </svg>
);

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = ({
  product,
  wishlisted,
  onToggle,
}: {
  product: ShopifyProduct;
  wishlisted: boolean;
  onToggle: (id: string) => void;
}) => (
  <article className="group relative flex flex-col">
    {/* Image container — editorial portrait ratio, zero borders */}
    <div className="relative overflow-hidden aspect-[3/4] bg-[#eeece8]">
      <img
        src={product.featuredImage.url}
        alt={product.featuredImage.altText}
        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* Bookmark — always visible when wishlisted, shown on hover otherwise */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(product.id);
        }}
        className={`absolute top-3 right-3 z-20 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-200
          ${wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <BookmarkIcon filled={wishlisted} />
      </button>
    </div>

    {/* Product info */}
    <div className="pt-3 pb-3">
      <p className="font-sans text-[12px] tracking-[0.03em] text-[#111] leading-snug truncate">
        {product.title}
      </p>
      <p className="font-sans text-[12px] text-[#888] mt-1 tracking-[0.02em] tabular-nums">
        ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
      </p>
    </div>
  </article>
);

// ── Checkmark row ─────────────────────────────────────────────────────────────
const CheckRow = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3">
    <svg
      width="11"
      height="9"
      viewBox="0 0 11 9"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 4.5L3.8 7.5L10 1"
        stroke="#999"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="font-sans text-[13px] text-[#888] tracking-[0.02em]">
      {text}
    </span>
  </li>
);

// ── Arrow button ──────────────────────────────────────────────────────────────
const ArrowBtn = ({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="text-[#111] hover:opacity-35 transition-opacity duration-150"
    aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dir === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  </button>
);

// ── Wishlist page ─────────────────────────────────────────────────────────────
const WishlistPage = () => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(readIds);
  const [wishlistProducts, setWishlistProducts] = useState<ShopifyProduct[]>([]);
  const [popularProducts, setPopularProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    Promise.all([
      getShopifyProductsByIds(wishlistIds),
      getShopifyProducts(12)
    ])
      .then(([wishlistData, popularData]) => {
        if (active) {
          setWishlistProducts(wishlistData);
          setPopularProducts(popularData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching wishlist products:", err);
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [wishlistIds]);

  // Toggle wishlist membership and persist
  const toggle = (id: string) => {
    const nextIds = wishlistIds.includes(id)
      ? wishlistIds.filter((x) => x !== id)
      : [...wishlistIds, id];
    writeIds(nextIds);
    setWishlistIds(nextIds);
    setWishlistProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Scroll the Popular strip by exactly one card width
  const scrollStrip = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild?.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 1 : 280;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="bg-ivory min-h-[100svh] pb-24 flex flex-col">
        <div className="h-14 md:h-16" />
        <header className="px-10 md:px-16 pt-6 md:pt-8 pb-8">
          <h1 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111]">
            My Wishlist
          </h1>
        </header>
        <section className="flex flex-col items-center justify-center pt-10 pb-16 px-6 flex-1">
          <p className="font-sans text-[13px] text-[#888] tracking-[0.02em]">
            Loading your favorites...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-ivory min-h-[100svh] pb-24">
      {/* Fixed navbar offset */}
      <div className="h-14 md:h-16" />

      {/* ── Page title ──────────────────────────────────────────────────────── */}
      <header className="px-10 md:px-16 pt-6 md:pt-8 pb-8">
        <h1 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111]">
          My Wishlist
        </h1>
      </header>

      {/* ── Wishlist: empty state vs. filled grid ──────────────────────────── */}
      {wishlistProducts.length === 0 ? (
        /* Empty state — centred, generous whitespace */
        <section
          className="flex flex-col items-center justify-center
                     pt-10 pb-16 md:pt-14 md:pb-24 px-6"
          aria-label="Empty wishlist"
        >
          <h2 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111] mb-7">
            Your Wishlist Is Empty
          </h2>
          <ul className="space-y-3 list-none p-0">
            <CheckRow text="Use the bookmark icon to add or remove favourites" />
            <CheckRow text="Access your wishlist from any device" />
          </ul>
        </section>
      ) : (
        /* Filled grid — responsive auto-fill, consistent card sizes */
        <section
          className="px-10 md:px-16 mb-16"
          aria-label="Wishlist products"
        >
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {wishlistProducts.map((p) => (
              <ProductCard key={p.id} product={p} wishlisted onToggle={toggle} />
            ))}
          </div>
        </section>
      )}

      {/* ── Popular Right Now ────────────────────────────────────────────────── */}
      <section className="px-10 md:px-16 mt-2 md:mt-4" aria-label="Popular right now">
        {/* Section header + arrow controls */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111]">
            Popular Right Now
          </h2>
          <div className="flex items-center gap-5">
            <ArrowBtn dir="left"  onClick={() => scrollStrip("left")}  />
            <ArrowBtn dir="right" onClick={() => scrollStrip("right")} />
          </div>
        </div>

        {/*
         * Scroll container — hidden scrollbar, snap on each card.
         *
         * Card widths by breakpoint:
         *   mobile  : 2 visible  → calc(50vw  - padding - gap)
         *   tablet  : 3 visible  → calc(33vw  - padding - gap)
         *   desktop : 5 visible  → calc(20vw  - padding - gap)
         *
         * px-10 = 2.5rem per side → total 5rem; px-16 = 4rem per side → 8rem
         * gap-[1px] between cards → (n-1) ≈ negligible subtracted
         */}
        <div
          ref={scrollRef}
          className="overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-[1px]">
            {popularProducts.map((p) => (
              <div
                key={p.id}
                className="
                  flex-none
                  w-[calc(50vw-2.8rem)]
                  sm:w-[calc(33.333vw-2.2rem)]
                  lg:w-[calc(20vw-1.7rem)]
                  scroll-snap-align-start
                "
              >
                <ProductCard
                  product={p}
                  wishlisted={wishlistIds.includes(p.id)}
                  onToggle={toggle}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default WishlistPage;
