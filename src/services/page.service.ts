import { shopifyRequest, type ShopifyRequestOptions } from "../api/client";
import {
  GET_PAGE_BY_HANDLE_QUERY,
  type GetPageByHandleVariables,
  type GetPageByHandleResponse,
} from "../graphql/queries/getPageByHandle";
import type { ShopifyPage } from "../types";

export interface PageServiceResult {
  page: ShopifyPage | null;
}

/**
 * Fetches a Shopify page by its handle using the Storefront API.
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
