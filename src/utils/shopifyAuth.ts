import { getShopifyIdToken } from "./auth";

export interface OpenIdConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
  code_challenge_methods_supported?: string[];
}

export interface CustomerAccountApiConfiguration {
  graphql_api: string;
  mcp_api?: string;
}

export interface ShopifyCustomerProfile {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: {
    emailAddress?: string | null;
  } | null;
  email?: string | null;
  displayName?: string | null;
}

export interface ShopifyTokenResponse {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

interface PendingOAuthRequest {
  state: string;
  nonce: string;
  codeVerifier: string;
  redirectUri: string;
}

const OIDC_DISCOVERY_SUFFIX = "/.well-known/openid-configuration";
const CUSTOMER_API_DISCOVERY_SUFFIX = "/.well-known/customer-account-api";
const PENDING_OAUTH_KEY = "cogenesis_shopify_oauth_pending";
export const CUSTOMER_AUTH_REDIRECT_URI = "https://cogenesis.in/account/authorize";

let openIdDiscoveryPromise: Promise<OpenIdConfiguration> | null = null;
let customerApiDiscoveryPromise: Promise<CustomerAccountApiConfiguration> | null = null;

const getShopDomain = (): string => {
  const domain =
    import.meta.env.VITE_SHOPIFY_STORE_DOMAIN?.trim() ||
    "co-genesis.myshopify.com";
  return domain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
};

const getClientId = (): string => {
  const clientId =
    import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error(
      "Shopify Customer Accounts are not configured. Missing VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID.",
    );
  }
  return clientId;
};

export async function discoverOpenIdConfiguration(): Promise<OpenIdConfiguration> {
  if (openIdDiscoveryPromise) return openIdDiscoveryPromise;

  openIdDiscoveryPromise = fetch(
    `https://${getShopDomain()}${OIDC_DISCOVERY_SUFFIX}`,
    { headers: { Accept: "application/json" } },
  )
    .then(async (response) => {
      const text = await response.text();
      if (!response.ok || !text.trim()) {
        throw new Error(
          `Unable to discover Shopify authentication endpoints (HTTP ${response.status}).`,
        );
      }

      let configuration: OpenIdConfiguration;
      try {
        configuration = JSON.parse(text) as OpenIdConfiguration;
      } catch {
        throw new Error("Shopify returned invalid authentication discovery data.");
      }

      if (
        !configuration.authorization_endpoint ||
        !configuration.token_endpoint ||
        !configuration.end_session_endpoint ||
        !configuration.issuer ||
        !configuration.jwks_uri
      ) {
        throw new Error(
          "Shopify authentication discovery did not include all required endpoints.",
        );
      }
      return configuration;
    })
    .catch((error: unknown) => {
      openIdDiscoveryPromise = null;
      throw error;
    });

  return openIdDiscoveryPromise;
}

export async function discoverCustomerAccountApi(): Promise<CustomerAccountApiConfiguration> {
  if (customerApiDiscoveryPromise) return customerApiDiscoveryPromise;

  customerApiDiscoveryPromise = fetch(
    `https://${getShopDomain()}${CUSTOMER_API_DISCOVERY_SUFFIX}`,
    { headers: { Accept: "application/json" } },
  )
    .then(async (response) => {
      const text = await response.text();
      if (!response.ok || !text.trim()) {
        throw new Error(
          `Unable to discover the Shopify Customer Account API (HTTP ${response.status}).`,
        );
      }

      let configuration: CustomerAccountApiConfiguration;
      try {
        configuration = JSON.parse(text) as CustomerAccountApiConfiguration;
      } catch {
        throw new Error("Shopify returned invalid Customer Account API discovery data.");
      }
      if (!configuration.graphql_api) {
        throw new Error(
          "Shopify Customer Account API discovery did not include graphql_api.",
        );
      }
      return configuration;
    })
    .catch((error: unknown) => {
      customerApiDiscoveryPromise = null;
      throw error;
    });

  return customerApiDiscoveryPromise;
}

export function generateSecureRandom(length = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

export function generateCodeVerifier(): string {
  return generateSecureRandom(64).slice(0, 128);
}

const base64UrlEncode = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export async function generateCodeChallenge(
  codeVerifier: string,
): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier),
  );
  return base64UrlEncode(new Uint8Array(digest));
}

export async function startShopifyCustomerAuth(): Promise<void> {
  const configuration = await discoverOpenIdConfiguration();
  if (
    !configuration.code_challenge_methods_supported?.includes("S256")
  ) {
    throw new Error("Shopify authentication does not support PKCE S256.");
  }

  const state = generateSecureRandom();
  const nonce = generateSecureRandom();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const pending: PendingOAuthRequest = {
    state,
    nonce,
    codeVerifier,
    redirectUri: CUSTOMER_AUTH_REDIRECT_URI,
  };
  sessionStorage.setItem(PENDING_OAUTH_KEY, JSON.stringify(pending));

  const parameters = new URLSearchParams({
    client_id: getClientId(),
    response_type: "code",
    scope: "openid email customer-account-api:full",
    redirect_uri: CUSTOMER_AUTH_REDIRECT_URI,
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  window.location.assign(
    `${configuration.authorization_endpoint}?${parameters.toString()}`,
  );
}

const readPendingOAuthRequest = (): PendingOAuthRequest => {
  const raw = sessionStorage.getItem(PENDING_OAUTH_KEY);
  if (!raw) {
    throw new Error(
      "The login session has expired or was opened in a different browser tab.",
    );
  }

  try {
    return JSON.parse(raw) as PendingOAuthRequest;
  } catch {
    throw new Error("The login session contains invalid temporary data.");
  }
};

export async function exchangeAuthorizationCode(
  code: string,
  state: string,
): Promise<ShopifyTokenResponse> {
  const pending = readPendingOAuthRequest();
  if (state !== pending.state) {
    throw new Error("Login validation failed: OAuth state did not match.");
  }

  const configuration = await discoverOpenIdConfiguration();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: pending.redirectUri,
    client_id: getClientId(),
    code_verifier: pending.codeVerifier,
  });

  const response = await fetch(configuration.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const text = await response.text();

  if (!response.ok || !text.trim()) {
    let description = "";
    try {
      const payload = JSON.parse(text) as { error_description?: string; error?: string };
      description = payload.error_description || payload.error || "";
    } catch {
      // Use the HTTP status below when Shopify returned a non-JSON error.
    }
    throw new Error(
      description ||
        `Shopify could not complete login (HTTP ${response.status}). The authorization code may have expired.`,
    );
  }

  let tokens: ShopifyTokenResponse;
  try {
    tokens = JSON.parse(text) as ShopifyTokenResponse;
  } catch {
    throw new Error("Shopify returned an invalid token response.");
  }
  if (!tokens.access_token) {
    throw new Error("Shopify did not return an access token.");
  }
  return tokens;
}

export async function fetchShopifyCustomerProfile(
  accessToken: string,
): Promise<ShopifyCustomerProfile> {
  const configuration = await discoverCustomerAccountApi();
  const query = `
    query CurrentCustomer {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
      }
    }
  `;

  const response = await fetch(configuration.graphql_api, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const text = await response.text();

  if (!response.ok || !text.trim()) {
    throw new Error(
      `Unable to retrieve your Shopify customer profile (HTTP ${response.status}).`,
    );
  }

  let payload: {
    data?: { customer?: ShopifyCustomerProfile | null };
    errors?: Array<{ message: string }>;
  };
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Shopify returned an invalid customer profile response.");
  }
  if (payload.errors?.length) {
    throw new Error(
      payload.errors.map((error) => error.message).join("; "),
    );
  }
  if (!payload.data?.customer) {
    throw new Error(
      "Shopify could not verify the authenticated customer profile.",
    );
  }
  return payload.data.customer;
}

export async function handleShopifyOAuthCallback(
  search: string,
): Promise<{ profile: ShopifyCustomerProfile; tokens: ShopifyTokenResponse }> {
  const parameters = new URLSearchParams(search);
  const oauthError = parameters.get("error");
  if (oauthError) {
    const description =
      parameters.get("error_description") ||
      "Shopify authentication was cancelled or failed.";
    throw new Error(description);
  }

  const code = parameters.get("code");
  const state = parameters.get("state");
  if (!code || !state) {
    throw new Error(
      "The login callback is missing the authorization code or state.",
    );
  }

  const tokens = await exchangeAuthorizationCode(code, state);
  const profile = await fetchShopifyCustomerProfile(tokens.access_token);
  sessionStorage.removeItem(PENDING_OAUTH_KEY);
  return { profile, tokens };
}

export async function logoutFromShopify(): Promise<void> {
  const configuration = await discoverOpenIdConfiguration();
  const idToken = getShopifyIdToken();
  const parameters = new URLSearchParams({
    post_logout_redirect_uri: "https://cogenesis.in/",
  });
  if (idToken) parameters.set("id_token_hint", idToken);
  window.location.assign(
    `${configuration.end_session_endpoint}?${parameters.toString()}`,
  );
}
