import type { ShopifyProduct, ShopifyProductVariant, ShopifyPrice } from "../types";
import { getColorHex } from "./color";

export const DEFAULT_SIZES = ["S", "M", "L", "XL"];

/**
 * Checks whether an option name corresponds to a color/colour attribute.
 */
export function isColorOptionName(name: string): boolean {
  const n = name.trim().toLowerCase();
  return n === "color" || n === "colour" || n === "shade";
}

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
 * Extracts dynamic color options from a Shopify product.
 * Returns an empty array if the product does not have any color variants.
 */
export function getProductColors(product: ShopifyProduct | null | undefined): string[] {
  if (!product) return [];

  // 1. Check product.options for "Color" or "Colour"
  const colorOption = product.options?.find((opt) => isColorOptionName(opt.name));
  if (colorOption && colorOption.values?.length > 0) {
    // Filter out generic values like "Default Title"
    return colorOption.values.filter(
      (v) => v && v.toLowerCase() !== "default title",
    );
  }

  // 2. Inspect variant selectedOptions
  const variantColors = new Set<string>();
  product.variants?.forEach((v) => {
    const colorOpt = v.selectedOptions?.find((opt) => isColorOptionName(opt.name));
    if (colorOpt?.value && colorOpt.value.toLowerCase() !== "default title") {
      variantColors.add(colorOpt.value.trim());
    }
  });

  if (variantColors.size > 0) {
    return Array.from(variantColors);
  }

  // 3. Inspect variant titles (e.g. "S / Olive" or "Beige") if not "Default Title"
  const distinctTitles = (product.variants || [])
    .map((v) => v.title)
    .filter((title) => title && title.toLowerCase() !== "default title");

  if (distinctTitles.length > 0) {
    const parsedColors = new Set<string>();
    distinctTitles.forEach((t) => {
      const parts = t.split("/").map((p) => p.trim());
      // Find parts that are not pure sizes
      const nonSizes = parts.filter(
        (p) => !/^(XS|S|M|L|XL|XXL|XXXL|[0-9]{2,3})$/i.test(p),
      );
      nonSizes.forEach((c) => {
        if (c) parsedColors.add(c);
      });
    });

    if (parsedColors.size > 0) {
      return Array.from(parsedColors);
    }
  }

  return [];
}

export interface ProductColorOption {
  name: string;
  hex: string;
  swatchImageUrl?: string;
  imageUrl?: string;
  variantId?: string;
  availableForSale: boolean;
  price?: ShopifyPrice;
  variant?: ShopifyProductVariant;
}

/**
 * Maps Shopify color options to their corresponding variant preview data (official hex, swatch image, stock).
 */
export function getProductColorOptions(
  product: ShopifyProduct | null | undefined,
): ProductColorOption[] {
  if (!product) return [];

  const colorNames = getProductColors(product);
  if (colorNames.length === 0) return [];

  // Find the product option associated with Color
  const colorOption = product.options?.find((opt) => isColorOptionName(opt.name));

  return colorNames.map((colorName) => {
    const cleanColor = colorName.trim().toLowerCase();

    // 1. Look for official Shopify Admin optionValue swatch:
    const optionVal = colorOption?.optionValues?.find(
      (ov) => ov.name.trim().toLowerCase() === cleanColor,
    );

    const officialHex = optionVal?.swatch?.color || null;
    const officialSwatchImg = optionVal?.swatch?.imageUrl || null;

    // 2. Find matching variant:
    const matchingVariant = product.variants?.find((v) => {
      const matchOpt = v.selectedOptions?.some(
        (o) => isColorOptionName(o.name) && o.value.trim().toLowerCase() === cleanColor,
      );
      if (matchOpt) return true;
      return v.title.toLowerCase().includes(cleanColor);
    });

    return {
      name: colorName,
      hex: officialHex || getColorHex(colorName),
      swatchImageUrl: officialSwatchImg || undefined,
      imageUrl: matchingVariant?.image?.url,
      variantId: matchingVariant?.id,
      availableForSale: matchingVariant ? matchingVariant.availableForSale : true,
      price: matchingVariant?.price,
      variant: matchingVariant,
    };
  });
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
          (o) => isColorOptionName(o.name) && o.value.toLowerCase() === cleanColor,
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
    if (sizeOptMatch && !cleanColor) return sizeOptMatch;

    // 3. Match variant title directly
    const titleExact = variants.find(
      (v) => v.title.toLowerCase() === cleanSize,
    );
    if (titleExact && !cleanColor) return titleExact;

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
    if (titleSize && !cleanColor) return titleSize;
  }

  // If only color was provided
  if (cleanColor) {
    const colorMatch = variants.find((v) =>
      v.selectedOptions?.some(
        (o) => isColorOptionName(o.name) && o.value.toLowerCase() === cleanColor,
      ) || v.title.toLowerCase().includes(cleanColor),
    );
    if (colorMatch) return colorMatch;
  }

  // Fallback to first available variant, or first variant
  return variants.find((v) => v.availableForSale) || variants[0];
}

/**
 * Predicts a product handle based on a base product handle and a target color name.
 */
export function predictProductHandleForColor(
  currentHandle: string,
  targetColor: string,
): string {
  const targetSlug = targetColor.trim().toLowerCase().replace(/\s+/g, "-");

  // Special case: "Mandarin" collar shirt uses base handle "cuban-collar-shirt"
  if (targetSlug === "mandarin" && currentHandle.includes("cuban-collar-shirt")) {
    return "cuban-collar-shirt";
  }

  const handleParts = currentHandle.split("-");
  for (let i = 1; i <= 3; i++) {
    const base = handleParts.slice(0, handleParts.length - i).join("-");
    if (base.length > 3) {
      return `${base}-${targetSlug}`;
    }
  }

  return `${currentHandle}-${targetSlug}`;
}

/**
 * Resolves a sibling product for a given color.
 * If the store creates separate products per color (e.g., linen-blend-cuban-collar-shirt-black),
 * this finds the matching product in the catalog to allow URL handle navigation.
 */
export function findSiblingProductForColor(
  currentProduct: ShopifyProduct | null | undefined,
  targetColor: string,
  catalog: ShopifyProduct[],
): ShopifyProduct | null {
  if (!currentProduct || !targetColor) return null;
  const cleanTarget = targetColor.trim().toLowerCase();
  const targetSlug = cleanTarget.replace(/\s+/g, "-");

  // 1. Direct handle pattern match:
  const handleParts = currentProduct.handle.split("-");
  for (let i = 1; i <= 3; i++) {
    const base = handleParts.slice(0, handleParts.length - i).join("-");
    if (base) {
      const candidateHandle = `${base}-${targetSlug}`;
      const found = catalog.find(
        (p) => p.handle.toLowerCase() === candidateHandle,
      );
      if (found) return found;
    }
  }

  // 2. Base title similarity:
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const currentNorm = normalize(currentProduct.title);

  const candidates = catalog.filter((p) => {
    const pTitle = normalize(p.title);
    const pHandle = p.handle.toLowerCase();
    const hasColor = pTitle.includes(cleanTarget) || pHandle.includes(targetSlug);
    if (!hasColor) return false;
    if (
      currentProduct.productType &&
      p.productType &&
      currentProduct.productType !== p.productType
    ) {
      return false;
    }
    return true;
  });

  if (candidates.length === 1) return candidates[0];

  if (candidates.length > 1) {
    const currentWords = new Set(
      currentNorm.split(" ").filter((w) => w.length > 2),
    );
    let bestCandidate = candidates[0];
    let maxOverlap = -1;
    for (const cand of candidates) {
      const candWords = normalize(cand.title).split(" ");
      const overlap = candWords.filter((w) => currentWords.has(w)).length;
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        bestCandidate = cand;
      }
    }
    return bestCandidate;
  }

  return null;
}
