import { shopifyRequest } from "../api/client";
import {
  GET_POLICIES_QUERY,
  type GetPoliciesResponse,
  type ShopifyPolicy,
  type ShopifyPolicyPage,
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
  const pagePolicy = (
    pages: Array<ShopifyPolicyPage | null>,
    fallbackTitle: string,
  ): ShopifyPolicy | null => {
    const page = pages.find((candidate) => candidate?.body.trim());
    if (!page) return null;

    return {
      title: page.title || fallbackTitle,
      body: page.body,
      url: `/pages/${page.handle}`,
    };
  };
  const policyOrPage = (
    policy: ShopifyPolicy | null,
    page: ShopifyPolicy | null,
  ): ShopifyPolicy | null => policy?.body.trim() ? policy : page;

  return {
    privacyPolicy: policyOrPage(
      data.shop.privacyPolicy,
      pagePolicy([data.privacyPolicyPage], "Privacy Policy"),
    ),
    refundPolicy: policyOrPage(
      data.shop.refundPolicy,
      pagePolicy([data.refundPolicyPage, data.returnPolicyPage], "Refund Policy"),
    ),
    shippingPolicy: policyOrPage(
      data.shop.shippingPolicy,
      pagePolicy([data.shippingPolicyPage], "Shipping Policy"),
    ),
    termsOfService: policyOrPage(
      data.shop.termsOfService,
      pagePolicy(
        [data.termsAndConditionsPage, data.termsOfServicePage],
        "Terms of Service",
      ),
    ),
  };
}

/** Fetches a single policy by key. Returns null if not set in Shopify Admin. */
export async function getPolicy(key: PolicyKey): Promise<ShopifyPolicy | null> {
  const policies = await getAllPolicies();
  return policies[key];
}
