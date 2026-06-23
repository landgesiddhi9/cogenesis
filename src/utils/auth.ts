// ── Session management ────────────────────────────────────────────────────────
// Stores who is currently logged in.
// Used by: LoginPage (write), AccountPage (read/clear), Navbar (read).

export interface UserSession {
  name: string;
  email: string;
}

const SESSION_KEY = "cogenesis_session";
export const SESSION_EVENT = "session-updated";

export const getSession = (): UserSession | null => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
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
  window.dispatchEvent(new Event(SESSION_EVENT));
};
