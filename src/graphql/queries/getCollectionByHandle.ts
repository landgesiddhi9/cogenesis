import { COLLECTION_FIELDS_FRAGMENT } from "../fragments/collection";
import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import type { ShopifyApiCollection } from "../../types/shopify-api";

export const GET_COLLECTION_BY_HANDLE_QUERY = `
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
