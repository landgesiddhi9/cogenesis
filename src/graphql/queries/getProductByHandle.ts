import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import type { ShopifyApiProduct } from "../../types/shopify-api";

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export interface GetProductByHandleVariables {
  handle: string;
}

export interface GetProductByHandleResponse {
  product: ShopifyApiProduct | null;
}
