import { useMemo, useState } from "react";
import type { ShopifyImage } from "../types";
import ProductImageNav from "./ProductImageNav";

interface ProductImageCarouselProps {
  images: ShopifyImage[];
  fallbackImage: ShopifyImage;
  fallbackAlt: string;
  imageClassName?: string;
  hoverScale?: string;
  onImageError?: (imageUrl: string) => void;
  showControls?: boolean;
}

type SwipeDirection = "previous" | "next";

const ProductImageCarousel = ({
  images,
  fallbackImage,
  fallbackAlt,
  imageClassName = "object-cover object-top",
  hoverScale = "",
  onImageError,
  showControls = true,
}: ProductImageCarouselProps) => {
  const imageOptions = useMemo(
    () =>
      (images.length > 0 ? images : [fallbackImage])
        .filter((image) => Boolean(image.url))
        .filter(
          (image, imageIndex, allImages) =>
            allImages.findIndex((candidate) => candidate.url === image.url) === imageIndex,
        ),
    [fallbackImage, images],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<SwipeDirection>("next");

  const currentImage = imageOptions[currentIndex % imageOptions.length] ?? fallbackImage;
  const previousImage =
    previousIndex === null
      ? null
      : imageOptions[previousIndex % imageOptions.length] ?? fallbackImage;

  const moveImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    nextDirection: SwipeDirection,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (imageOptions.length <= 1) return;

    setDirection(nextDirection);
    setPreviousIndex(currentIndex);
    setCurrentIndex((current) =>
      nextDirection === "next"
        ? (current + 1) % imageOptions.length
        : current === 0
          ? imageOptions.length - 1
          : current - 1,
    );
  };

  const activeMotionClass = previousImage
    ? "product-gallery-image--enter-" + direction
    : "";

  return (
    <>
      {previousImage && (
        <img
          key={"previous-" + previousImage.url + "-" + currentImage.url}
          src={previousImage.url}
          alt={previousImage.altText || fallbackAlt}
          className={
            "product-gallery-image product-gallery-image--exit-" +
            direction +
            " " +
            imageClassName +
            " " +
            hoverScale
          }
          loading="lazy"
          onAnimationEnd={() => setPreviousIndex(null)}
          onError={() => onImageError?.(previousImage.url)}
        />
      )}

      <img
        key={"current-" + currentImage.url}
        src={currentImage.url}
        alt={currentImage.altText || fallbackAlt}
        className={
          "product-gallery-image " +
          activeMotionClass +
          " " +
          imageClassName +
          " " +
          hoverScale
        }
        loading="lazy"
        onError={() => onImageError?.(currentImage.url)}
      />

      {showControls && (
        <ProductImageNav
          total={imageOptions.length}
          onPrevious={(event) => moveImage(event, "previous")}
          onNext={(event) => moveImage(event, "next")}
        />
      )}
    </>
  );
};

export default ProductImageCarousel;
