import { shopifyRequest } from "../api/client";

export type PolicyKey =
  | "privacyPolicy"
  | "refundPolicy"
  | "shippingPolicy"
  | "termsOfService";

export interface ShopifyPolicy {
  title: string;
  body: string;
  handle: string;
  url: string;
}

export type AllPolicies = Record<PolicyKey, ShopifyPolicy | null>;

interface ShopifyPoliciesQueryResponse {
  shop?: Partial<Record<PolicyKey, ShopifyPolicy | null>> | null;
}

const FETCH_SHOPIFY_POLICIES_QUERY = `
  query FetchShopifyPolicies {
    shop {
      shippingPolicy { title body handle url }
      refundPolicy { title body handle url }
      privacyPolicy { title body handle url }
      termsOfService { title body handle url }
    }
  }
`;

const POLICY_CACHE_TTL_MS = 5 * 60 * 1000;

let cachedPolicies: { value: AllPolicies; expiresAt: number } | null = null;
let policiesRequest: Promise<AllPolicies> | null = null;

const availablePolicy = (
  policy: ShopifyPolicy | null | undefined,
): ShopifyPolicy | null =>
  policy && typeof policy.body === "string" && policy.body.trim()
    ? policy
    : null;

/** Loads all published Shopify policies once and shares the result across pages. */
export function fetchShopifyPolicies(): Promise<AllPolicies> {
  if (cachedPolicies && Date.now() < cachedPolicies.expiresAt) {
    return Promise.resolve(cachedPolicies.value);
  }

  if (policiesRequest) return policiesRequest;

  policiesRequest = shopifyRequest<ShopifyPoliciesQueryResponse>(
    FETCH_SHOPIFY_POLICIES_QUERY,
  )
    .then((data) => {
      if (!data.shop) {
        throw new Error("Shopify returned no store data while loading policies.");
      }

      const policies: AllPolicies = {
        shippingPolicy: availablePolicy(data.shop.shippingPolicy),
        refundPolicy: availablePolicy(data.shop.refundPolicy),
        privacyPolicy: availablePolicy(data.shop.privacyPolicy),
        termsOfService: availablePolicy(data.shop.termsOfService),
      };

      cachedPolicies = {
        value: policies,
        expiresAt: Date.now() + POLICY_CACHE_TTL_MS,
      };
      return policies;
    })
    .catch((error: unknown) => {
      if (error instanceof SyntaxError) {
        throw new Error(
          "Shopify returned an empty or invalid response while loading policies.",
        );
      }
      throw error;
    })
    .finally(() => {
      policiesRequest = null;
    });

  return policiesRequest;
}
