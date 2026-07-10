import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/search.service';
import { getFeaturedProducts } from '../services/product.service';
import type { ShopifyProduct } from '../types';
import SalePrice from './SalePrice';
import { getBestCompareAtPrice } from '../utils/price';
import { shopifyImageUrl, shopifyImageSrcSet } from '../utils/shopifyImage';
import { useWishlist } from '../hooks/useWishlist';

const hiddenScrollbarStyle: CSSProperties = { scrollbarWidth: 'none' };

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SearchOverlay: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist: toggleWishlistById } = useWishlist();
  const railRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const featuredRequestIdRef = useRef(0);
  const searchRequestIdRef = useRef(0);

  const isAbortError = (error: unknown) =>
    error instanceof DOMException && error.name === 'AbortError';

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setSearched(false);
      setError(null);
      setInitialLoading(true);
    }
  }

  // Load featured products on mount
  useEffect(() => {
    if (!isOpen) return;
    const requestId = ++featuredRequestIdRef.current;
    const controller = new AbortController();

    getFeaturedProducts(7, { signal: controller.signal })
      .then(({ products }) => {
        if (requestId !== featuredRequestIdRef.current) return;
        setResults(products);
      })
      .catch((err) => {
        if (isAbortError(err) || requestId !== featuredRequestIdRef.current) return;
      })
      .finally(() => {
        if (requestId !== featuredRequestIdRef.current) return;
        setInitialLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [isOpen]);

  // Focus after a short delay to allow the animation to start
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlistById(id);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      searchRequestIdRef.current += 1;
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    const controller = new AbortController();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setSearched(true);
      setLoading(true);
      setError(null);

      searchProducts(trimmed, 20, { signal: controller.signal })
        .then(({ products }) => {
          if (requestId !== searchRequestIdRef.current) return;
          setResults(products);
        })
        .catch((err) => {
          if (isAbortError(err) || requestId !== searchRequestIdRef.current) return;
          setError(err instanceof Error ? err.message : String(err));
          setResults([]);
        })
        .finally(() => {
          if (requestId !== searchRequestIdRef.current) return;
          setLoading(false);
        });
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      controller.abort();
    };
  }, [query]);

  const onOverlayClick = () => onClose();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.trim() === '') {
      setSearched(false);
    }
    setQuery(value);
  };

  const hasText = query.trim().length > 0;

  const onRailWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    if (Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      railRef.current.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    }
  };

  const handleProductClick = (handle: string) => {
    onClose();
    navigate(`/products/${handle}`);
  };

  const showInitial = !hasText && !searched;
  const showNoResults = hasText && !loading && results.length === 0 && !error;
  const showError = hasText && error;

  const overlay = (
    <div
      className={`fixed inset-0 z-[120] bg-[#F8F7F5] ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      } transition-opacity duration-300`}
      role="dialog"
      aria-modal="true"
      onClick={onOverlayClick}
      style={{ height: '100vh', overflowX: 'hidden', overflowY: 'hidden' }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full flex flex-col justify-start">
          {/* Search bar */}
          <div className="flex items-center justify-between pt-[0.3cm]">
            <div className="w-[25vw] min-w-[240px]">
              <label className="relative block pb-1 text-stone/70">
                <input
                  ref={inputRef}
                  className="w-full bg-transparent text-[24px] md:text-[28px] leading-none font-sans font-normal text-black placeholder:text-[#c4aea3] outline-none pr-8 pb-1"
                  placeholder="Search"
                  aria-label="Search"
                  autoFocus={isOpen}
                  value={query}
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
              onClick={onClose}
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
              {showNoResults ? 'No results found' : showError ? 'Search error' : loading ? 'Searching...' : showInitial ? 'May interest you' : `Results (${results.length})`}
            </h2>
          </div>

          {/* Product rail or empty/error state */}
          <div className="mt-6 flex-1">
            {initialLoading || loading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-stone/60 text-sm tracking-wide">Loading...</p>
              </div>
            ) : showNoResults ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-stone/60 text-sm tracking-wide">No products match your search. Try a different term.</p>
              </div>
            ) : showError ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-stone/60 text-sm tracking-wide">Something went wrong. Please try again.</p>
              </div>
            ) : (
              <div
                ref={railRef}
                className="flex gap-0 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth -mx-6 md:-mx-10 pl-10 search-rail"
                onWheel={onRailWheel}
                style={hiddenScrollbarStyle}
              >
                <style>{`.search-rail::-webkit-scrollbar{display:none}`}</style>
                {results.map((p: ShopifyProduct) => (
                  <article
                    key={p.id}
                    className="flex-shrink-0 bg-transparent group cursor-pointer"
                    style={{ width: 'clamp(280px, 18vw, 380px)' }}
                    onClick={() => handleProductClick(p.handle)}
                  >
                    <div className="relative overflow-hidden bg-[#f5f0eb] aspect-[3/4]">
                      <img
                        src={shopifyImageUrl(p.featuredImage.url, 400)}
                        srcSet={shopifyImageSrcSet(p.featuredImage.url, [400, 800])}
                        sizes="(max-width: 768px) 50vw, 380px"
                        alt={p.featuredImage.altText}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(e, p.id)}
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
                      <div className="absolute inset-x-2 bottom-3 z-10 flex items-center justify-center bg-[#f5f0eb]/95 px-3 py-1.5 text-[13px] text-charcoal opacity-0 transition-all duration-300 ease-out hover:opacity-100">
                        <span className="mx-1">S</span>
                        <span className="mx-1">M</span>
                        <span className="mx-1">L</span>
                        <span className="mx-1">XL</span>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <h3 className="text-[15px] font-normal tracking-[0.02em] leading-[1.2] text-charcoal">
                        {p.title}
                      </h3>
                      <SalePrice price={p.priceRange.minVariantPrice.amount} compareAtPrice={getBestCompareAtPrice(p)} className="text-center" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* CTA pinned ~18px above bottom */}
          <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: '18px' }}>
            <button className="px-6 py-2.5 border border-charcoal bg-transparent text-charcoal text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-charcoal hover:text-white transition-colors duration-200">
              View All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

export default SearchOverlay;
