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

interface ShopifyPage {
  title: string;
  body: string;
  handle: string;
}

interface ShopifyPoliciesResponse {
  data?: {
    shop: AllPolicies;
    privacyPolicyPage: ShopifyPage | null;
    refundPolicyPage: ShopifyPage | null;
    returnPolicyPage: ShopifyPage | null;
    shippingPolicyPage: ShopifyPage | null;
    termsAndConditionsPage: ShopifyPage | null;
    termsOfServicePage: ShopifyPage | null;
  };
  errors?: Array<{ message: string }>;
}

const FETCH_SHOPIFY_POLICIES_QUERY = `
  query FetchShopifyPolicies {
    shop {
      privacyPolicy { title body handle }
      termsOfService { title body handle }
      refundPolicy { title body handle }
      shippingPolicy { title body handle }
    }
    privacyPolicyPage: page(handle: "privacy-policy") {
      title
      body
      handle
    }
    refundPolicyPage: page(handle: "refund-policy") {
      title
      body
      handle
    }
    returnPolicyPage: page(handle: "return-policy") {
      title
      body
      handle
    }
    shippingPolicyPage: page(handle: "shipping-policy") {
      title
      body
      handle
    }
    termsAndConditionsPage: page(handle: "terms-and-conditions") {
      title
      body
      handle
    }
    termsOfServicePage: page(handle: "terms-of-service") {
      title
      body
      handle
    }
  }
`;

const hasBody = (policy: ShopifyPolicy | ShopifyPage | null | undefined) =>
  typeof policy?.body === "string" && policy.body.trim().length > 0;

const firstAvailable = (
  policy: ShopifyPolicy | null,
  pages: Array<ShopifyPage | null>,
  fallbackTitle: string,
): ShopifyPolicy | null => {
  if (hasBody(policy)) return policy;

  const page = pages.find(hasBody);
  if (!page) return null;

  return {
    title: page.title || fallbackTitle,
    body: page.body,
    handle: page.handle,
    url: `/pages/${page.handle}`,
  };
};

/** Fetches Storefront policies and matching Shopify Pages directly from Shopify. */
export async function fetchShopifyPolicies(
  signal?: AbortSignal,
): Promise<AllPolicies> {
  const env = import.meta.env;
  const storeDomain =
    env.VITE_SHOPIFY_STORE_DOMAIN || env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken =
    env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    env.VITE_SHOPIFY_STOREFRONT_TOKEN ||
    env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!storeDomain?.trim() || !storefrontAccessToken?.trim()) {
    throw new Error(
      "Shopify policies are unavailable. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN (or the matching NEXT_PUBLIC_ variables).",
    );
  }

  const domain = storeDomain.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  const apiVersion =
    env.VITE_SHOPIFY_API_VERSION ||
    env.NEXT_PUBLIC_SHOPIFY_API_VERSION ||
    "2024-10";
  const response = await fetch(
    `https://${domain}/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken.trim(),
      },
      body: JSON.stringify({ query: FETCH_SHOPIFY_POLICIES_QUERY }),
      signal,
    },
  );
  const text = await response.text();

  if (!response.ok || !text.trim()) {
    throw new Error(
      `Shopify policy request failed${response.status ? ` (HTTP ${response.status})` : ""}: ${text.trim() || response.statusText || "empty response"}`,
    );
  }

  let result: ShopifyPoliciesResponse;
  try {
    result = JSON.parse(text) as ShopifyPoliciesResponse;
  } catch {
    throw new Error("Shopify returned an invalid response while loading policies.");
  }

  if (result.errors?.length) {
    throw new Error(
      `Shopify policy request failed: ${result.errors.map((error) => error.message).join("; ")}`,
    );
  }
  if (!result.data?.shop) {
    throw new Error("Shopify returned no policy data.");
  }

  const data = result.data;
  return {
    privacyPolicy: firstAvailable(
      data.shop.privacyPolicy,
      [data.privacyPolicyPage],
      "Privacy Policy",
    ),
    refundPolicy: firstAvailable(
      data.shop.refundPolicy,
      [data.refundPolicyPage, data.returnPolicyPage],
      "Refund Policy",
    ),
    shippingPolicy: firstAvailable(
      data.shop.shippingPolicy,
      [data.shippingPolicyPage],
      "Shipping Policy",
    ),
    termsOfService: firstAvailable(
      data.shop.termsOfService,
      [data.termsAndConditionsPage, data.termsOfServicePage],
      "Terms of Service",
    ),
  };
}

export const getAllPolicies = fetchShopifyPolicies;
