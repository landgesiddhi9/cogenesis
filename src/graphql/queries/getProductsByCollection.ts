import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../fragments/productVariant";
import type { ShopifyApiProduct } from "../../types/shopify-api";

export const GET_PRODUCTS_BY_COLLECTION_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetProductsByCollection(
    $handle: String!,
    $first: Int!,
    $after: String,
    $sortKey: ProductCollectionSortKeys,
    $reverse: Boolean,
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      handle
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        edges {
          node {
            ...ProductFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
        }
      }
    }
  }
`;

export type ShopifyProductSortKeys =
  | "BEST_SELLING"
  | "COLLECTION_DEFAULT"
  | "CREATED"
  | "ID"
  | "MANUAL"
  | "PRICE"
  | "RELEVANCE"
  | "TITLE";

export interface ShopifyApiPriceRangeFilter {
  min?: number | null;
  max?: number | null;
}

export interface ShopifyApiVariantOptionFilter {
  name: string;
  value: string;
}

export interface ShopifyApiProductFilter {
  available?: boolean | null;
  price?: ShopifyApiPriceRangeFilter | null;
  productType?: string | null;
  tag?: string | null;
  variantOption?: ShopifyApiVariantOptionFilter | null;
}

export interface GetProductsByCollectionVariables {
  handle: string;
  first: number;
  after?: string | null;
  sortKey?: ShopifyProductSortKeys | null;
  reverse?: boolean | null;
  filters?: ShopifyApiProductFilter[] | null;
}

export interface GetProductsByCollectionResponse {
  collection: {
    id: string;
    handle: string;
    products: {
      edges: Array<{
        node: ShopifyApiProduct;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        endCursor: string;
      };
    };
  } | null;
}
