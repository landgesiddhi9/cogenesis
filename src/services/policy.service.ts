import { shopifyRequest } from "../api/client";
import {
  GET_POLICIES_QUERY,
  type GetPoliciesResponse,
  type ShopifyPolicy,
} from "../graphql/queries/getPolicies";

export type { ShopifyPolicy };

export type PolicyKey =
  | "privacyPolicy"
  | "refundPolicy"
  | "shippingPolicy"
  | "termsOfService";

export interface AllPolicies {
  privacyPolicy: ShopifyPolicy | null;
  refundPolicy: ShopifyPolicy | null;
  shippingPolicy: ShopifyPolicy | null;
  termsOfService: ShopifyPolicy | null;
}

/** Fetches all four Shopify store policies in a single GraphQL request. */
export async function getAllPolicies(): Promise<AllPolicies> {
  const data = await shopifyRequest<GetPoliciesResponse>(GET_POLICIES_QUERY);
  return data.shop;
}

/** Fetches a single policy by key. Returns null if not set in Shopify Admin. */
export async function getPolicy(key: PolicyKey): Promise<ShopifyPolicy | null> {
  const policies = await getAllPolicies();
  return policies[key];
}
