import { useState, useEffect, useRef, useCallback } from "react";
import { shopifyImageUrl, shopifyImageSrcSet } from "../../utils/shopifyImage";

interface QuickViewOverlayProps {
  images: string[];
  labels: string[];
  initialIndex: number;
  productTitle: string;
  onClose: () => void;
}

const QuickViewOverlay = ({
  images,
  labels,
  initialIndex,
  productTitle,
  onClose,
}: QuickViewOverlayProps) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const overlayRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleThumbnailClick = useCallback((idx: number) => {
    setActiveIndex(idx);
    imageRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { root: galleryRef.current, threshold: 0.3 },
    );

    const refs = imageRefs.current;
    for (const el of refs) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    imageRefs.current[initialIndex]?.scrollIntoView({ block: "start" });
  }, [initialIndex]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex bg-ivory"
      style={{ animation: "fadeIn 0.25s ease" }}
      onMouseLeave={onClose}
    >
      {/* Left Sidebar - Thumbnails */}
      <div
        className="w-[80px] lg:w-[100px] flex-shrink-0 border-r border-[#e7e1d8] flex flex-col items-center pt-12 gap-2 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((url, idx) => (
          <button
            key={idx}
            onClick={() => handleThumbnailClick(idx)}
            className={`w-[60px] h-[75px] flex-shrink-0 overflow-hidden transition-all duration-200 ${
              idx === activeIndex
                ? "opacity-100 ring-1 ring-[#2A2420]"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            <img
              src={shopifyImageUrl(url, 200)}
              alt={`${productTitle} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Continuous Vertical Gallery */}
      <div
        ref={galleryRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="flex flex-col items-center pt-12 pb-24 gap-10">
          {images.map((url, idx) => (
            <div
              key={idx}
              ref={(el) => { imageRefs.current[idx] = el; }}
              data-index={idx}
              className="w-full max-w-[80%] flex flex-col items-center"
            >
              <img
                src={shopifyImageUrl(url, 800)}
                srcSet={shopifyImageSrcSet(url, [800, 1600])}
                sizes="(max-width: 768px) 100vw, 800px"
                alt={`${productTitle} - ${labels[idx]}`}
                className="w-full h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 w-10 h-10 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-colors z-50"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default QuickViewOverlay;
