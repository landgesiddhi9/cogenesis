const CART_STORAGE_KEY = "shopifyCartId";

export function readCartId(): string | null {
  try {
    return localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeCartId(id: string): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, id);
  } catch {
    /* storage unavailable */
  }
}

export function removeCartId(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}
