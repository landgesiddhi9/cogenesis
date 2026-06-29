import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../fragments/productVariant";
import type { ShopifyApiProduct } from "../../types/shopify-api";

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
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
