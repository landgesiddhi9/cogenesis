export type PolicyKey =
  | "privacyPolicy"
  | "refundPolicy"
  | "shippingPolicy"
  | "termsOfService";

export interface ShopifyPolicy {
  title: string;
  body: string;
  handle?: string;
  url?: string;
}

export type AllPolicies = Record<PolicyKey, ShopifyPolicy | null>;

interface PoliciesApiResponse {
  policies?: Partial<AllPolicies>;
  error?: string;
}

/** Loads Shopify policies from the server API so credentials never reach the browser. */
export async function fetchShopifyPolicies(
  signal?: AbortSignal,
): Promise<AllPolicies> {
  const response = await fetch("/api/policies", { signal });
  const result = (await response.json()) as PoliciesApiResponse;

  if (!response.ok) {
    throw new Error(result.error || "Unable to load Shopify policies.");
  }
  if (!result.policies) {
    throw new Error("The policy service returned no policy data.");
  }

  return {
    privacyPolicy: result.policies.privacyPolicy ?? null,
    refundPolicy: result.policies.refundPolicy ?? null,
    shippingPolicy: result.policies.shippingPolicy ?? null,
    termsOfService: result.policies.termsOfService ?? null,
  };
}

export const getAllPolicies = fetchShopifyPolicies;
