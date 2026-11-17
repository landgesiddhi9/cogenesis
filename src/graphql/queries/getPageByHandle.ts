import type { ShopifyApiPage } from "../../types/shopify-api";

export const GET_PAGE_BY_HANDLE_QUERY = `
  query GetPageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
      createdAt
      updatedAt
      seo {
        title
        description
      }
    }
  }
`;

export interface GetPageByHandleVariables {
  handle: string;
}

export interface GetPageByHandleResponse {
  page: ShopifyApiPage | null;
}
