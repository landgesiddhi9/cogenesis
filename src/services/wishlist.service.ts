import { shopifyRequest, type ShopifyRequestOptions } from "../api/client";
import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../graphql/fragments/productImage";
import { PRODUCT_FIELDS_FRAGMENT } from "../graphql/fragments/product";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../graphql/fragments/productVariant";
import { mapShopifyProduct } from "../lib/mapShopifyProduct";
import type { ShopifyApiProduct } from "../types/shopify-api";
import type { ShopifyProduct } from "../types";

const GET_WISHLIST_PRODUCTS_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetWishlistProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        ...ProductFields
      }
    }
  }
`;

interface GetWishlistProductsResponse {
  nodes: Array<ShopifyApiProduct | null>;
}

interface GetWishlistProductsVariables {
  ids: string[];
}

export async function getWishlistProductsByIds(
  ids: string[],
  options: ShopifyRequestOptions = {},
): Promise<ShopifyProduct[]> {
  if (!ids.length) {
    return [];
  }

  const data = await shopifyRequest<
    GetWishlistProductsResponse,
    GetWishlistProductsVariables
  >(GET_WISHLIST_PRODUCTS_QUERY, { ids }, options);

  return data.nodes
    .map((node) => mapShopifyProduct(node))
    .filter((product): product is ShopifyProduct => product !== null);
}
