export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
}

export class ShopifyConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyConfigError";
  }
}

function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (!value?.trim()) {
    throw new ShopifyConfigError(
      `Missing required environment variable: ${name}. Copy .env.example to .env and set your Shopify credentials.`,
    );
  }

  return value.trim();
}

export function getShopifyConfig(): ShopifyConfig {
  return {
    storeDomain: requireEnv("VITE_SHOPIFY_STORE_DOMAIN"),
    storefrontAccessToken: requireEnv("VITE_SHOPIFY_STOREFRONT_TOKEN"),
    apiVersion: requireEnv("VITE_SHOPIFY_API_VERSION"),
  };
}

export function getStorefrontApiUrl(config: ShopifyConfig = getShopifyConfig()): string {
  return `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`;
}
