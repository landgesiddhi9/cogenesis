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
    <div className={`font-sans text-[11px] md:text-[12px] text-charcoal md:text-[#888] tracking-[0.02em] tabular-nums ${className}`}>
      {onSale ? (
        <>
          <span className="line-through text-charcoal/50 md:text-[#aaa] mr-2">
            {formatPrice(originalPrice, currencyCode)}
          </span>
          <span className="text-charcoal md:text-[#111] font-medium md:text-[13px] mr-2">
            {formatPrice(price, currencyCode)}
          </span>
          <span className="text-charcoal/50 md:text-[#4A2E2A] font-normal md:font-medium md:text-[10px]">
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
