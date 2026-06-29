import type { ShopifyApiProduct } from "../types/shopify-api";
import type { ShopifyProduct } from "../types";

export type ImageFailureCategory =
  | "shopify-data"
  | "graphql-query"
  | "mapping"
  | "ui-rendering";

const CATEGORY_EXPLANATIONS: Record<ImageFailureCategory, string> = {
  "shopify-data":
    "Shopify returned no usable image URL for this product. Check the product media in Shopify Admin.",
  "graphql-query":
    "The GraphQL query may be missing image fields (featuredImage, images, or variant.image).",
  mapping:
    "Shopify returned image data, but the mapper produced an empty or incorrect URL.",
  "ui-rendering":
    "The mapped URL looks valid, but the browser failed to load the asset (CDN, permissions, or broken media URL).",
};

function hasRawImageData(rawProduct: ShopifyApiProduct | null | undefined): boolean {
  if (!rawProduct) {
    return false;
  }

  if (rawProduct.featuredImage?.url) {
    return true;
  }

  return (
    rawProduct.images?.edges.some(({ node }) => Boolean(node.url)) ?? false
  );
}

function getRawImageUrls(rawProduct: ShopifyApiProduct | null | undefined): string[] {
  if (!rawProduct) {
    return [];
  }

  const urls = new Set<string>();

  if (rawProduct.featuredImage?.url) {
    urls.add(rawProduct.featuredImage.url);
  }

  rawProduct.images?.edges.forEach(({ node }) => {
    if (node.url) {
      urls.add(node.url);
    }
  });

  rawProduct.variants?.edges.forEach(({ node }) => {
    if (node.image?.url) {
      urls.add(node.image.url);
    }
  });

  return [...urls];
}

export function diagnoseProductImageFailure(
  rawProduct: unknown,
  mappedProduct: ShopifyProduct,
  failedUrl: string,
): ImageFailureCategory {
  const raw = rawProduct as ShopifyApiProduct | null | undefined;
  const rawUrls = getRawImageUrls(raw);
  const mappedUrls = new Set(
    [
      mappedProduct.featuredImage.url,
      ...mappedProduct.images.map((image) => image.url),
      ...mappedProduct.variants
        .map((variant) => variant.image?.url)
        .filter(Boolean),
    ].filter(Boolean),
  );

  if (!raw) {
    return "graphql-query";
  }

  if (!hasRawImageData(raw)) {
    return "shopify-data";
  }

  if (rawUrls.length > 0 && mappedUrls.size === 0) {
    return "mapping";
  }

  if (failedUrl && mappedUrls.has(failedUrl) && rawUrls.includes(failedUrl)) {
    return "ui-rendering";
  }

  if (failedUrl && !mappedUrls.has(failedUrl)) {
    return "mapping";
  }

  if (mappedProduct.featuredImage.url && !rawUrls.includes(mappedProduct.featuredImage.url)) {
    return "mapping";
  }

  return "shopify-data";
}

export function logProductImageFailure(
  context: string,
  rawProduct: unknown,
  mappedProduct: ShopifyProduct,
  failedUrl: string,
): ImageFailureCategory {
  const category = diagnoseProductImageFailure(
    rawProduct,
    mappedProduct,
    failedUrl,
  );

  console.group(`[Shopify Image Diagnostic] ${context}`);
  console.error("Failure category:", category);
  console.error("Explanation:", CATEGORY_EXPLANATIONS[category]);
  console.error("Failed URL:", failedUrl || "(empty)");
  console.error("Mapped product:", mappedProduct);
  console.error("Raw Shopify product:", rawProduct);
  console.groupEnd();

  return category;
}

export function warnMissingProductImages(
  context: string,
  rawProduct: unknown,
  mappedProduct: ShopifyProduct,
): void {
  if (mappedProduct.featuredImage.url) {
    return;
  }

  logProductImageFailure(context, rawProduct, mappedProduct, "");
}
