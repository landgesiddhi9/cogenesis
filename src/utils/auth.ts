// ── Session management ────────────────────────────────────────────────────────
// Stores who is currently logged in.
// Used by: LoginPage (write), AccountPage (read/clear), Navbar (read).

export interface UserSession {
  name: string;
  email: string;
  provider?: "mock" | "shopify";
}

const SESSION_KEY = "cogenesis_session";
const SHOPIFY_ACCESS_TOKEN_KEY = "cogenesis_shopify_access_token";
const SHOPIFY_ID_TOKEN_KEY = "cogenesis_shopify_id_token";
export const SESSION_EVENT = "session-updated";

export const getSession = (): UserSession | null => {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY) || "null",
    ) as UserSession | null;
    if (session?.provider === "shopify" && !getShopifyAccessToken()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const setSession = (session: UserSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_EVENT));
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SHOPIFY_ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(SHOPIFY_ID_TOKEN_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
};

export const setShopifySessionTokens = (
  accessToken: string,
  idToken?: string,
): void => {
  sessionStorage.setItem(SHOPIFY_ACCESS_TOKEN_KEY, accessToken);
  if (idToken) sessionStorage.setItem(SHOPIFY_ID_TOKEN_KEY, idToken);
};

export const getShopifyAccessToken = (): string | null =>
  sessionStorage.getItem(SHOPIFY_ACCESS_TOKEN_KEY);

export const getShopifyIdToken = (): string | null =>
  sessionStorage.getItem(SHOPIFY_ID_TOKEN_KEY);
