export type ShopifyFetchVariables = Record<string, unknown> | undefined;

export interface ShopifyGraphQLError {
  message: string;
  extensions?: Record<string, unknown>;
}

export interface ShopifyGraphQLResponse<TData> {
  data?: TData;
  errors?: ShopifyGraphQLError[];
}

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN || !SHOPIFY_API_VERSION) {
  throw new Error(
    "Missing Shopify environment variables. Please define VITE_SHOPIFY_STORE_DOMAIN, VITE_SHOPIFY_STOREFRONT_TOKEN, and VITE_SHOPIFY_API_VERSION.",
  );
}

const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export async function shopifyFetch<TData = unknown>(
  query: string,
  variables?: ShopifyFetchVariables,
): Promise<TData> {
  const response = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await response.json()) as ShopifyGraphQLResponse<TData>;

  console.log("GRAPHQL QUERY:");
  console.log(query);
  console.log("GRAPHQL VARIABLES:");
  console.log(variables);
  console.log("GRAPHQL RESPONSE:");
  console.log(json);

  if (!response.ok) {
    const message = json.errors?.map((error) => error.message).join(", ") || response.statusText;
    throw new Error(`Shopify request failed: ${message}`);
  }

  if (json.errors && json.errors.length > 0) {
    throw new Error(`Shopify GraphQL errors: ${json.errors.map((error) => error.message).join("; ")}`);
  }

  if (json.data === undefined) {
    throw new Error("Shopify returned no data.");
  }

  return json.data;
}
