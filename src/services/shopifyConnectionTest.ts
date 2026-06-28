import { shopifyRequest } from "../api/client";
import {
  GET_FIRST_PRODUCT_QUERY,
  type GetFirstProductResponse,
  type ShopifyProductNode,
} from "../graphql/queries/getFirstProduct";

export interface ShopifyConnectionTestResult {
  connected: boolean;
  product: ShopifyProductNode | null;
}

export async function testShopifyConnection(): Promise<ShopifyConnectionTestResult> {
  const data = await shopifyRequest<GetFirstProductResponse>(
    GET_FIRST_PRODUCT_QUERY,
  );

  const product = data.products.edges[0]?.node ?? null;

  return {
    connected: true,
    product,
  };
}
