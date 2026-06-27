import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productStripItems } from "../data/mockData";
import type { ShopifyProduct } from "../types";

// ── Shared constants for the product strip ─────────────────────────────────────────
const SIZES = ["S", "M", "L", "XL"];
const WL_KEY = "wishlist";
const readWL = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(WL_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeWL = (ids: string[]) =>
  sessionStorage.setItem(WL_KEY, JSON.stringify(ids));

// ── Mini product card for "May Interest You" strip ─────────────────────────────
const StripCard = ({
  product,
  wishlisted,
  onToggle,
}: {
  product: ShopifyProduct;
  wishlisted: boolean;
  onToggle: (id: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const handleAdd = async (size: string) => {
    console.log("Cart integration temporarily removed.");
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1800);
  };

  return (
    <article
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setAddedSize(null);
      }}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-[#f0ede8]">
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Bookmark */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(product.id);
          }}
          className={`absolute top-3 right-3 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-200
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

        {/* Size panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out
          ${hovered ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="bg-[#f5f2ed]/96 backdrop-blur-sm px-4 pt-3 pb-3">
            {addedSize ? (
              <p className="text-center font-sans text-[10px] uppercase tracking-[0.18em] text-[#555] py-1">
                Added — {addedSize} ✓
              </p>
            ) : (
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAdd(s)}
                    className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#444]
                               hover:text-[#111] hover:font-semibold transition-all duration-100 py-0.5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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

// ── Scroll arrow ─────────────────────────────────────────────────────────────
const StripArrow = ({
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
    aria-label={dir === "left" ? "Previous" : "Next"}
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

// ── Cart page ─────────────────────────────────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();
  // "May Interest You" strip state
  const stripRef = useRef<HTMLDivElement>(null);
  const [wlIds, setWlIds] = useState<string[]>(readWL);
  const toggleWl = (id: string) =>
    setWlIds((p) => {
      const n = p.includes(id) ? p.filter((x) => x !== id) : [...p, id];
      writeWL(n);
      return n;
    });
  const scrollStrip = (dir: "left" | "right") => {
    const el = stripRef.current;
    if (!el) return;
    const card = el.firstElementChild?.firstElementChild as HTMLElement | null;
    el.scrollBy({
      left:
        dir === "right"
          ? (card?.offsetWidth ?? 280) + 1
          : -((card?.offsetWidth ?? 280) + 1),
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-[#F7F5F2] min-h-[100svh] pb-24 flex flex-col">
      <div className="h-14 md:h-16" />

      {/* ── Hero empty-state message ───────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center text-center px-6 flex-1 py-16 md:py-28">
        <div className="max-w-md">
          <h1 className="font-sans text-[15px] font-bold uppercase tracking-[0.22em] text-[#111] mb-8">
            Your Shopping Bag Is Empty
          </h1>
          <p className="font-sans text-[14px] text-[#777] tracking-[0.02em] mb-12 max-w-sm mx-auto">
            Get inspiration for your new wardrobe from the latest looks
          </p>
          <button
            type="button"
            onClick={() => navigate("/new-arrivals")}
            className="w-full max-w-[460px] h-[52px] bg-[#111] text-white font-sans
                       text-[12px] font-semibold uppercase tracking-[0.2em]
                       hover:bg-[#2a2a2a] transition-colors duration-200"
          >
            See What's New
          </button>
        </div>
      </div>

      {/* ── May Interest You strip ──────────────────────────────────────────── */}
      <section className="px-10 md:px-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sans text-[13px] font-semibold uppercase text-[#111]">
            May Interest You
          </h2>
          <div className="flex items-center gap-5">
            <StripArrow dir="left" onClick={() => scrollStrip("left")} />
            <StripArrow dir="right" onClick={() => scrollStrip("right")} />
          </div>
        </div>

        <div
          ref={stripRef}
          className="overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-[1px]">
            {productStripItems.map((p) => (
              <div
                key={p.id}
                className="flex-none
                           w-[calc(50vw-2.8rem)]
                           sm:w-[calc(33.333vw-2.2rem)]
                           lg:w-[calc(20vw-1.7rem)]"
              >
                <StripCard
                  product={p}
                  wishlisted={wlIds.includes(p.id)}
                  onToggle={toggleWl}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
