import type { ShopifyProduct } from "../types";

export function formatPrice(amount: string, currencyCode = "INR"): string {
  const locale = currencyCode === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export interface SaleInfo {
  onSale: boolean;
  originalPrice: string;
  salePrice: string;
  discountPercent: number;
}

export function getSaleInfo(
  price: string,
  compareAtPrice?: string | null,
): SaleInfo {
  const salePrice = Number(price);
  const originalPrice = compareAtPrice ? Number(compareAtPrice) : undefined;

  if (originalPrice !== undefined && originalPrice > salePrice) {
    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    return { onSale: true, originalPrice: compareAtPrice!, salePrice: price, discountPercent: discount };
  }

  return { onSale: false, originalPrice: price, salePrice: price, discountPercent: 0 };
}

export function getBestCompareAtPrice(product: ShopifyProduct): string | undefined {
  let best: number | undefined;
  for (const variant of product.variants) {
    if (variant.compareAtPrice) {
      const ca = Number(variant.compareAtPrice.amount);
      const p = Number(variant.price.amount);
      if (ca > p && (best === undefined || ca > best)) {
        best = ca;
      }
    }
  }
  return best !== undefined ? String(best) : undefined;
}
