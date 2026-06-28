import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import type { ShopifyApiProduct } from "../../types/shopify-api";

export const GET_FEATURED_PRODUCTS_QUERY = `
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetFeaturedProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export interface GetFeaturedProductsVariables {
  first: number;
}

export interface GetFeaturedProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyApiProduct;
    }>;
  };
}
