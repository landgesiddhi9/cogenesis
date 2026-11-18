import { shopifyRequest } from "../api/client";
import {
  GET_SHOPIFY_PAGE_QUERY,
  type GetShopifyPageResponse,
  type GetShopifyPageVariables,
  type ShopifyPage,
} from "../graphql/queries/getShopifyPage";

export type { ShopifyPage };

/** Fetches a Shopify Online Store page by its handle. Returns null if not found. */
export async function getShopifyPage(handle: string): Promise<ShopifyPage | null> {
  const data = await shopifyRequest<GetShopifyPageResponse, GetShopifyPageVariables>(
    GET_SHOPIFY_PAGE_QUERY,
    { handle },
  );
  return data.page;
}
