import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  readCart,
  removeFromCart,
  updateCartQty,
  addToCart,
  CART_EVENT,
  type CartItem,
} from "../utils/cart";
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

  const handleAdd = (size: string) => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.priceRange.minVariantPrice.amount,
      image: product.featuredImage.url,
      imageAlt: product.featuredImage.altText,
      size,
    });
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

        {/* Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(product.id);
          }}
          className={`absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full
            backdrop-blur-sm transition-all duration-200
            ${wishlisted ? "opacity-100 bg-white/90" : "opacity-0 group-hover:opacity-100 bg-white/30"}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#111" : "none"}
            stroke={wishlisted ? "#111" : "white"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
        <p className="font-sans text-[12px] text-[#888] mt-1">
          ₹{product.priceRange.minVariantPrice.amount}
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
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartItem;
  onRemove: (id: string, size: string) => void;
  onQtyChange: (id: string, size: string, qty: number) => void;
}) => (
  <div className="flex gap-6 md:gap-8 pb-10 mb-10 border-b border-[#ebebeb]">
    {/* Product image */}
    <div className="relative flex-none w-[160px] md:w-[220px] aspect-[3/4] bg-[#eeece8] overflow-hidden">
      <img
        src={item.image}
        alt={item.imageAlt}
        className="w-full h-full object-cover object-top"
      />
      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(item.productId, item.size)}
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
          {item.title}
        </p>
        <p className="font-sans text-[12px] text-[#999] tracking-[0.02em] mb-3">
          Size: <span className="text-[#555]">{item.size}</span>
        </p>
        <p className="font-sans text-[15px] font-medium text-[#111]">
          ₹{(parseFloat(item.price) * item.quantity).toLocaleString("en-IN")}
        </p>
        <p className="font-sans text-[11px] text-[#aaa] mt-0.5">
          ₹{parseFloat(item.price).toLocaleString("en-IN")} each
        </p>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-4 mt-6">
        <button
          type="button"
          onClick={() =>
            onQtyChange(item.productId, item.size, item.quantity - 1)
          }
          className="w-7 h-7 flex items-center justify-center border border-[#ddd]
                     font-sans text-[16px] text-[#111] hover:border-[#111] transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="font-sans text-[13px] text-[#111] w-5 text-center select-none">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() =>
            onQtyChange(item.productId, item.size, item.quantity + 1)
          }
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

// ── Cart page ─────────────────────────────────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(readCart);
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

  // Re-sync whenever any tab/component writes to the cart
  useEffect(() => {
    const sync = () => setCart(readCart());
    window.addEventListener(CART_EVENT, sync);
    return () => window.removeEventListener(CART_EVENT, sync);
  }, []);

  const handleRemove = (id: string, size: string) => {
    removeFromCart(id, size);
    setCart(readCart());
  };

  const handleQty = (id: string, size: string, qty: number) => {
    updateCartQty(id, size, qty);
    setCart(readCart());
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce(
    (s, i) => s + parseFloat(i.price) * i.quantity,
    0,
  );
  const shipping = subtotal > 0 && subtotal < 4999 ? 299 : 0;
  const total = subtotal + shipping;

  // ── Empty state ─────────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <main className="bg-[#F7F5F2] min-h-[100svh] pb-24">
        <div className="h-14 md:h-16" />

        {/* ── Hero empty-state message ───────────────────────────────────── */}
        <div className="flex flex-col items-center text-center px-6 pt-16 md:pt-20 pb-14 md:pb-16">
          <h1 className="font-sans text-[15px] font-bold uppercase tracking-[0.22em] text-[#111] mb-5">
            Your Shopping Bag Is Empty
          </h1>
          <p className="font-sans text-[14px] text-[#777] tracking-[0.02em] mb-10 max-w-sm">
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

        {/* ── May Interest You strip ──────────────────────────────────────────── */}
        <section className="px-10 md:px-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111]">
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
            {cart.map((item) => (
              <CartItemRow
                key={`${item.productId}-${item.size}`}
                item={item}
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
                <p className="font-sans text-[12px] text-[#555] tracking-[0.02em] mb-6 pb-6 border-b border-[#ebebeb]">
                  Add ₹{(4999 - subtotal).toLocaleString("en-IN")} more for free
                  delivery
                </p>
              )}
              {shipping === 0 && subtotal > 0 && (
                <p className="font-sans text-[12px] text-[#3a7d44] tracking-[0.02em] mb-6 pb-6 border-b border-[#ebebeb]">
                  ✓ You qualify for free home delivery
                </p>
              )}

              {/* Line totals */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-[13px] text-[#777] tracking-[0.02em]">
                    Subtotal
                  </span>
                  <span className="font-sans text-[13px] text-[#111]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-[13px] text-[#777] tracking-[0.02em]">
                    Delivery
                  </span>
                  <span className="font-sans text-[13px] text-[#111]">
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-[#ebebeb]">
                  <span className="font-sans text-[13px] font-bold uppercase tracking-[0.14em] text-[#111]">
                    Total
                  </span>
                  <div className="text-right">
                    <p className="font-sans text-[15px] font-bold text-[#111]">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                    <p className="font-sans text-[11px] text-[#aaa] mt-0.5">
                      Taxes included
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() =>
                  alert("Shopify checkout will be integrated here.")
                }
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
