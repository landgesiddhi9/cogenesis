import { shopifyRequest, type ShopifyRequestOptions } from "../api/client";
import {
  GET_PAGE_BY_HANDLE_QUERY,
  type GetPageByHandleVariables,
  type GetPageByHandleResponse,
} from "../graphql/queries/getPageByHandle";
import {
  GET_SHOPIFY_PAGE_QUERY,
  type GetShopifyPageResponse,
  type GetShopifyPageVariables,
} from "../graphql/queries/getShopifyPage";
import type { ShopifyPage } from "../types";

export interface PageServiceResult {
  page: ShopifyPage | null;
}

export type { ShopifyPage };

/**
 * Fetches a Shopify page by its handle using the Storefront API.
 * Uses GET_PAGE_BY_HANDLE_QUERY with comprehensive fields (id, title, handle, body, seo, etc.)
 * and returns a PageServiceResult.
 */
export async function getPageByHandle(
  handle: string,
  options?: ShopifyRequestOptions,
): Promise<PageServiceResult> {
  const data = await shopifyRequest<GetPageByHandleResponse, GetPageByHandleVariables>(
    GET_PAGE_BY_HANDLE_QUERY,
    { handle },
    options,
  );

  if (!data?.page) {
    return { page: null };
  }

  const page: ShopifyPage = {
    id: data.page.id,
    title: data.page.title,
    handle: data.page.handle,
    body: data.page.body,
    bodySummary: data.page.bodySummary || undefined,
    createdAt: data.page.createdAt,
    updatedAt: data.page.updatedAt,
  };

  return { page };
}

/**
 * Fetches a Shopify Online Store page by its handle.
 * Uses GET_SHOPIFY_PAGE_QUERY and returns the page directly or null if not found.
 */
export async function getShopifyPage(
  handle: string,
  options?: ShopifyRequestOptions,
): Promise<ShopifyPage | null> {
  const data = await shopifyRequest<GetShopifyPageResponse, GetShopifyPageVariables>(
    GET_SHOPIFY_PAGE_QUERY,
    { handle },
    options,
  );
  return data?.page ?? null;
}
