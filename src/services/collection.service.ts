import { shopifyRequest, type ShopifyRequestOptions } from "../api/client";
import {
  mapShopifyCollection,
  mapShopifyProduct,
} from "../lib/mapShopifyProduct";
import { warnMissingProductImages } from "../lib/shopifyImageDiagnostics";
import {
  GET_COLLECTION_BY_HANDLE_QUERY,
  type GetCollectionByHandleResponse,
  type GetCollectionByHandleVariables,
} from "../graphql/queries/getCollectionByHandle";
import {
  GET_PRODUCTS_BY_COLLECTION_QUERY,
  type GetProductsByCollectionResponse,
  type GetProductsByCollectionVariables,
} from "../graphql/queries/getProductsByCollection";
import type { ShopifyApiCollection, ShopifyApiProduct } from "../types/shopify-api";
import type { ShopifyCollection, ShopifyProduct } from "../types";

const DEFAULT_COLLECTION_PRODUCTS_LIMIT = 250;

export interface CollectionServiceResult {
  collection: ShopifyCollection | null;
  raw: ShopifyApiCollection | null;
}

export interface CollectionProductsResult {
  products: ShopifyProduct[];
  raw: ShopifyApiProduct[];
}

function mapCollectionNode(
  node: ShopifyApiCollection | null | undefined,
): ShopifyCollection | null {
  const collection = mapShopifyCollection(node);

  if (collection) {
    node?.products?.edges.forEach(({ node: productNode }, index) => {
      const product = collection.products[index];

      if (product) {
        warnMissingProductImages(
          `collection:${node.handle}:product:${index}`,
          productNode,
          product,
        );
      }
    });
  }

  return collection;
}

export async function getCollectionByHandle(
  handle: string,
  first: number = DEFAULT_COLLECTION_PRODUCTS_LIMIT,
  options: ShopifyRequestOptions = {},
): Promise<CollectionServiceResult> {
  const data = await shopifyRequest<
    GetCollectionByHandleResponse,
    GetCollectionByHandleVariables
  >(GET_COLLECTION_BY_HANDLE_QUERY, { handle, first }, options);

  const raw = data.collection;
  const collection = mapCollectionNode(raw);

  return { collection, raw };
}

export async function getProductsByCollection(
  handle: string,
  first: number = DEFAULT_COLLECTION_PRODUCTS_LIMIT,
  options: ShopifyRequestOptions = {},
): Promise<CollectionProductsResult> {
  const data = await shopifyRequest<
    GetProductsByCollectionResponse,
    GetProductsByCollectionVariables
  >(GET_PRODUCTS_BY_COLLECTION_QUERY, { handle, first }, options);

  const raw =
    data.collection?.products.edges.map(({ node }) => node) ?? [];

  const products = raw
    .map((node, index) => {
      const product = mapShopifyProduct(node);

      if (product) {
        warnMissingProductImages(
          `collection-products:${handle}:${index}`,
          node,
          product,
        );
      }

      return product;
    })
    .filter((product): product is ShopifyProduct => product !== null);

  return { products, raw };
}
