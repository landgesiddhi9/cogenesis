import type {
  ShopifyApiCollection,
  ShopifyApiImage,
  ShopifyApiProduct,
  ShopifyApiProductVariant,
} from "../types/shopify-api";
import type {
  ShopifyCollection,
  ShopifyImage,
  ShopifyPrice,
  ShopifyProduct,
  ShopifyProductVariant,
} from "../types";

function mapPrice(price: ShopifyApiProductVariant["price"]): ShopifyPrice {
  return {
    amount: price.amount,
    currencyCode: price.currencyCode,
  };
}

export function mapShopifyImage(
  image: ShopifyApiImage | null | undefined,
  fallbackAlt: string,
): ShopifyImage {
  return {
    id: image?.id ?? "",
    url: image?.url ?? "",
    altText: image?.altText ?? fallbackAlt,
    width: image?.width ?? undefined,
    height: image?.height ?? undefined,
  };
}

function mapShopifyVariant(variant: ShopifyApiProductVariant): ShopifyProductVariant {
  return {
    id: variant.id,
    title: variant.title,
    price: mapPrice(variant.price),
    compareAtPrice: variant.compareAtPrice
      ? mapPrice(variant.compareAtPrice)
      : undefined,
    availableForSale: variant.availableForSale,
    image: variant.image ? mapShopifyImage(variant.image, variant.title) : undefined,
  };
}

export function mapShopifyProduct(
  node: ShopifyApiProduct | null | undefined,
): ShopifyProduct | null {
  if (!node) {
    return null;
  }

  const images =
    node.images?.edges.map(({ node: imageNode }) =>
      mapShopifyImage(imageNode, node.title),
    ) ?? [];

  const featuredImage = node.featuredImage?.url
    ? mapShopifyImage(node.featuredImage, node.title)
    : images[0] ?? mapShopifyImage(null, node.title);

  const variants =
    node.variants?.edges.map(({ node: variantNode }) =>
      mapShopifyVariant(variantNode),
    ) ?? [];

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml ?? undefined,
    productType: node.productType,
    tags: node.tags,
    vendor: node.vendor,
    featuredImage,
    images: images.length > 0 ? images : [featuredImage],
    variants,
    priceRange: {
      minVariantPrice: mapPrice(node.priceRange.minVariantPrice),
      maxVariantPrice: mapPrice(node.priceRange.maxVariantPrice),
    },
  };
}

export function mapShopifyCollection(
  node: ShopifyApiCollection | null | undefined,
): ShopifyCollection | null {
  if (!node) {
    return null;
  }

  const products =
    node.products?.edges
      .map(({ node: productNode }) => mapShopifyProduct(productNode))
      .filter((product): product is ShopifyProduct => product !== null) ?? [];

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    image: node.image ? mapShopifyImage(node.image, node.title) : undefined,
    products,
  };
}
