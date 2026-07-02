import { useState } from "react";
import type { ShopifyProduct } from "../../types";
import QuickViewOverlay from "./QuickViewOverlay";
import { shopifyImageUrl, shopifyImageSrcSet } from "../../utils/shopifyImage";

interface ImageGalleryProps {
  product: ShopifyProduct;
  selectedColor: number;
}

const ImageGallery = ({ product }: ImageGalleryProps) => {
  const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);

  const gridImages =
    product.images.length >= 6
      ? product.images.slice(0, 6).map((img) => img.url)
      : Array.from(
          { length: 6 },
          (_, i) => product.images[i]?.url ?? product.featuredImage.url,
        );

  const labels = ["Front View", "Full Body View", "Back View", "Close-up Detail", "Detail View", "Alternate View"];

  return (
    <>
      <div className="grid grid-cols-2 grid-rows-3 gap-3 h-full">
        {gridImages.map((url, idx) => (
          <div
            key={idx}
            className="overflow-hidden bg-stone/5 cursor-pointer"
            onClick={() => setQuickViewIndex(idx)}
          >
            <img
              src={shopifyImageUrl(url, 600)}
              srcSet={shopifyImageSrcSet(url, [600, 1200])}
              sizes="(max-width: 768px) 50vw, 400px"
              alt={`${product.title} - ${labels[idx]}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      {quickViewIndex !== null && (
        <QuickViewOverlay
          images={gridImages}
          labels={labels}
          initialIndex={quickViewIndex}
          productTitle={product.title}
          onClose={() => setQuickViewIndex(null)}
        />
      )}
    </>
  );
};

export default ImageGallery;
