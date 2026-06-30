import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { getFeaturedProducts } from "../services/product.service";
import type { ShopifyProduct } from "../types";
import ProductCard from "../components/ProductCard";

// ── Shared constants for the product strip ─────────────────────────────────────────
const SIZES = ["S", "M", "L", "XL"];

// ── Size selector panel for "May Interest You" strip ───────────────────────────
const SizeSelector = () => {
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const handleAdd = (size: string) => {
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1800);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0">
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
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(s); }}
                className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#444] hover:text-[#111] hover:font-semibold transition-all duration-100 py-0.5"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (amount: string, currency: string) => {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
};

// ── Cart page ─────────────────────────────────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateCartLine, removeCartLine } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [processingLines, setProcessingLines] = useState<Set<string>>(new Set());

  // "May Interest You" strip state
  const stripRef = useRef<HTMLDivElement>(null);
  const [stripProducts, setStripProducts] = useState<ShopifyProduct[]>([]);
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

  // Fetch live products for "May Interest You" strip
  useEffect(() => {
    let active = true;

    getFeaturedProducts(12)
      .then(({ products }) => {
        if (active) {
          setStripProducts(products);
        }
      })
      .catch(() => {
        if (active) {
          setStripProducts([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const isProcessing = (lineId: string) => processingLines.has(lineId);

  const handleIncrement = async (lineId: string, currentQty: number) => {
    setProcessingLines((prev) => new Set(prev).add(lineId));
    try {
      await updateCartLine(lineId, currentQty + 1);
    } catch {
      window.dispatchEvent(
        new CustomEvent("cart-toast", {
          detail: { message: "Couldn't update cart", type: "error" },
        }),
      );
    } finally {
      setProcessingLines((prev) => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  const handleRemove = async (lineId: string) => {
    setProcessingLines((prev) => new Set(prev).add(lineId));
    try {
      await removeCartLine(lineId);
      window.dispatchEvent(
        new CustomEvent("cart-toast", {
          detail: { message: "Product removed from cart", type: "success" },
        }),
      );
    } catch {
      window.dispatchEvent(
        new CustomEvent("cart-toast", {
          detail: { message: "Couldn't remove product", type: "error" },
        }),
      );
    } finally {
      setProcessingLines((prev) => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  const handleDecrement = async (lineId: string, currentQty: number) => {
    setProcessingLines((prev) => new Set(prev).add(lineId));
    try {
      if (currentQty <= 1) {
        await removeCartLine(lineId);
      } else {
        await updateCartLine(lineId, currentQty - 1);
      }
    } catch {
      window.dispatchEvent(
        new CustomEvent("cart-toast", {
          detail: { message: "Couldn't update cart", type: "error" },
        }),
      );
    } finally {
      setProcessingLines((prev) => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  const hasItems = cart && cart.lines.length > 0;

  return (
    <main className="bg-[#F7F5F2] min-h-[100svh] pb-24 flex flex-col">
      <div className="h-14 md:h-16" />

      {hasItems ? (
        <>
          {/* ── Filled cart ─────────────────────────────────────────────── */}
          <div className="px-10 md:px-16 py-8">
            <h1 className="font-sans text-[15px] font-bold uppercase tracking-[0.22em] text-[#111] mb-8">
              Shopping Bag ({cart.totalQuantity})
            </h1>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Line items */}
              <div className="flex-1 space-y-6">
                {cart.lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex gap-5 pb-6 border-b border-[#e0ddd8]"
                  >
                    <div className="w-24 h-28 flex-shrink-0 bg-[#f0ede8] overflow-hidden">
                      <img
                        src={line.merchandise.product.featuredImage?.url}
                        alt={line.merchandise.product.featuredImage?.altText ?? ""}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0 relative">
                      <button
                        type="button"
                        disabled={isProcessing(line.id)}
                        onClick={() => handleRemove(line.id)}
                        className="absolute top-0 right-0 leading-none text-[#888] text-[28px] font-semibold hover:opacity-70 transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed z-10"
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                      <p className="font-sans text-[12px] tracking-[0.03em] text-[#111] truncate pr-6">
                        {line.merchandise.product.title}
                      </p>
                      <p className="font-sans text-[11px] text-[#888] mt-1">
                        {line.merchandise.title}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isProcessing(line.id)}
                            onClick={() => handleDecrement(line.id, line.quantity)}
                            className="w-7 h-7 flex items-center justify-center border border-[#d0ccc6] rounded text-[#111] font-sans text-[13px] disabled:opacity-40 transition-opacity duration-150 hover:border-[#111]"
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <span className="font-sans text-[12px] text-[#111] w-5 text-center tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={isProcessing(line.id)}
                            onClick={() => handleIncrement(line.id, line.quantity)}
                            className="w-7 h-7 flex items-center justify-center border border-[#d0ccc6] rounded text-[#111] font-sans text-[13px] disabled:opacity-40 transition-opacity duration-150 hover:border-[#111]"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-sans text-[12px] text-[#111] tabular-nums whitespace-nowrap">
                          {formatPrice(
                            (Number(line.merchandise.price.amount) * line.quantity).toString(),
                            line.merchandise.price.currencyCode,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="w-full lg:w-80">
                <div className="bg-white p-6">
                  <h2 className="font-sans text-[12px] font-semibold uppercase tracking-[0.15em] text-[#111] mb-5">
                    Order Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between font-sans text-[12px] text-[#555]">
                      <span>Subtotal</span>
                      <span className="text-[#111] tabular-nums">
                        {formatPrice(
                          cart.cost.subtotalAmount.amount,
                          cart.cost.subtotalAmount.currencyCode,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-sans text-[12px] text-[#555]">
                      <span>Shipping</span>
                      <span className="text-[#888]">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-[#e0ddd8] pt-3 flex justify-between font-sans text-[13px] font-semibold text-[#111]">
                      <span>Total</span>
                      <span className="tabular-nums">
                        {formatPrice(
                          cart.cost.totalAmount.amount,
                          cart.cost.totalAmount.currencyCode,
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (cart.checkoutUrl) {
                          window.open(cart.checkoutUrl, "_blank");
                        } else {
                          alert("Checkout URL is not available. Please try again.");
                        }
                      }}
                      className="w-full h-[52px] bg-[#111] text-white font-sans text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-[#2a2a2a] transition-colors duration-200 mt-6"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ── Hero empty-state message ────────────────────────────────── */}
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
        </>
      )}

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
            {stripProducts.map((p) => (
              <div
                key={p.id}
                className="flex-none
                           w-[calc(50vw-2.8rem)]
                           sm:w-[calc(33.333vw-2.2rem)]
                           lg:w-[calc(20vw-1.7rem)]"
              >
                <ProductCard
                  product={p}
                  wishlisted={isWishlisted(p.id)}
                  onWishlistToggle={toggleWishlist}
                  imageChildren={<SizeSelector />}
                  showImageControls={false}
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
