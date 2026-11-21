import type { ShopifyProduct, ShopifyProductVariant, ShopifyPrice } from "../types";
import { getColorHex } from "./color";

export const DEFAULT_SIZES = ["S", "M", "L", "XL"];

export function getFabricComposition(product: ShopifyProduct | null | undefined): string {
  if (!product) return "";

  const handle = product.handle?.toLowerCase() || "";
  const title = product.title?.toLowerCase() || "";
  const productType = product.productType?.toLowerCase() || "";
  const tags = product.tags?.map((tag) => tag.toLowerCase()) || [];
  const description = product.description?.toLowerCase() || "";
  const categoryText = `${handle} ${title} ${productType} ${tags.join(" ")} ${description}`.replaceAll("-", " ");

  if (/\btrousers?\b/.test(categoryText)) {
    return "40% linen and 60% cotton";
  }

  if (categoryText.includes("cuban collar")) {
    return "40% linen and 60% cotton";
  }

  if (
    categoryText.includes("pure linen") ||
    categoryText.includes("100% linen")
  ) {
    return "100% linen";
  }

  if (
    categoryText.includes("linen blend") ||
    categoryText.includes("lyocell")
  ) {
    return "80% linen and 20% lyocell";
  }

  if (/\bshirts?\b/.test(categoryText)) {
    return "80% linen and 20% lyocell";
  }

  return "";
}

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
 * Hardcoded map of known product families and their sibling handles for instantaneous navigation
 * with zero network delay or catalog fetching dependency.
 */
export const KNOWN_FAMILY_COLOR_MAP: Record<string, Record<string, string>> = {
  "cuban-collar": {
    mandarin: "cuban-collar-shirt",
    black: "linen-blend-cuban-collar-shirt-black",
    clay: "linen-blend-cuban-collar-shirt-clay",
    "midnight blue": "linen-blend-cuban-collar-shirt-midnight-blue",
    olive: "linen-blend-cuban-collar-shirt-olive",
    sandstone: "linen-blend-cuban-collar-shirt-sandstone",
  },
  "single-pocket": {
    butter: "linen-blend-single-pocket-butter",
    "beach sand": "linen-blend-single-pocket-beach-sand",
    cocoa: "linen-blend-single-pocket-cocoa",
    "deep black": "linen-blend-single-pocket-deep-black",
    black: "linen-blend-single-pocket-deep-black",
    "sky blue": "linen-blend-single-pocket-sky-blue",
    "olive mist": "linen-blend-single-pocket-olive-mist",
  },
  trouser: {
    white: "linen-blend-trouser-white",
    navy: "line-trousers-navy-blue",
    "navy blue": "line-trousers-navy-blue",
    beige: "linen-trousers-beige",
  },
  "double-pocket": {
    driftwood: "pure-linen-double-pocket-driftwood",
    "rust red": "pure-linen-double-pocket-rust-red",
    peach: "pure-linen-double-pocket-peach",
    "navy blue": "pure-linen-double-pocket-navy-blue",
    navy: "pure-linen-double-pocket-navy-blue",
    "milk white": "pure-linen-double-pocket-milk-white",
    white: "pure-linen-double-pocket-milk-white",
  },
};

/**
 * High-resolution featured product images for instant, reliable swatch rendering
 * across all product families, avoiding empty, blank, or unstyled swatch boxes.
 */
export const KNOWN_HANDLE_IMAGE_MAP: Record<string, string> = {
  // Cuban collar shirts
  "cuban-collar-shirt": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2826_326761d6-3057-47a8-ba54-1fcc707d421d.jpg?v=1794408017",
  "linen-blend-cuban-collar-shirt-black": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2957_032dd0aa-302f-427d-bdac-b1e3853a8578.jpg?v=1794408481",
  "linen-blend-cuban-collar-shirt-clay": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-3054_23abc754-1ca4-4ec0-b319-9079832d6fee.jpg?v=1794663192",
  "linen-blend-cuban-collar-shirt-midnight-blue": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2831_eeb359b3-2e57-4667-91aa-5e21fc44801b.jpg?v=1794408615",
  "linen-blend-cuban-collar-shirt-olive": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2891_baf34627-99d7-46d8-a617-7251a0581f0b.jpg?v=1794662585",
  "linen-blend-cuban-collar-shirt-sandstone": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-3029.jpg?v=1794408886",

  // Single pocket shirts
  "linen-blend-single-pocket-butter": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-1813_f0be8cdb-2826-4c96-aa38-327b710044aa.jpg?v=1794665072",
  "linen-blend-single-pocket-beach-sand": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2258_52661d5c-4448-4218-a64b-d4df8f357068.jpg?v=1794665576",
  "linen-blend-single-pocket-cocoa": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-1357_9aa53621-f953-465e-9817-3672d687d184.jpg?v=1794665404",
  "linen-blend-single-pocket-deep-black": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-1876_034f60a6-f36a-4ae0-b730-ad0714f0be17.jpg?v=1794665794",
  "linen-blend-single-pocket-sky-blue": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-1689_e9ccc0ba-faa2-4e61-ab67-704af8b94a7c.jpg?v=1794665989",
  "linen-blend-single-pocket-olive-mist": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-1647.jpg?v=1794664939",

  // Trousers
  "linen-blend-trouser-white": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2510.jpg?v=1794658581",
  "line-trousers-navy-blue": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2530_268d2e32-fac6-459a-99af-ebbc240d8de3.jpg?v=1794661335",
  "linen-trousers-beige": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-1458.jpg?v=1794661557",

  // Pure linen double pocket shirts
  "pure-linen-double-pocket-driftwood": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2659.jpg?v=1794668848",
  "pure-linen-double-pocket-rust-red": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2719_3d29561d-57fc-434e-9b69-93feb5fc8233.jpg?v=1794669407",
  "pure-linen-double-pocket-peach": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2564_7c482021-d077-4cf0-a2e6-42071f500313.jpg?v=1794669513",
  "pure-linen-double-pocket-navy-blue": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2489_bb6cc623-0b53-4f54-9898-2727d1a99f18.jpg?v=1794669619",
  "pure-linen-double-pocket-milk-white": "https://cdn.shopify.com/s/files/1/1003/4790/4367/files/COGENESIS-2600_7f9bf615-2aec-419f-8dac-922330d150a1.jpg?v=1794669735",
};

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

/**
 * Resolves the target Shopify product handle when a user clicks a color swatch.
 * Supports known family mapping, dynamic catalog search, and handle prediction.
 */
export function resolveSiblingHandleForColor(
  currentProduct: ShopifyProduct | null | undefined,
  targetColor: string,
  catalog: ShopifyProduct[] = [],
): string | null {
  if (!currentProduct || !targetColor) return null;
  const cleanTarget = targetColor.trim().toLowerCase();
  const currentHandle = currentProduct.handle.toLowerCase();

  // 1. Direct family map lookup (instant, 0ms latency)
  for (const [familyKey, colorMap] of Object.entries(KNOWN_FAMILY_COLOR_MAP)) {
    if (currentHandle.includes(familyKey)) {
      if (colorMap[cleanTarget]) {
        return colorMap[cleanTarget];
      }
    }
  }

  // 2. Dynamic catalog lookup if catalog is loaded
  if (catalog && catalog.length > 0) {
    const sibling = findSiblingProductForColor(currentProduct, targetColor, catalog);
    if (sibling) return sibling.handle;
  }

  // 3. Predicted handle fallback
  const predicted = predictProductHandleForColor(currentProduct.handle, targetColor);
  if (predicted && predicted.toLowerCase() !== currentHandle) {
    return predicted;
  }

  return null;
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
 * Resolves images from admin swatch images, sibling products, variant images, or catalog fallbacks
 * ensuring colors like White, Navy, Black, etc. always render zoomed fabric crops instead of blank boxes.
 */
export function getProductColorOptions(
  product: ShopifyProduct | null | undefined,
  catalog: ShopifyProduct[] = [],
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

    // 3. Resolve variant image URL:
    // Priority:
    // a. Sibling product image (if separate products exist per color in this family)
    // b. Known handle image map fallback
    // c. Matching variant image in current product
    // d. Color slug match in known images
    // e. Product featured/first image fallback
    let resolvedImageUrl: string | undefined = undefined;

    // Check sibling product resolution:
    const siblingHandle = resolveSiblingHandleForColor(product, colorName, catalog);
    if (siblingHandle) {
      const cleanSibHandle = siblingHandle.toLowerCase();
      if (cleanSibHandle === product.handle.toLowerCase()) {
        resolvedImageUrl =
          matchingVariant?.image?.url ||
          product.featuredImage?.url ||
          product.images?.[0]?.url;
      } else {
        const siblingProduct = catalog.find(
          (p) => p.handle.toLowerCase() === cleanSibHandle,
        );
        if (siblingProduct) {
          resolvedImageUrl =
            siblingProduct.featuredImage?.url ||
            siblingProduct.images?.[0]?.url ||
            siblingProduct.variants?.[0]?.image?.url;
        }
      }

      if (!resolvedImageUrl && KNOWN_HANDLE_IMAGE_MAP[cleanSibHandle]) {
        resolvedImageUrl = KNOWN_HANDLE_IMAGE_MAP[cleanSibHandle];
      }
    }

    // Direct matching variant fallback
    if (!resolvedImageUrl && matchingVariant?.image?.url) {
      resolvedImageUrl = matchingVariant.image.url;
    }

    // Color slug match in KNOWN_HANDLE_IMAGE_MAP fallback
    if (!resolvedImageUrl) {
      const colorSlug = cleanColor.replace(/\s+/g, "-");
      const matchedKey = Object.keys(KNOWN_HANDLE_IMAGE_MAP).find((k) =>
        k.endsWith(`-${colorSlug}`) || k.includes(`-${colorSlug}-`) || k.includes(`-${colorSlug}`),
      );
      if (matchedKey) {
        resolvedImageUrl = KNOWN_HANDLE_IMAGE_MAP[matchedKey];
      }
    }

    // Default fallback to current product image so a blank box is NEVER rendered
    const finalImage =
      officialSwatchImg ||
      resolvedImageUrl ||
      matchingVariant?.image?.url ||
      product.featuredImage?.url ||
      product.images?.[0]?.url ||
      undefined;

    return {
      name: colorName,
      hex: officialHex || getColorHex(colorName),
      swatchImageUrl: finalImage,
      imageUrl: finalImage,
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
