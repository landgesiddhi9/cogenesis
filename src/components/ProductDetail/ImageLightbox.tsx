import { useState, useEffect } from "react";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const ImageLightbox = ({
  images,
  initialIndex,
  onClose,
}: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white hover:text-white/70 transition-colors z-51"
        aria-label="Close lightbox"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Main image */}
      <div className="flex items-center justify-center w-full h-full max-w-4xl">
        <img
          src={images[currentIndex]}
          alt={`Product ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Previous button */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:text-white/70 transition-colors"
        aria-label="Previous image"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:text-white/70 transition-colors"
        aria-label="Next image"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Image counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm tracking-wide font-sans">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageLightbox;
