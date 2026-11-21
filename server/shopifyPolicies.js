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

const getFirstEnv = (...names) =>
  names.map((name) => process.env[name]?.trim()).find(Boolean);

const hasBody = (policy) =>
  typeof policy?.body === "string" && policy.body.trim().length > 0;

const pageAsPolicy = (page, fallbackTitle) => {
  if (!hasBody(page)) return null;

  return {
    title: page.title?.trim() || fallbackTitle,
    body: page.body,
    handle: page.handle,
    url: `/pages/${page.handle}`,
  };
};

const usePolicyOrPage = (policy, pages, fallbackTitle) => {
  if (hasBody(policy)) return policy;

  for (const page of pages) {
    const result = pageAsPolicy(page, fallbackTitle);
    if (result) return result;
  }

  return null;
};

export async function fetchShopifyPolicies() {
  const storeDomain = getFirstEnv(
    "SHOPIFY_STORE_DOMAIN",
    "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
    "VITE_SHOPIFY_STORE_DOMAIN",
  );
  const storefrontToken = getFirstEnv(
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
    "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
    "VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
    "VITE_SHOPIFY_STOREFRONT_TOKEN",
  );

  if (!storeDomain || !storefrontToken) {
    throw new Error(
      "Shopify policy content is unavailable: set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN (or their NEXT_PUBLIC_ equivalents).",
    );
  }

  const domain = storeDomain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  const apiVersion =
    getFirstEnv("SHOPIFY_API_VERSION", "VITE_SHOPIFY_API_VERSION") || "2025-10";
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query: FETCH_SHOPIFY_POLICIES_QUERY }),
  });

  if (!response.ok) {
    throw new Error(`Shopify policy request failed with HTTP ${response.status}.`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(
      `Shopify policy request failed: ${payload.errors.map((error) => error.message).join("; ")}`,
    );
  }
  if (!payload.data?.shop) {
    throw new Error("Shopify policy request returned no shop data.");
  }

  const data = payload.data;
  return {
    privacyPolicy: usePolicyOrPage(
      data.shop.privacyPolicy,
      [data.privacyPolicyPage],
      "Privacy Policy",
    ),
    termsOfService: usePolicyOrPage(
      data.shop.termsOfService,
      [data.termsAndConditionsPage, data.termsOfServicePage],
      "Terms of Service",
    ),
    refundPolicy: usePolicyOrPage(
      data.shop.refundPolicy,
      [data.refundPolicyPage, data.returnPolicyPage],
      "Refund Policy",
    ),
    shippingPolicy: usePolicyOrPage(
      data.shop.shippingPolicy,
      [data.shippingPolicyPage],
      "Shipping Policy",
    ),
  };
}
