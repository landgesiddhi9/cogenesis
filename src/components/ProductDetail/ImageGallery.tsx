import { useState, useEffect } from "react";
import type { ShopifyProduct, ShopifyProductVariant } from "../../types";
import QuickViewOverlay from "./QuickViewOverlay";
import { shopifyImageUrl, shopifyImageSrcSet } from "../../utils/shopifyImage";
import { isColorOptionName } from "../../utils/variant";

interface ImageGalleryProps {
  product: ShopifyProduct;
  selectedColor?: string;
  activeVariant?: ShopifyProductVariant | null;
}

const ImageGallery = ({
  product,
  selectedColor,
  activeVariant,
}: ImageGalleryProps) => {
  const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);

  // Collect all unique product images
  const allImages = Array.from(
    new Set(
      [
        activeVariant?.image?.url,
        ...product.images.map((img) => img.url),
        product.featuredImage?.url,
      ].filter((u): u is string => Boolean(u)),
    ),
  );

  const defaultImage =
    activeVariant?.image?.url ||
    product.featuredImage?.url ||
    product.images[0]?.url ||
    "";

  // Main featured image state
  const [activeImage, setActiveImage] = useState<string>(defaultImage);

  // Automatically update the main image whenever the selected color or active variant changes
  useEffect(() => {
    // 1. Direct variant image from activeVariant
    if (activeVariant?.image?.url) {
      setActiveImage(activeVariant.image.url);
      return;
    }

    // 2. Look for any variant matching selectedColor that has an image
    if (selectedColor) {
      const cleanColor = selectedColor.toLowerCase();
      const variantWithImage = product.variants.find((v) => {
        const matches =
          v.selectedOptions?.some(
            (o) => isColorOptionName(o.name) && o.value.toLowerCase() === cleanColor,
          ) || v.title.toLowerCase().includes(cleanColor);
        return matches && Boolean(v.image?.url);
      });

      if (variantWithImage?.image?.url) {
        setActiveImage(variantWithImage.image.url);
        return;
      }
    }

    // 3. Fallback to default featured image if no activeImage is set
    if (!activeImage && defaultImage) {
      setActiveImage(defaultImage);
    }
  }, [activeVariant, selectedColor, product, defaultImage]);

  const labels = [
    "Front View",
    "Side View",
    "Back View",
    "Close-up Detail",
    "Alternate View",
    "Lifestyle View",
  ];

  const openLightbox = (url: string) => {
    const idx = allImages.indexOf(url);
    setQuickViewIndex(idx >= 0 ? idx : 0);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Hero Product Image: updates immediately when a color swatch is clicked */}
      <div
        className="relative w-full aspect-[4/5] bg-stone/5 overflow-hidden group cursor-zoom-in rounded-sm"
        onClick={() => openLightbox(activeImage)}
      >
        {activeImage ? (
          <img
            key={activeImage}
            src={shopifyImageUrl(activeImage, 1000)}
            srcSet={shopifyImageSrcSet(activeImage, [600, 1000, 1600])}
            sizes="(max-width: 1024px) 100vw, 65vw"
            alt={`${product.title} - Main Preview`}
            className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal/40 font-sans text-sm">
            No image available
          </div>
        )}

        {/* Selected Color Badge */}
        {selectedColor && (
          <div className="absolute top-4 left-4 bg-ivory/90 backdrop-blur-sm px-3 py-1 text-[11px] tracking-widest uppercase text-charcoal border border-charcoal/10 shadow-sm pointer-events-none">
            {selectedColor}
          </div>
        )}

        {/* Hover Zoom Hint */}
        <div className="absolute bottom-4 right-4 bg-charcoal/80 text-white text-[11px] uppercase tracking-wider px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Click to Zoom
        </div>
      </div>

      {/* Alternate Views / Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 pt-2">
          {allImages.map((url, idx) => {
            const isCurrent = url === activeImage;
            return (
              <button
                key={url + idx}
                type="button"
                onClick={() => setActiveImage(url)}
                className={`relative aspect-[3/4] bg-stone/5 overflow-hidden transition-all duration-200 rounded-sm ${
                  isCurrent
                    ? "ring-2 ring-charcoal ring-offset-2 opacity-100 scale-100 shadow-sm"
                    : "opacity-60 hover:opacity-100 border border-stone/20"
                }`}
                title={`View ${labels[idx % labels.length] || `Angle ${idx + 1}`}`}
                aria-label={`View angle ${idx + 1}`}
              >
                <img
                  src={shopifyImageUrl(url, 200)}
                  alt={`${product.title} angle ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Overlay */}
      {quickViewIndex !== null && (
        <QuickViewOverlay
          images={allImages}
          labels={labels}
          initialIndex={quickViewIndex}
          productTitle={product.title}
          onClose={() => setQuickViewIndex(null)}
        />
      )}
    </div>
  );
};

export default ImageGallery;
