import { useState } from "react";
import ImageLightbox from "./ImageLightbox";
import type { ShopifyProduct } from "../../types";

interface ImageGalleryProps {
  product: ShopifyProduct;
  selectedColor: number;
}

const ImageGallery = ({ product }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const galleryImages =
    product.images.length > 0
      ? product.images.map((img) => img.url)
      : Array.from({ length: 8 }, () => product.featuredImage.url);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleMainImageClick = () => {
    setIsLightboxOpen(true);
  };

  return (
    <>
      <style>{`
        @keyframes imgFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .thumbnail-strip::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Desktop & Tablet: Thumbnail Strip + Main Image */}
      <div className="hidden md:flex gap-4 sticky top-20 h-[86vh]">
        {/* Thumbnail Strip */}
        <div
          className="thumbnail-strip flex flex-col gap-2 overflow-y-auto w-[76px] lg:w-[100px] flex-shrink-0 max-h-[80vh]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {galleryImages.map((image, idx) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={`w-full aspect-[3/4] flex-shrink-0 overflow-hidden border transition-all duration-200 ${
                  idx === selectedImageIndex
                    ? "border-[#2A2420] opacity-100"
                    : "border-[#ddd] opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
        </div>

        {/* Main Image */}
        <div
          className="flex-1 cursor-pointer overflow-hidden"
          onClick={handleMainImageClick}
        >
          <img
            key={selectedImageIndex}
            src={galleryImages[selectedImageIndex]}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ animation: "imgFadeIn 0.25s ease" }}
          />
        </div>
      </div>

      {/* Mobile: Masonry Grid Layout */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {/* Large image - top left, spans 2 columns on mobile */}
          <div
            className="col-span-2 cursor-pointer group overflow-hidden bg-stone/5"
            onClick={() => handleMainImageClick()}
          >
            <img
              src={galleryImages[0]}
              alt="Product main view"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {galleryImages.slice(1, 5).map((image, idx) => (
            <div
              key={idx + 1}
              className="aspect-[4/5] cursor-pointer group overflow-hidden bg-stone/5"
              onClick={() => {
                setSelectedImageIndex(idx + 1);
                handleMainImageClick();
              }}
            >
              <img
                src={image}
                alt={`Product view ${idx + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}

          {galleryImages.slice(5, 8).map((image, idx) => (
            <div
              key={idx + 5}
              className="aspect-[4/3] cursor-pointer group overflow-hidden bg-stone/5"
              onClick={() => {
                setSelectedImageIndex(idx + 5);
                handleMainImageClick();
              }}
            >
              <img
                src={image}
                alt={`Product view ${idx + 6}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          images={galleryImages}
          initialIndex={selectedImageIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default ImageGallery;
