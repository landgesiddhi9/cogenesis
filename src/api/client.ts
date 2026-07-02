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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry policy:
 * - Retries on HTTP 429 (rate limited) and network/transport errors (fetch
 *   throws, timeout).
 * - Does NOT retry on other 4xx errors (400, 401, 403, 404 etc.), GraphQL
 *   errors, or JSON parse failures — those won't succeed on retry.
 * - Max 2 retries with exponential backoff: 500ms, then 1500ms.
 * - Respects the Retry-After header if Shopify's 429 response includes one.
 * - After retries are exhausted, the last error is thrown as-is.
 */

const getRetryDelay = (attempt: number, response?: Response): number => {
  if (response) {
    const retryAfter = response.headers.get("Retry-After");
    if (retryAfter) return parseInt(retryAfter, 10) * 1000;
  }
  // 500 * 3^attempt => attempt 0: 500ms, attempt 1: 1500ms
  return 500 * Math.pow(3, attempt);
};

export async function shopifyRequest<TData, TVariables = Record<string, never>>(
  query: string,
  variables?: TVariables,
  options: ShopifyRequestOptions = {},
): Promise<TData> {
  let config;

  try {
    config = getShopifyConfig();
  } catch (error) {
    if (error instanceof ShopifyConfigError) throw error;
    throw new ShopifyConfigError("Unable to read Shopify configuration.");
  }

  const endpoint = getStorefrontApiUrl(config);
  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables: variables ?? {} }),
        signal: options.signal,
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < MAX_RETRIES) {
          await sleep(getRetryDelay(attempt, response));
          continue;
        }
        throw new ShopifyNetworkError(
          `Shopify Storefront API responded with HTTP ${response.status} ${response.statusText}.`,
        );
      }

      const payload = (await response.json()) as ShopifyGraphqlResponse<TData>;

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
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;

      if (error instanceof TypeError && attempt < MAX_RETRIES) {
        await sleep(getRetryDelay(attempt));
        continue;
      }

      throw error;
    }
  }

  throw new Error("Unreachable: retry loop exited without returning or throwing.");
}
