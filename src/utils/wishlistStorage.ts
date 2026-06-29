const WISHLIST_STORAGE_KEY = "wishlist";

export function readWishlistIds(): string[] {
  try {
    const value = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const ids = value ? JSON.parse(value) : [];

    return Array.isArray(ids)
      ? ids.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function writeWishlistIds(ids: string[]): void {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...new Set(ids)]));
}
