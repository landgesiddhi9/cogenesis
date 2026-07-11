import { useState, useRef, useEffect } from "react";
import { useWishlist } from "../hooks/useWishlist";
import { getFeaturedProducts } from "../services/product.service";
import { getWishlistProductsByIds } from "../services/wishlist.service";
import type { ShopifyProduct } from "../types";
import ProductCard from "../components/ProductCard";

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
  const { wishlistIds, toggleWishlist, isWishlisted } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<ShopifyProduct[]>([]);
  const [popularProducts, setPopularProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevIds, setPrevIds] = useState(wishlistIds);

  if (wishlistIds !== prevIds) {
    setPrevIds(wishlistIds);
    setLoading(true);
  }

  useEffect(() => {
    let active = true;

    Promise.all([
      getWishlistProductsByIds(wishlistIds),
      getFeaturedProducts(12),
    ])
      .then(([wishlistData, { products: popularData }]) => {
        if (!active) return;

        setWishlistProducts(wishlistData);
        setPopularProducts(popularData);
      })
      .catch(() => {
        if (!active) return;

        setWishlistProducts([]);
        setPopularProducts([]);
      })
      .finally(() => {
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
    toggleWishlist(id);
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
        /* Filled grid — flex-wrap, same card widths as Popular Right Now */
        <section
          className="px-10 md:px-16 mb-16"
          aria-label="Wishlist products"
        >
          <div className="flex flex-wrap gap-[1px]">
            {wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="
                  flex-none
                  w-[calc(50vw-2.8rem)]
                  sm:w-[calc(33.333vw-2.2rem)]
                  lg:w-[calc(20vw-1.7rem)]
                "
              >
                <ProductCard product={p} wishlisted={true} onWishlistToggle={toggle} showImageControls={false} />
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
                  wishlisted={isWishlisted(p.id)}
                  onWishlistToggle={toggle}
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
