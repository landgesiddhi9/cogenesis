import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../fragments/productVariant";

export const GET_FIRST_PRODUCT_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetFirstProduct {
    products(first: 1) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
}

export interface GetFirstProductResponse {
  products: {
    edges: Array<{
      node: ShopifyProductNode;
    }>;
  };
}
