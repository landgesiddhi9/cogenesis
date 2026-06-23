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

  // Generate 8 gallery images (in real app, these would come from product variants)
  const galleryImages = [
    product.featuredImage.url,
    product.featuredImage.url,
    product.featuredImage.url,
    product.featuredImage.url,
    product.featuredImage.url,
    product.featuredImage.url,
    product.featuredImage.url,
    product.featuredImage.url,
  ];

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      {/* Main Image Gallery - Sticky */}
      <div className="sticky top-20 h-fit">
        {/* Masonry Grid Layout */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Large image - top left, spans 2 rows */}
          <div
            className="col-span-2 md:col-span-1 md:row-span-2 cursor-pointer group overflow-hidden bg-stone/5"
            onClick={() => handleImageClick(0)}
          >
            <img
              src={galleryImages[0]}
              alt="Product main view"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Secondary images */}
          {galleryImages.slice(1, 5).map((image, idx) => (
            <div
              key={idx + 1}
              className="aspect-[4/5] cursor-pointer group overflow-hidden bg-stone/5"
              onClick={() => handleImageClick(idx + 1)}
            >
              <img
                src={image}
                alt={`Product view ${idx + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}

          {/* Bottom row images */}
          {galleryImages.slice(5, 8).map((image, idx) => (
            <div
              key={idx + 5}
              className="aspect-[4/3] md:aspect-[5/4] cursor-pointer group overflow-hidden bg-stone/5"
              onClick={() => handleImageClick(idx + 5)}
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
