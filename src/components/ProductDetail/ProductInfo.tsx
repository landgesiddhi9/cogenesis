import { useState } from "react";
import SizeGuideDrawer from "./SizeGuideDrawer";
import SizeRecommenderModal from "./SizeRecommenderModal";
import type { ShopifyProduct, ShopifyProductVariant } from "../../types";
import SalePrice from "../SalePrice";
import { getBestCompareAtPrice } from "../../utils/price";
import { getProductSizes, getProductColorOptions, resolveProductVariant } from "../../utils/variant";

interface ProductInfoProps {
  product: ShopifyProduct;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  isWishlisted: boolean;
  toggleWishlist: () => void;
  addToCart: () => void;
  buyNow: () => void;
  buyingNow: boolean;
  description: string;
  activeVariant?: ShopifyProductVariant | null;
  onColorChange?: (colorName: string, variant?: ShopifyProductVariant | null) => void;
  catalog?: ShopifyProduct[];
}

const ProductInfo = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  isWishlisted,
  toggleWishlist,
  addToCart,
  buyNow,
  buyingNow,
  description,
  activeVariant,
  onColorChange,
  catalog = [],
}: ProductInfoProps) => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSizeRecommenderOpen, setIsSizeRecommenderOpen] = useState(false);
  const sizes = getProductSizes(product);
  const colorOptions = getProductColorOptions(product, catalog);
  const currentVariant = activeVariant || resolveProductVariant(product, selectedSize, selectedColor);
  const price = currentVariant?.price?.amount || product.priceRange.minVariantPrice.amount;
  const compareAtPrice = currentVariant?.compareAtPrice?.amount || getBestCompareAtPrice(product);
  const isAvailable = currentVariant ? currentVariant.availableForSale : product.variants.some((v) => v.availableForSale);
  const fabric = product.tags
    .find((tag) => ["cotton", "linen", "linen-blend"].includes(tag))
    ?.toUpperCase();
  const descriptionLines = description
    .split(".")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `${line}.`);

  return (
    <div className="space-y-0 px-6 md:px-10 lg:px-14">
      {/* Product Name - Editorial Serif */}
      <h1
        className="text-charcoal font-light"
        style={{
          fontFamily: "'Cormorant Garamond', 'Canela', serif",
          fontSize: "30px",
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: "normal",
        }}
      >
        {product.title}
      </h1>

      {/* Category/Fabric - 20px spacing below */}
      <div className="mt-4 mb-4">
        <p
          className="text-lg text-charcoal/70 tracking-wide"
          style={{
            fontFamily: "'Cormorant Garamond', 'Canela', serif",
            fontWeight: 400,
            fontSize: "18px",
          }}
        >
          {product.productType}
          {fabric && ` • ${fabric}`}
        </p>
      </div>

      {/* Price - 24px spacing below */}
      <div className="pb-6">
        <div
          className="text-charcoal tracking-normal"
          style={{
            fontFamily: "'Cormorant Garamond', 'Canela', serif",
            fontSize: "27px",
            fontWeight: 400,
            color: "#261317",
            lineHeight: 1,
          }}
        >
          <SalePrice
            price={price}
            compareAtPrice={compareAtPrice}
            luxuryProductDetail
          />
        </div>
      </div>

      {/* Color Swatches - Render dynamically from Shopify options */}
      {colorOptions.length > 0 && (
        <div className="pb-8">
          <h3
            className="text-sm text-charcoal/60 tracking-widest mb-5 uppercase flex items-center"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "0.15em",
            }}
          >
            <span>Colour</span>
            {selectedColor && (
              <span
                className="normal-case text-charcoal/80 ml-2 text-sm font-normal tracking-normal"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                — {selectedColor}
              </span>
            )}
          </h3>
          <div className="flex gap-2 flex-nowrap items-center">
            {colorOptions.map((opt) => {
              const isSelected =
                Boolean(selectedColor) &&
                selectedColor.toLowerCase() === opt.name.toLowerCase();
              const swatchImg = opt.swatchImageUrl || opt.imageUrl;

              return (
                <div
                  key={opt.name}
                  className={`p-[2px] rounded-sm transition-all duration-200 flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-charcoal ring-offset-2 ring-offset-ivory"
                      : "hover:ring-1 hover:ring-charcoal/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (onColorChange) {
                        onColorChange(opt.name, opt.variant);
                      } else {
                        setSelectedColor(opt.name);
                      }
                    }}
                    className={`w-10 h-12 rounded-sm relative flex items-center justify-center overflow-hidden border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-charcoal shadow-sm"
                        : "border-stone/20 hover:border-charcoal/40 opacity-90 hover:opacity-100"
                    } ${!opt.availableForSale ? "opacity-40" : ""}`}
                    style={{
                      backgroundColor: opt.hex,
                      backgroundImage: swatchImg ? `url(${swatchImg})` : undefined,
                      backgroundSize: "280%",
                      backgroundPosition: "center 28%",
                      backgroundRepeat: "no-repeat",
                      boxShadow: isSelected ? undefined : "inset 0 0 0 1px rgba(0,0,0,0.06)",
                    }}
                    title={`${opt.name}${!opt.availableForSale ? " (Out of Stock)" : ""}`}
                    aria-label={`Select colour ${opt.name}${!opt.availableForSale ? " - Out of stock" : ""}`}
                  >
                    {/* Subtle diagonal line if out of stock */}
                    {!opt.availableForSale && (
                      <span className="w-full h-[1px] bg-charcoal/70 transform rotate-45 pointer-events-none z-10" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection - 40px spacing below */}
      {sizes.length > 0 && (
        <div className="pb-8">
          <h3
            className="text-sm text-charcoal/60 tracking-widest mb-5 uppercase"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "0.15em",
            }}
          >
            Size
          </h3>
          <div className="flex gap-4 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-11 h-11 text-sm font-light transition-all duration-300 rounded-sm ${
                  selectedSize === size
                    ? "bg-charcoal text-white border border-charcoal"
                    : "bg-white text-charcoal border border-stone/20 hover:bg-warm-brown/5 hover:border-charcoal/40"
                }`}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Canela', serif",
                  fontWeight: 400,
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Guide & Size Recommender - Compact section */}
      <div className="grid grid-cols-2 gap-px border-t border-b border-stone/15 py-4">
        {/* Size Guide Column */}
        <div className="border-r border-stone/15 px-4 text-center">
          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className="w-full hover:text-charcoal/70 transition-colors"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "16px",
              fontWeight: 400,
              color: "#2A2420",
              letterSpacing: "0.05em",
            }}
          >
            Size Guide
          </button>
        </div>

        {/* Size Recommender Column */}
        <div className="px-4 text-center">
          <button
            onClick={() => setIsSizeRecommenderOpen(true)}
            className="w-full hover:text-charcoal/70 transition-colors"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "16px",
              fontWeight: 400,
              color: "#2A2420",
              letterSpacing: "0.05em",
            }}
          >
            Find My Size
          </button>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="pt-3" />
      <div className="pb-4 flex items-center gap-4 w-fit">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-11 h-11 flex items-center justify-center border border-stone/20 hover:border-charcoal/40 transition-colors rounded-sm text-lg"
          style={{
            fontFamily: "'Cormorant Garamond', 'Canela', serif",
            fontWeight: 300,
          }}
        >
          −
        </button>
        <span
          className="w-8 text-center text-charcoal"
          style={{
            fontFamily: "'Cormorant Garamond', 'Canela', serif",
            fontSize: "18px",
            fontWeight: 400,
          }}
        >
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-11 h-11 flex items-center justify-center border border-stone/20 hover:border-charcoal/40 transition-colors rounded-sm text-lg"
          style={{
            fontFamily: "'Cormorant Garamond', 'Canela', serif",
            fontWeight: 300,
          }}
        >
          +
        </button>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2 pb-8">
        <button
          onClick={addToCart}
          disabled={!isAvailable}
          className="w-full bg-charcoal text-white py-4 font-light transition-colors duration-300 hover:bg-charcoal/90 tracking-wide border border-charcoal disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: "'Cormorant Garamond', 'Canela', serif",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.08em",
          }}
        >
          {!isAvailable ? "Out of Stock" : "Add to Cart"}
        </button>
        <button
          onClick={buyNow}
          disabled={!isAvailable || buyingNow}
          className="w-full bg-white text-charcoal py-4 font-light transition-colors duration-300 hover:bg-charcoal/5 tracking-wide border border-charcoal disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: "'Cormorant Garamond', 'Canela', serif",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.08em",
          }}
        >
          {buyingNow ? "Redirecting..." : "Buy Now"}
        </button>
      </div>

      {/* Product Description */}
      <div className="pb-12">
        <div className="space-y-1.5 max-w-lg">
          {descriptionLines.map((line, index) => (
            <p
              key={index}
              className="text-charcoal/80 leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: 1.8,
                letterSpacing: "0.01em",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="w-full flex items-center justify-center gap-2 py-3 text-charcoal/70 hover:text-charcoal transition-colors duration-300 group"
        style={{
          fontFamily: "'Cormorant Garamond', 'Canela', serif",
          fontSize: "14px",
          fontWeight: 400,
          letterSpacing: "0.08em",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={isWishlisted ? "#431c1c" : "none"}
          stroke={isWishlisted ? "#431c1c" : "currentColor"}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        >
          <path d="M6 2h12v16l-6-4l-6 4V2z" />
        </svg>
        <span className="uppercase tracking-widest">
          {isWishlisted ? "Remove" : "Add"} to Wishlist
        </span>
      </button>

      {/* Delivery Info - Separated Section */}
      <div className="mt-12 pt-8 border-t border-stone/20 space-y-5">
        <div className="flex gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-charcoal/50"
            >
              <polyline points="22 12 18 12 15 21 9 21 6 12 2 12" />
              <path d="M6 5h12M9 9v3m6-3v3" />
            </svg>
          </div>
          <div>
            <p
              className="text-charcoal/80 leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "15px",
                fontWeight: 400,
              }}
            >
              Free Shipping
            </p>
            <p
              className="text-charcoal/50 mt-1"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "13px",
                fontWeight: 400,
              }}
            >
              On orders above ₹2,099
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-charcoal/50"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <polyline points="3 3 3 8 8 8" />
            </svg>
          </div>
          <div>
            <p
              className="text-charcoal/80 leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "15px",
                fontWeight: 400,
              }}
            >
              10-Day Returns
            </p>
            <p
              className="text-charcoal/50 mt-1"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "13px",
                fontWeight: 400,
              }}
            >
              Easy returns on unworn items
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-charcoal/50"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
            </svg>
          </div>
          <div>
            <p
              className="text-charcoal/80 leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "15px",
                fontWeight: 400,
              }}
            >
              Secure Payment
            </p>
            <p
              className="text-charcoal/50 mt-1"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "13px",
                fontWeight: 400,
              }}
            >
              Encrypted transactions
            </p>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <SizeGuideDrawer
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        product={product}
      />
      <SizeRecommenderModal
        isOpen={isSizeRecommenderOpen}
        onClose={() => setIsSizeRecommenderOpen(false)}
      />
    </div>
  );
};

export default ProductInfo;
