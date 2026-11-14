import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../fragments/productVariant";
import type { ShopifyApiProduct } from "../../types/shopify-api";

export const GET_ALL_PRODUCTS_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetAllProducts(
    $first: Int!,
    $after: String,
    $query: String,
    $sortKey: ProductSortKeys,
    $reverse: Boolean
  ) {
    products(
      first: $first,
      after: $after,
      query: $query,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      edges {
        cursor
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

export type ShopifyAllProductsSortKeys =
  | "TITLE"
  | "PRODUCT_TYPE"
  | "VENDOR"
  | "UPDATED_AT"
  | "CREATED_AT"
  | "BEST_SELLING"
  | "PRICE"
  | "ID"
  | "RELEVANCE";

export interface GetAllProductsVariables {
  first: number;
  after?: string | null;
  query?: string | null;
  sortKey?: ShopifyAllProductsSortKeys | null;
  reverse?: boolean | null;
}

export interface GetAllProductsResponse {
  products: {
    edges: Array<{
      cursor: string;
      node: ShopifyApiProduct;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      endCursor: string;
      startCursor?: string;
    };
  };
}
