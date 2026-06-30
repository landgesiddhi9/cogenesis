import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/search.service';
import { getFeaturedProducts } from '../services/product.service';
import type { ShopifyProduct } from '../types';
import ProductCard from '../components/ProductCard';

const hiddenScrollbarStyle: CSSProperties = { scrollbarWidth: 'none' };

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const railRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const featuredRequestIdRef = useRef(0);
  const searchRequestIdRef = useRef(0);

  const isAbortError = (error: unknown) =>
    error instanceof DOMException && error.name === 'AbortError';

  // Load featured products on mount as default "May interest you"
  useEffect(() => {
    const requestId = ++featuredRequestIdRef.current;
    const controller = new AbortController();

    setInitialLoading(true);
    getFeaturedProducts(7, { signal: controller.signal })
      .then(({ products }) => {
        if (requestId !== featuredRequestIdRef.current) return;
        setResults(products);
      })
      .catch((err) => {
        if (isAbortError(err) || requestId !== featuredRequestIdRef.current) return;
        // silently fail - show empty state
      })
      .finally(() => {
        if (requestId !== featuredRequestIdRef.current) return;
        setInitialLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Restore featured products when query is cleared
      searchRequestIdRef.current += 1;
      setSearched(false);
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const hasText = query.trim().length > 0;

  const onRailWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    if (Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      railRef.current.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    }
  };

  const showInitial = !hasText && !searched;
  const showNoResults = hasText && !loading && results.length === 0 && !error;
  const showError = hasText && error;

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
            {showNoResults ? 'No results found' : showError ? 'Search error' : loading ? 'Searching...' : showInitial ? 'May interest you' : `Results (${results.length})`}
          </h2>
        </div>

        {/* Product rail or empty/error state */}
        <div className="mt-6">
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
                <div
                  key={p.id}
                  className="flex-shrink-0"
                  style={{ width: 'clamp(280px, 18vw, 380px)' }}
                >
                  <ProductCard product={p} showImageControls={false} />
                </div>
              ))}
            </div>
          )}
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
