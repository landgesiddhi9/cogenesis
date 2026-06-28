import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { productStripItems } from '../data/mockData';
import type { ShopifyProduct } from '../types';

const SearchPage = () => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  const products = useMemo(() => productStripItems.slice(0, 7), []);
  const railRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hasText, setHasText] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasText(event.target.value.trim().length > 0);
  };

  const onRailWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    if (Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      railRef.current.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-[#f8f8f8] min-h-[100svh] pt-20 md:pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col font-serif">
        {/* Search bar */}
        <div className="flex items-center justify-between pt-[0.3cm]">
          <div className="w-[25vw] min-w-[240px]">
            <label className="relative block pb-1 text-stone/70">
              <input
                ref={inputRef}
                className="w-full bg-transparent text-[24px] md:text-[28px] leading-none font-serif font-normal text-black placeholder:text-[#c4aea3] outline-none pr-8 pb-1"
                placeholder="Search"
                aria-label="Search"
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.focus()}
                className={`absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center ${
                  hasText ? 'text-black' : 'text-current'
                } hover:text-black`}
                aria-label="Focus search"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="h-5 w-5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full transition-colors duration-150 ${
                  hasText ? 'bg-black' : 'bg-stone/60'
                }`}
              />
            </label>
          </div>
          <button
            onClick={() => navigate('/')}
            className="ml-auto px-2 py-2 text-stone/60 hover:text-stone transition-colors duration-200"
            aria-label="Close search"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              className="h-6 w-6"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Heading */}
        <div className="mt-6">
          <h2 className="text-[13px] uppercase tracking-[0.3em] font-semibold text-stone">
            May interest you
          </h2>
        </div>

        {/* Horizontal product rail */}
        <div className="mt-6">
          <div
            ref={railRef}
            className="flex gap-0 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth -mx-6 md:-mx-10 pl-10 search-rail"
            onWheel={onRailWheel}
            style={{ scrollbarWidth: 'none' as any }}
          >
            <style>{`.search-rail::-webkit-scrollbar{display:none}`}</style>
            {products.map((p: ShopifyProduct) => (
              <article
                key={p.id}
                className="flex-shrink-0 bg-transparent group cursor-pointer"
                style={{ width: 'clamp(280px, 18vw, 380px)' }}
                onClick={() => navigate(`/products/${p.handle}`)}
              >
                <div className="relative overflow-hidden bg-[#f5f0eb] aspect-[3/4]">
                  <img
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleWishlist(p.id); }}
                      className={`absolute top-3 right-3 p-0 bg-transparent border-none cursor-pointer transition-opacity duration-200 z-10 ${
                        isWishlisted(p.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      aria-label={isWishlisted(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill={isWishlisted(p.id) ? "#431c1c" : "none"}
                        stroke={isWishlisted(p.id) ? "#431c1c" : "#2A2420"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 2h12v16l-6-4l-6 4V2z" />
                      </svg>
                    </button>
                </div>
                <div className="mt-3">
                  <h3 className="text-[15px] font-normal tracking-[0.02em] leading-[1.2] text-charcoal">
                    {p.title}
                  </h3>
                  <p className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">₹{Number(p.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12 pb-16">
          <button className="px-6 py-2.5 border border-charcoal bg-transparent text-charcoal text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-charcoal hover:text-white transition-colors duration-200">
            View All Products
          </button>
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
