// Fetches a single Shopify Online Store page by its handle.
// Used for CMS-managed pages like Care Guide, Fabric Guide, etc.

export const GET_SHOPIFY_PAGE_QUERY = `
  query GetShopifyPage($handle: String!) {
    page(handle: $handle) {
      title
      body
      handle
    }
  }
`;

export interface ShopifyPage {
  title: string;
  body: string;
  handle: string;
}

export interface GetShopifyPageVariables {
  handle: string;
}

export interface GetShopifyPageResponse {
  page: ShopifyPage | null;
}
