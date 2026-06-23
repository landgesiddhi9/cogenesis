import { useState, useRef } from "react";
import { productStripItems } from "../data/mockData";
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

// ── Heart icon ────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#111" : "none"}
    stroke={filled ? "#111" : "white"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

      {/* Heart — always visible when wishlisted, shown on hover otherwise */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(product.id);
        }}
        className={`absolute top-3 right-3 w-7 h-7 flex items-center justify-center
          rounded-full backdrop-blur-sm transition-all duration-200
          ${wishlisted
            ? "opacity-100 bg-white/90"
            : "opacity-0 group-hover:opacity-100 bg-white/30"
          }`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <HeartIcon filled={wishlisted} />
      </button>
    </div>

    {/* Product info */}
    <div className="pt-3 pb-3">
      <p className="font-sans text-[12px] tracking-[0.03em] text-[#111] leading-snug truncate">
        {product.title}
      </p>
      <p className="font-sans text-[12px] text-[#888] mt-1 tracking-[0.02em]">
        ₹{product.priceRange.minVariantPrice.amount}
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const wishlistProducts = productStripItems.filter((p) =>
    wishlistIds.includes(p.id)
  );

  // Toggle wishlist membership and persist
  const toggle = (id: string) => {
    setWishlistIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeIds(next);
      return next;
    });
  };

  // Scroll the Popular strip by exactly one card width
  const scrollStrip = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild?.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 1 : 280;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  return (
    <main className="bg-ivory min-h-[100svh] pb-24">
      {/* Fixed navbar offset */}
      <div className="h-14 md:h-16" />

      {/* ── Page title ──────────────────────────────────────────────────────── */}
      <header className="px-10 md:px-16 pt-10 md:pt-14 pb-8">
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
            <CheckRow text="Use the hearts to add or remove favourites" />
            <CheckRow text="Access your wishlist from any device" />
          </ul>
        </section>
      ) : (
        /* Filled grid — editorial 1-px gap, no card borders */
        <section
          className="px-10 md:px-16 mb-16"
          aria-label="Wishlist products"
        >
          {/*
           * The 1-px gap trick: set gap-[1px] + a warm-gray bg on the grid,
           * then fill each cell with bg-ivory — the grid bg becomes the "border".
           */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[1px] bg-[#e4e1db]">
            {wishlistProducts.map((p) => (
              <div key={p.id} className="bg-ivory px-2 pt-1">
                <ProductCard product={p} wishlisted onToggle={toggle} />
              </div>
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
            {productStripItems.map((p) => (
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
