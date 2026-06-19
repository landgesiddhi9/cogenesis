import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { productStripItems } from '../data/mockData';
import type { ShopifyProduct } from '../types';

const formatPrice = (product: ShopifyProduct) => {
  const amount = product.priceRange?.minVariantPrice?.amount ?? '4990';
  const value = Number(amount) || 4990;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SearchOverlay: React.FC<Props> = ({ isOpen, onClose }) => {
  const products = useMemo(() => productStripItems.slice(0, 7), []);
  const railRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hasText, setHasText] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const onOverlayClick = () => onClose();

  const focusSearchInput = () => {
    inputRef.current?.focus();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasText(event.target.value.trim().length > 0);
  };

  const onRailWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Horizontal scroll with mouse wheel
    if (!railRef.current) return;
    if (Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      railRef.current.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    }
  };

  const overlay = (
    <div
      className={`fixed inset-0 z-[120] bg-[#f8f8f8] ${
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
          {/* Search bar - left aligned with close button on right */}
          <div className="flex items-center justify-between pt-[0.3cm]">
            <div className="w-[25vw] min-w-[240px]">
              <label className="relative block pb-1 text-stone/70">
                <input
                  ref={inputRef}
                  className="w-full bg-transparent text-[24px] md:text-[28px] leading-none font-sans font-normal text-black placeholder:text-[#c4aea3] outline-none pr-8 pb-1"
                  placeholder="Search"
                  aria-label="Search"
                  autoFocus={isOpen}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={focusSearchInput}
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
              May interest you
            </h2>
          </div>

          {/* Horizontal product rail (only horizontally scrollable) */}
          <div className="mt-6 flex-1">
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
                  className="flex-shrink-0 bg-transparent"
                  style={{ width: 'clamp(280px, 18vw, 380px)' }}
                >
                  <div className="relative overflow-hidden bg-[#f5f0eb] aspect-[3/4]">
                    <img
                      src={p.featuredImage.url}
                      alt={p.featuredImage.altText}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />

                    <div className="absolute inset-x-2 bottom-3 z-10 flex items-center justify-center bg-[#f5f0eb]/95 px-3 py-1.5 text-[13px] text-charcoal opacity-0 transition-all duration-300 ease-out hover:opacity-100">
                      <span className="mx-1">S</span>
                      <span className="mx-1">M</span>
                      <span className="mx-1">L</span>
                      <span className="mx-1">XL</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-[15px] font-normal tracking-[0.02em] leading-[1.2] text-charcoal">
                      {p.title}
                    </h3>
                    <p className="text-[14px] font-medium text-earth">{formatPrice(p)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* CTA pinned ~18px above bottom, visible without vertical scroll */}
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
