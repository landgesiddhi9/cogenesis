import {
  getShopifyConfig,
  getStorefrontApiUrl,
  ShopifyConfigError,
} from "../lib/shopify";

export class ShopifyNetworkError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "ShopifyNetworkError";
    this.cause = cause;
  }
}

export class ShopifyGraphqlError extends Error {
  readonly errors: ShopifyGraphqlErrorDetail[];

  constructor(message: string, errors: ShopifyGraphqlErrorDetail[]) {
    super(message);
    this.name = "ShopifyGraphqlError";
    this.errors = errors;
  }
}

export interface ShopifyGraphqlErrorDetail {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

interface ShopifyGraphqlResponse<TData> {
  data?: TData;
  errors?: ShopifyGraphqlErrorDetail[];
}

export interface ShopifyRequestOptions {
  signal?: AbortSignal;
}

export async function shopifyRequest<TData, TVariables = Record<string, never>>(
  query: string,
  variables?: TVariables,
  options: ShopifyRequestOptions = {},
): Promise<TData> {
  let config;

  try {
    config = getShopifyConfig();
  } catch (error) {
    if (error instanceof ShopifyConfigError) {
      throw error;
    }

    throw new ShopifyConfigError("Unable to read Shopify configuration.");
  }

  const endpoint = getStorefrontApiUrl(config);

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: variables ?? {},
      }),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ShopifyNetworkError(
      "Network request to Shopify Storefront API failed.",
      error,
    );
  }

  if (!response.ok) {
    throw new ShopifyNetworkError(
      `Shopify Storefront API responded with HTTP ${response.status} ${response.statusText}.`,
    );
  }

  let payload: ShopifyGraphqlResponse<TData>;

  try {
    payload = (await response.json()) as ShopifyGraphqlResponse<TData>;
  } catch (error) {
    throw new ShopifyNetworkError(
      "Shopify Storefront API returned an invalid JSON response.",
      error,
    );
  }

  if (payload.errors?.length) {
    const message = payload.errors.map((entry) => entry.message).join("; ");

    throw new ShopifyGraphqlError(
      message || "Shopify Storefront API returned GraphQL errors.",
      payload.errors,
    );
  }

  if (payload.data === undefined) {
    throw new ShopifyGraphqlError("Shopify Storefront API returned no data.", []);
  }

  return payload.data;
}
