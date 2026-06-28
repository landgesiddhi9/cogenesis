import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../fragments/productVariant";
import type { ShopifyApiProduct } from "../../types/shopify-api";

export const GET_PRODUCTS_BY_COLLECTION_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetProductsByCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`;

export interface GetProductsByCollectionVariables {
  handle: string;
  first: number;
}

export interface GetProductsByCollectionResponse {
  collection: {
    id: string;
    handle: string;
    products: {
      edges: Array<{
        node: ShopifyApiProduct;
      }>;
    };
  } | null;
}
