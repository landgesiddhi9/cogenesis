import { shopifyRequest, type ShopifyRequestOptions } from "../api/client";
import { mapShopifyProduct } from "../lib/mapShopifyProduct";
import { warnMissingProductImages } from "../lib/shopifyImageDiagnostics";
import {
  GET_FEATURED_PRODUCTS_QUERY,
  type GetFeaturedProductsResponse,
  type GetFeaturedProductsVariables,
} from "../graphql/queries/getFeaturedProducts";
import {
  GET_PRODUCT_BY_HANDLE_QUERY,
  type GetProductByHandleResponse,
  type GetProductByHandleVariables,
} from "../graphql/queries/getProductByHandle";
import type { ShopifyApiProduct } from "../types/shopify-api";
import type { PageInfo, ShopifyProduct } from "../types";

const DEFAULT_FEATURED_PRODUCTS_LIMIT = 12;

export interface ProductServiceResult {
  product: ShopifyProduct | null;
  raw: ShopifyApiProduct | null;
}

export interface FeaturedProductsResult {
  products: ShopifyProduct[];
  raw: ShopifyApiProduct[];
  pageInfo: PageInfo;
}

function mapProductNode(
  node: ShopifyApiProduct | null | undefined,
  context: string,
): ShopifyProduct | null {
  const product = mapShopifyProduct(node);

  if (product) {
    warnMissingProductImages(context, node, product);
  }

  return product;
}

export async function getProductByHandle(
  handle: string,
  options: ShopifyRequestOptions = {},
): Promise<ProductServiceResult> {
  const data = await shopifyRequest<
    GetProductByHandleResponse,
    GetProductByHandleVariables
  >(GET_PRODUCT_BY_HANDLE_QUERY, { handle }, options);

  const raw = data.product;
  const product = mapProductNode(raw, `product:${handle}`);

  return { product, raw };
}

export async function getFeaturedProducts(
  first: number = DEFAULT_FEATURED_PRODUCTS_LIMIT,
  options: ShopifyRequestOptions = {},
  after?: string | null,
): Promise<FeaturedProductsResult> {
  const data = await shopifyRequest<
    GetFeaturedProductsResponse,
    GetFeaturedProductsVariables
  >(GET_FEATURED_PRODUCTS_QUERY, { first, after: after ?? undefined }, options);

  const raw = data.products.edges.map(({ node }) => node);
  const products = raw
    .map((node, index) => mapProductNode(node, `featured-product:${index}`))
    .filter((product): product is ShopifyProduct => product !== null);

  return { products, raw, pageInfo: data.products.pageInfo };
}
