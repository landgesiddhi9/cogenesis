const SHOPIFY_CDN = "cdn.shopify.com";

export function shopifyImageUrl(url: string, width: number): string {
  if (!url || !url.includes(SHOPIFY_CDN)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}width=${width}&format=webp`;
}

export function shopifyImageSrcSet(url: string, widths: number[]): string {
  if (!url || !url.includes(SHOPIFY_CDN)) return "";
  return widths.map((w) => `${shopifyImageUrl(url, w)} ${w}w`).join(", ");
}
