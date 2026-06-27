import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrCreateCart,
  getCart,
  addCartLine,
  updateCartLine,
  removeCartLine,
  type ShopifyCartDetails,
  type ShopifyCartLineItem,
} from "../lib/shopifyCart";
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
  onCartChange,
}: {
  product: ShopifyProduct;
  wishlisted: boolean;
  onToggle: (id: string) => void;
  onCartChange?: () => void | Promise<void>;
}) => {
  const [hovered, setHovered] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const handleAdd = async (size: string) => {
    try {
      const cartId = await getOrCreateCart();
      const merchandiseId = product.variants[0]?.id;
      if (!merchandiseId) {
        console.error("No variant found for product:", product.id);
        return;
      }
      await addCartLine(cartId, merchandiseId, 1);
      await onCartChange?.();
      setAddedSize(size);
      setTimeout(() => setAddedSize(null), 1800);
    } catch (error) {
      console.error("Failed to add to Shopify cart:", error);
    }
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

// ── Promo-code accordion ──────────────────────────────────────────────────────
const PromoAccordion = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="pt-5 border-t border-[#ebebeb]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-sans text-[13px] text-[#333] tracking-[0.02em]">
          Do you have a promotional code?
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 5l5 5 5-5"
            stroke="#333"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 border-b border-[#222] bg-transparent font-sans text-[13px]
                       text-[#111] py-2 outline-none placeholder:text-[#bbb] tracking-[0.02em]"
          />
          <button
            type="button"
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em]
                       text-[#111] hover:opacity-50 transition-opacity px-3 py-2"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

// ── Cart item row ─────────────────────────────────────────────────────────────
const CartItemRow = ({
  line,
  onRemove,
  onQtyChange,
}: {
  line: ShopifyCartLineItem;
  onRemove: (lineId: string) => void;
  onQtyChange: (lineId: string, qty: number) => void;
}) => {
  const image = line.merchandise.product.featuredImage;
  const unitPrice = parseFloat(line.merchandise.price.amount);

  return (
  <div className="flex gap-6 md:gap-8 pb-10 mb-10 border-b border-[#ebebeb]">
    {/* Product image */}
    <div className="relative flex-none w-[160px] md:w-[220px] aspect-[3/4] bg-[#eeece8] overflow-hidden">
      <img
        src={image?.url ?? ""}
        alt={image?.altText ?? line.merchandise.product.title}
        className="w-full h-full object-cover object-top"
      />
      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(line.id)}
        className="absolute top-3 right-3 w-7 h-7 bg-white flex items-center justify-center
                   text-[#111] hover:bg-[#111] hover:text-white transition-colors duration-150"
        aria-label="Remove item"
      >
        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>

    {/* Details */}
    <div className="flex flex-col justify-between py-1 min-w-0">
      <div>
        <p className="font-sans text-[14px] text-[#111] tracking-[0.02em] leading-snug mb-1">
          {line.merchandise.product.title}
        </p>
        <p className="font-sans text-[12px] text-[#999] tracking-[0.02em] mb-3">
          Size: <span className="text-[#555]">{line.merchandise.title}</span>
        </p>
        <p className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
          ₹{(unitPrice * line.quantity).toLocaleString("en-IN")}
        </p>
        <p className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
          ₹{unitPrice.toLocaleString("en-IN")} each
        </p>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-4 mt-6">
        <button
          type="button"
          onClick={() => onQtyChange(line.id, line.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center border border-[#ddd]
                     font-sans text-[16px] text-[#111] hover:border-[#111] transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="font-sans text-[13px] text-[#111] w-5 text-center select-none">
          {line.quantity}
        </span>
        <button
          type="button"
          onClick={() => onQtyChange(line.id, line.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center border border-[#ddd]
                     font-sans text-[16px] text-[#111] hover:border-[#111] transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  </div>
  );
};

// ── Cart page ─────────────────────────────────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<ShopifyCartDetails | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
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

  const refreshCart = async () => {
    const id = await getOrCreateCart();
    setCartId(id);
    const updated = await getCart(id);
    setCart(updated);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleRemove = async (lineId: string) => {
    if (!cartId) return;
    await removeCartLine(cartId, lineId);
    const updated = await getCart(cartId);
    setCart(updated);
  };

  const handleQty = async (lineId: string, qty: number) => {
    if (!cartId) return;
    if (qty <= 0) {
      await removeCartLine(cartId, lineId);
    } else {
      await updateCartLine(cartId, lineId, qty);
    }
    const updated = await getCart(cartId);
    setCart(updated);
  };

  if (cart === null) {
    return (
      <main className="bg-[#F7F5F2] min-h-[100svh] pb-24">
        <div className="h-14 md:h-16" />
      </main>
    );
  }

  const lines = cart.lines;
  const totalItems = lines.reduce((s, i) => s + i.quantity, 0);
  const subtotal = lines.reduce(
    (s, i) => s + parseFloat(i.merchandise.price.amount) * i.quantity,
    0,
  );
  const shipping = subtotal > 0 && subtotal < 4999 ? 299 : 0;
  const total = subtotal + shipping;

  // ── Empty state ─────────────────────────────────────────────────────────────────
  if (lines.length === 0) {
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
                    onCartChange={refreshCart}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ── Filled cart ────────────────────────────────────────────────────────────
  return (
    <main className="bg-[#F7F5F2] min-h-[100svh] pb-24">
      <div className="h-14 md:h-16" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-16 pt-10 md:pt-14">
        {/* Page title */}
        <h1 className="font-sans text-[14px] font-bold uppercase tracking-[0.22em] text-[#111] mb-12">
          Shopping Bag ({totalItems})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 xl:gap-20">
          {/* ── Left: line items ──────────────────────────────────────────── */}
          <div>
            {lines.map((line) => (
              <CartItemRow
                key={line.id}
                line={line}
                onRemove={handleRemove}
                onQtyChange={handleQty}
              />
            ))}
          </div>

          {/* ── Right: order summary ──────────────────────────────────────── */}
          <div className="lg:sticky lg:top-[5.5rem] h-fit">
            <div className="bg-white p-8">
              {/* Free delivery notice */}
              {shipping > 0 && (
                <p className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums mb-6 pb-6 border-b border-[#ebebeb]">
                  Add ₹{(4999 - subtotal).toLocaleString("en-IN")} more for free delivery
                </p>
              )}
              {shipping === 0 && subtotal > 0 && (
                <p className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums mb-6 pb-6 border-b border-[#ebebeb]">
                  ✓ You qualify for free home delivery
                </p>
              )}

              {/* Line totals */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
                    Subtotal
                  </span>
                  <span className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
                    Delivery
                  </span>
                  <span className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-[#ebebeb]">
                  <span className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
                    Total
                  </span>
                  <div className="text-right">
                    <p className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                    <p className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
                      Taxes included
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = cart.checkoutUrl;
                }}
                className="w-full h-[52px] bg-[#111] text-white font-sans
                           text-[12px] font-semibold uppercase tracking-[0.2em]
                           hover:bg-[#2a2a2a] transition-colors duration-200 mb-6"
              >
                Proceed To Checkout
              </button>

              <PromoAccordion />

              {/* Returns */}
              <div className="mt-6 pt-5 border-t border-[#ebebeb]">
                <p className="font-sans text-[12px] text-[#777] mb-2 tracking-[0.01em]">
                  Free returns in 30 days
                </p>
                <button
                  type="button"
                  className="font-sans text-[11px] font-semibold uppercase
                             tracking-[0.14em] text-[#111] hover:opacity-50 transition-opacity"
                >
                  View Delivery and Returns
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
