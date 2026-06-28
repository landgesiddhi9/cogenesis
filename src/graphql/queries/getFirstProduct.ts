import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";

export const GET_FIRST_PRODUCT_QUERY = `
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
