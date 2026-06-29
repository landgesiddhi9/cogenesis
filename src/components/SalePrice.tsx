import { memo } from "react";
import { formatPrice, getSaleInfo } from "../utils/price";

interface SalePriceProps {
  price: string;
  compareAtPrice?: string | null;
  currencyCode?: string;
  className?: string;
}

const SalePrice = memo(({ price, compareAtPrice, currencyCode = "INR", className = "" }: SalePriceProps) => {
  const { onSale, originalPrice, discountPercent } = getSaleInfo(price, compareAtPrice);

  return (
    <div className={`font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums ${className}`}>
      {onSale ? (
        <>
          <span className="line-through text-[#aaa] mr-2">
            {formatPrice(originalPrice, currencyCode)}
          </span>
          <span className="text-[#111] font-medium text-[13px] mr-2">
            {formatPrice(price, currencyCode)}
          </span>
          <span className="text-[10px] tracking-[0.08em] text-[#4A2E2A] font-medium">
            {discountPercent}% OFF
          </span>
        </>
      ) : (
        <span>{formatPrice(price, currencyCode)}</span>
      )}
    </div>
  );
});

export default SalePrice;
