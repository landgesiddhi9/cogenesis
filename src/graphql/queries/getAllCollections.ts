import type { ShopifyApiCollection } from "../../types/shopify-api";

export const GET_ALL_COLLECTIONS_QUERY = `
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export interface GetAllCollectionsVariables {
  first: number;
}

export interface GetAllCollectionsResponse {
  collections: {
    edges: Array<{
      node: ShopifyApiCollection;
    }>;
  };
}

