import { COLLECTION_FIELDS_FRAGMENT } from "../fragments/collection";
import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../fragments/productVariant";
import type { ShopifyApiCollection } from "../../types/shopify-api";

export const GET_COLLECTION_BY_HANDLE_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
  ${COLLECTION_FIELDS_FRAGMENT}
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      ...CollectionFields
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

export interface GetCollectionByHandleVariables {
  handle: string;
  first: number;
}

export interface GetCollectionByHandleResponse {
  collection: ShopifyApiCollection | null;
}
