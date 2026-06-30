import { createContext } from "react";
import type { ShopifyCart } from "../types";

export interface CartContextValue {
  cart: ShopifyCart | null;
  cartId: string | null;
  loading: boolean;
  error: string | null;
  processing: boolean;
  createCart: () => Promise<ShopifyCart>;
  getCart: () => Promise<ShopifyCart | null>;
  addToCart: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeCartLine: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
