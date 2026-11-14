import type { ShopifyProduct, ShopifyProductVariant } from "../types";

export const DEFAULT_SIZES = ["S", "M", "L", "XL"];

/**
 * Extracts available size options from a Shopify product.
 * Returns an empty array if the product has a single "Default Title" variant.
 */
export function getProductSizes(product: ShopifyProduct | null | undefined): string[] {
  if (!product) return DEFAULT_SIZES;

  // 1. Check product.options for a "Size" option
  const sizeOption = product.options?.find(
    (opt) => opt.name.toLowerCase() === "size",
  );
  if (sizeOption && sizeOption.values?.length > 0) {
    return sizeOption.values;
  }

  // 2. Check if the product has only 1 variant with "Default Title"
  if (
    product.variants?.length === 1 &&
    product.variants[0].title.toLowerCase() === "default title"
  ) {
    return [];
  }

  // 3. Inspect variant selectedOptions
  const variantSizes = new Set<string>();
  product.variants?.forEach((v) => {
    const sizeSelectedOpt = v.selectedOptions?.find(
      (opt) => opt.name.toLowerCase() === "size",
    );
    if (sizeSelectedOpt?.value) {
      variantSizes.add(sizeSelectedOpt.value);
    }
  });

  if (variantSizes.size > 0) {
    return Array.from(variantSizes);
  }

  // 4. Inspect variant titles if they differ from "Default Title"
  const distinctTitles = (product.variants || [])
    .map((v) => v.title)
    .filter((title) => title && title.toLowerCase() !== "default title");

  if (distinctTitles.length > 0) {
    // If titles are formatted as "Size / Color" or "Color / Size"
    const parsedSizes = new Set<string>();
    distinctTitles.forEach((t) => {
      const parts = t.split("/").map((p) => p.trim());
      // Common apparel size values
      const matched = parts.find((p) =>
        /^(XS|S|M|L|XL|XXL|XXXL|[0-9]{2,3})$/i.test(p),
      );
      if (matched) {
        parsedSizes.add(matched.toUpperCase());
      } else {
        parsedSizes.add(parts[0]);
      }
    });

    if (parsedSizes.size > 0) {
      return Array.from(parsedSizes);
    }
  }

  // Default fallback for apparel design
  return DEFAULT_SIZES;
}

/**
 * Resolves the matching Shopify product variant based on selected size and optional color.
 */
export function resolveProductVariant(
  product: ShopifyProduct | null | undefined,
  selectedSize?: string,
  selectedColorName?: string,
): ShopifyProductVariant | null {
  if (!product || !product.variants || product.variants.length === 0) {
    return null;
  }

  const variants = product.variants;

  // Single variant shortcut
  if (variants.length === 1) {
    return variants[0];
  }

  const cleanSize = selectedSize?.trim().toLowerCase();
  const cleanColor = selectedColorName?.trim().toLowerCase();

  if (cleanSize) {
    // 1. Match both size and color in selectedOptions
    if (cleanColor) {
      const bothMatch = variants.find((v) => {
        const hasSize = v.selectedOptions?.some(
          (o) => o.name.toLowerCase() === "size" && o.value.toLowerCase() === cleanSize,
        );
        const hasColor = v.selectedOptions?.some(
          (o) => o.name.toLowerCase() === "color" && o.value.toLowerCase() === cleanColor,
        );
        return hasSize && hasColor;
      });
      if (bothMatch) return bothMatch;
    }

    // 2. Match size in selectedOptions
    const sizeOptMatch = variants.find((v) =>
      v.selectedOptions?.some(
        (o) => o.name.toLowerCase() === "size" && o.value.toLowerCase() === cleanSize,
      ),
    );
    if (sizeOptMatch) return sizeOptMatch;

    // 3. Match variant title directly
    const titleExact = variants.find(
      (v) => v.title.toLowerCase() === cleanSize,
    );
    if (titleExact) return titleExact;

    // 4. Match variant title containing both size and color
    if (cleanColor) {
      const titleBoth = variants.find((v) => {
        const t = v.title.toLowerCase();
        return t.includes(cleanSize) && t.includes(cleanColor);
      });
      if (titleBoth) return titleBoth;
    }

    // 5. Match variant title containing size
    const titleSize = variants.find((v) =>
      v.title.toLowerCase().includes(cleanSize),
    );
    if (titleSize) return titleSize;
  }

  // If only color was provided
  if (cleanColor) {
    const colorMatch = variants.find((v) =>
      v.selectedOptions?.some(
        (o) => o.name.toLowerCase() === "color" && o.value.toLowerCase() === cleanColor,
      ) || v.title.toLowerCase().includes(cleanColor),
    );
    if (colorMatch) return colorMatch;
  }

  // Fallback to first available variant, or first variant
  return variants.find((v) => v.availableForSale) || variants[0];
}
