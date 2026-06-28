import { shopifyRequest, type ShopifyRequestOptions } from "../api/client";
import { mapShopifyProduct } from "../lib/mapShopifyProduct";
import { warnMissingProductImages } from "../lib/shopifyImageDiagnostics";
import {
  SEARCH_PRODUCTS_QUERY,
  type SearchProductsResponse,
  type SearchProductsVariables,
} from "../graphql/queries/searchProducts";
import type { ShopifyApiProduct } from "../types/shopify-api";
import type { ShopifyProduct } from "../types";

const DEFAULT_SEARCH_LIMIT = 20;

export interface SearchProductsResult {
  products: ShopifyProduct[];
  raw: ShopifyApiProduct[];
}

export async function searchProducts(
  query: string,
  first: number = DEFAULT_SEARCH_LIMIT,
  options: ShopifyRequestOptions = {},
): Promise<SearchProductsResult> {
  if (!query.trim()) {
    return { products: [], raw: [] };
  }

  const data = await shopifyRequest<
    SearchProductsResponse,
    SearchProductsVariables
  >(SEARCH_PRODUCTS_QUERY, { query: query.trim(), first }, options);

  const raw = data.products.edges.map(({ node }) => node);
  const products = raw
    .map((node, index) => {
      const product = mapShopifyProduct(node);

      if (product) {
        warnMissingProductImages(
          `search:${index}:${product.handle}`,
          node,
          product,
        );
      }

      return product;
    })
    .filter((product): product is ShopifyProduct => product !== null);

  return { products, raw };
}
