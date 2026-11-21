import { memo } from "react";
import { formatPrice, getSaleInfo } from "../utils/price";

interface SalePriceProps {
  price: string;
  compareAtPrice?: string | null;
  currencyCode?: string;
  className?: string;
  luxuryProductDetail?: boolean;
}

const SalePrice = memo(({ price, compareAtPrice, currencyCode = "INR", className = "", luxuryProductDetail = false }: SalePriceProps) => {
  const { onSale, originalPrice, discountPercent } = getSaleInfo(price, compareAtPrice);

  return (
    <div className={`font-sans ${luxuryProductDetail ? "text-[27px] text-[#261317] font-normal" : "text-[11px] md:text-[12px] text-charcoal md:text-[#888]"} tracking-[0.02em] tabular-nums ${className}`} style={luxuryProductDetail ? { fontFamily: "'Cormorant Garamond', 'Canela', serif" } : undefined}>
      {onSale ? (
        <>
          <span className={luxuryProductDetail ? "line-through text-charcoal/50 text-[20px] mr-2" : "line-through text-charcoal/50 md:text-[#aaa] mr-2"}>
            {formatPrice(originalPrice, currencyCode)}
          </span>
          <span className={luxuryProductDetail ? "text-[#261317] font-normal text-[27px] mr-2" : "text-charcoal md:text-[#111] font-medium md:text-[13px] mr-2"}>
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
