import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { PRODUCT_FIELDS_FRAGMENT } from "../fragments/product";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../fragments/productVariant";
import type { ShopifyApiProduct } from "../../types/shopify-api";

export const GET_FEATURED_PRODUCTS_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
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
