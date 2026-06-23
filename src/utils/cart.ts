// ── Shared cart utility ───────────────────────────────────────────────────────
// Both CartPage and NewArrivalsPage import from here so state is always in sync.
// Storage: localStorage (persists across page reloads, unlike sessionStorage).
// Custom event "cart-updated" is dispatched after every write so any listener
// (e.g. Navbar badge) can react without prop-drilling or a global store.

export interface CartItem {
  productId: string;
  title: string;
  price: string;       // raw amount string, e.g. "2999"
  image: string;
  imageAlt: string;
  size: string;
  quantity: number;
}

export const CART_KEY = "cogenesis_cart";
export const CART_EVENT = "cart-updated";

export const readCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export const writeCart = (items: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
};

export const addToCart = (
  item: Omit<CartItem, "quantity"> & { quantity?: number }
): void => {
  const cart = readCart();
  const idx = cart.findIndex(
    (i) => i.productId === item.productId && i.size === item.size
  );
  if (idx !== -1) {
    const next = [...cart];
    next[idx] = { ...next[idx], quantity: next[idx].quantity + (item.quantity ?? 1) };
    writeCart(next);
  } else {
    writeCart([...cart, { ...item, quantity: item.quantity ?? 1 }]);
  }
};

export const removeFromCart = (productId: string, size: string): void => {
  writeCart(readCart().filter((i) => !(i.productId === productId && i.size === size)));
};

export const updateCartQty = (
  productId: string,
  size: string,
  quantity: number
): void => {
  if (quantity <= 0) {
    removeFromCart(productId, size);
    return;
  }
  writeCart(
    readCart().map((i) =>
      i.productId === productId && i.size === size ? { ...i, quantity } : i
    )
  );
};

export const getCartCount = (): number =>
  readCart().reduce((sum, i) => sum + i.quantity, 0);
