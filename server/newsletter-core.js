const NEWSLETTER_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHOPIFY_ADMIN_API_VERSION = "2026-10";
const SHOPIFY_REQUEST_TIMEOUT_MS = 8_000;
const SHOPIFY_TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;
const SHOPIFY_ENV_NAMES = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_CLIENT_ID",
  "SHOPIFY_CLIENT_SECRET",
];
const NEWSLETTER_ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "https://www.cogenesis.in",
  "https://cogenesis.in",
]);

const FIND_CUSTOMER_QUERY = `
  query FindNewsletterCustomer($query: String!) {
    customers(first: 2, query: $query) {
      edges {
        node {
          id
          email
          emailMarketingConsent {
            marketingState
          }
        }
      }
    }
  }
`;
const CREATE_CUSTOMER_MUTATION = `
  mutation CreateNewsletterCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
const UPDATE_EMAIL_CONSENT_MUTATION = `
  mutation UpdateNewsletterEmailConsent(
    $input: CustomerEmailMarketingConsentUpdateInput!
  ) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

let cachedShopifyToken;
let cachedShopifyTokenExpiresAt = 0;
let cachedShopifyTokenKey;
let pendingShopifyTokenRequest;

class ShopifyRequestError extends Error {
  constructor(reason) {
    super(reason);
    this.reason = reason;
  }
}

export function isNewsletterOriginAllowed(origin) {
  return (
    typeof origin === "string" && NEWSLETTER_ALLOWED_ORIGINS.has(origin)
  );
}

export function validateNewsletterPayload(body) {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof body.email !== "string" ||
    (body.company !== undefined && typeof body.company !== "string")
  ) {
    return { status: 400, code: "invalid_request" };
  }

  if (typeof body.company === "string" && body.company.trim()) {
    return { honeypot: true };
  }

  const email = body.email.trim().toLowerCase();
  if (email.length > 254 || !NEWSLETTER_EMAIL_PATTERN.test(email)) {
    return { status: 400, code: "invalid_email" };
  }

  return { email, honeypot: false };
}

function getMissingShopifyEnvironmentNames() {
  return SHOPIFY_ENV_NAMES.filter((name) => !process.env[name]?.trim());
}

function getShopifyConfig() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();

  if (
    !storeDomain ||
    !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(storeDomain) ||
    !clientId ||
    !clientSecret
  ) {
    throw new ShopifyRequestError("invalid_configuration");
  }

  return {
    storeDomain,
    clientId,
    clientSecret,
    tokenKey: `${storeDomain}\u0000${clientId}`,
    tokenEndpoint: `https://${storeDomain}/admin/oauth/access_token`,
    graphqlEndpoint: `https://${storeDomain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`,
  };
}

async function requestShopifyToken(config) {
  let response;
  try {
    response = await fetch(config.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
      signal: AbortSignal.timeout(SHOPIFY_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new ShopifyRequestError(
      error?.name === "TimeoutError" ? "token_timeout" : "token_request_failed",
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ShopifyRequestError(`token_http_${response.status}`);
  }

  if (!response.ok) {
    throw new ShopifyRequestError(
      response.status === 403
        ? "token_access_denied"
        : `token_http_${response.status}`,
    );
  }

  if (
    typeof payload?.access_token !== "string" ||
    !payload.access_token ||
    typeof payload.expires_in !== "number" ||
    !Number.isFinite(payload.expires_in) ||
    payload.expires_in <= 0
  ) {
    throw new ShopifyRequestError("token_invalid_response");
  }

  cachedShopifyToken = payload.access_token;
  cachedShopifyTokenExpiresAt = Date.now() + payload.expires_in * 1000;
  cachedShopifyTokenKey = config.tokenKey;
  return cachedShopifyToken;
}

function getShopifyToken(config) {
  if (
    cachedShopifyToken &&
    cachedShopifyTokenKey === config.tokenKey &&
    Date.now() < cachedShopifyTokenExpiresAt - SHOPIFY_TOKEN_REFRESH_MARGIN_MS
  ) {
    return Promise.resolve(cachedShopifyToken);
  }

  if (!pendingShopifyTokenRequest) {
    pendingShopifyTokenRequest = requestShopifyToken(config).finally(() => {
      pendingShopifyTokenRequest = undefined;
    });
  }
  return pendingShopifyTokenRequest;
}

async function shopifyGraphql(config, query, variables) {
  const accessToken = await getShopifyToken(config);
  let response;
  try {
    response = await fetch(config.graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(SHOPIFY_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new ShopifyRequestError(
      error?.name === "TimeoutError" ? "graphql_timeout" : "graphql_request_failed",
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ShopifyRequestError(`graphql_http_${response.status}`);
  }

  if (!response.ok) {
    throw new ShopifyRequestError(
      response.status === 403
        ? "admin_access_denied"
        : `graphql_http_${response.status}`,
    );
  }

  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    const accessDenied = payload.errors.some(
      (error) =>
        error?.extensions?.code === "ACCESS_DENIED" ||
        /access denied/i.test(String(error?.message ?? "")),
    );
    throw new ShopifyRequestError(
      accessDenied ? "graphql_access_denied" : "graphql_error",
    );
  }

  if (!payload?.data || typeof payload.data !== "object") {
    throw new ShopifyRequestError("graphql_invalid_response");
  }

  return payload.data;
}

async function findShopifyCustomer(config, email) {
  const data = await shopifyGraphql(config, FIND_CUSTOMER_QUERY, {
    query: `email:${JSON.stringify(email)}`,
  });
  const edges = data.customers?.edges;
  if (!Array.isArray(edges)) {
    throw new ShopifyRequestError("customer_lookup_invalid_response");
  }

  return (
    edges
      .map((edge) => edge?.node)
      .find(
        (customer) =>
          typeof customer?.email === "string" &&
          customer.email.toLowerCase() === email,
      ) ?? null
  );
}

function redactEmailAddresses(message) {
  return String(message).replace(/\S+@\S+\.\S+/g, "[redacted email]");
}

function logShopifyUserErrors(operation, userErrors) {
  console.error(
    "[newsletter] Shopify userErrors",
    JSON.stringify({
      operation,
      errors: userErrors.map((error) => ({
        field: redactEmailAddresses(
          Array.isArray(error?.field) ? error.field.join(".") : "",
        ),
        message: redactEmailAddresses(error?.message ?? "Unknown error"),
      })),
    }),
  );
}

function verifyMutationResult(operation, result) {
  if (!result || !Array.isArray(result.userErrors)) {
    throw new ShopifyRequestError(`${operation}_invalid_response`);
  }
  if (result.userErrors.length > 0) {
    logShopifyUserErrors(operation, result.userErrors);
    throw new ShopifyRequestError(`${operation}_user_errors`);
  }
  if (
    result.customer?.emailMarketingConsent?.marketingState !== "SUBSCRIBED"
  ) {
    throw new ShopifyRequestError(`${operation}_not_confirmed`);
  }
}

function consentInput() {
  return {
    marketingState: "SUBSCRIBED",
    marketingOptInLevel: "SINGLE_OPT_IN",
    consentUpdatedAt: new Date().toISOString(),
  };
}

async function subscribeShopifyCustomer(config, email) {
  const customer = await findShopifyCustomer(config, email);
  if (customer?.emailMarketingConsent?.marketingState === "SUBSCRIBED") {
    return;
  }

  if (customer) {
    const data = await shopifyGraphql(
      config,
      UPDATE_EMAIL_CONSENT_MUTATION,
      {
        input: {
          customerId: customer.id,
          emailMarketingConsent: consentInput(),
        },
      },
    );
    verifyMutationResult(
      "customer_consent_update",
      data.customerEmailMarketingConsentUpdate,
    );
    return;
  }

  const data = await shopifyGraphql(config, CREATE_CUSTOMER_MUTATION, {
    input: {
      email,
      emailMarketingConsent: consentInput(),
    },
  });
  verifyMutationResult("customer_create", data.customerCreate);
}

function maskEmail(email) {
  const atIndex = email.lastIndexOf("@");
  return `${email[0]}***${email.slice(atIndex)}`;
}

export async function subscribeNewsletter(email) {
  console.info("[newsletter] signup", maskEmail(email));

  const missingEnvironmentNames = getMissingShopifyEnvironmentNames();
  if (missingEnvironmentNames.length > 0) {
    console.error(
      "[newsletter] missing environment variables:",
      missingEnvironmentNames.join(", "),
    );
    throw new Error("newsletter_unavailable");
  }

  try {
    const config = getShopifyConfig();
    await subscribeShopifyCustomer(config, email);
  } catch (error) {
    const reason =
      error instanceof ShopifyRequestError
        ? error.reason
        : "unexpected_shopify_failure";
    console.error("[newsletter] subscription unavailable:", reason);
    throw new Error("newsletter_unavailable");
  }
}
