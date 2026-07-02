import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import { readCartId, writeCartId, removeCartId } from "../utils/cartStorage";
import { createCart as serviceCreateCart, getCart as serviceGetCart, cartLinesAdd as serviceCartLinesAdd, cartLinesUpdate as serviceCartLinesUpdate, cartLinesRemove as serviceCartLinesRemove } from "../services/cart.service";
import type { ReactNode } from "react";
import type { ShopifyCart } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartId, setCartId] = useState<string | null>(() => readCartId());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    const storedCartId = readCartId();

    if (!storedCartId) {
      return;
    }

    let active = true;

    setTimeout(() => setError(null), 0);

    serviceGetCart(storedCartId)
      .then((result) => {
        if (!active) return;

        if (result) {
          setCart(result);
          setCartId(storedCartId);
        } else {
          removeCartId();
          setCartId(null);
          setCart(null);
        }
      })
      .catch(() => {
        if (!active) return;

        removeCartId();
        setCartId(null);
        setCart(null);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const createCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newCart = await serviceCreateCart();

      writeCartId(newCart.id);
      setCartId(newCart.id);
      setCart(newCart);

      return newCart;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create cart.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    const currentCartId = readCartId();

    if (!currentCartId) {
      setCart(null);
      setCartId(null);

      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await serviceGetCart(currentCartId);

      if (result) {
        setCart(result);
        setCartId(currentCartId);
      } else {
        removeCartId();
        setCartId(null);
        setCart(null);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch cart.";

      setError(message);

      removeCartId();
      setCartId(null);
      setCart(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (merchandiseId: string, quantity: number = 1) => {
    if (processingRef.current) return;

    processingRef.current = true;
    setProcessing(true);
    setError(null);

    try {
      let currentCartId = readCartId();

      if (!currentCartId) {
        const newCart = await serviceCreateCart();

        writeCartId(newCart.id);
        setCartId(newCart.id);
        currentCartId = newCart.id;
      }

      const updatedCart = await serviceCartLinesAdd(currentCartId!, [{ merchandiseId, quantity }]);

      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add item to cart.";

      setError(message);
      throw err;
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  }, []);

  const updateCartLine = useCallback(async (lineId: string, quantity: number) => {
    const currentCartId = readCartId();

    if (!currentCartId) return;

    setError(null);

    try {
      const updatedCart = await serviceCartLinesUpdate(currentCartId, [{ id: lineId, quantity }]);

      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update cart line.";

      setError(message);
      throw err;
    }
  }, []);

  const removeCartLine = useCallback(async (lineId: string) => {
    const currentCartId = readCartId();

    if (!currentCartId) return;

    setError(null);

    try {
      const updatedCart = await serviceCartLinesRemove(currentCartId, [lineId]);

      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove cart line.";

      setError(message);
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    removeCartId();
    setCartId(null);
    setCart(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      cart,
      cartId,
      loading,
      error,
      processing,
      createCart,
      getCart: fetchCart,
      addToCart,
      updateCartLine,
      removeCartLine,
      clearCart,
    }),
    [
      cart,
      cartId,
      loading,
      error,
      processing,
      createCart,
      fetchCart,
      addToCart,
      updateCartLine,
      removeCartLine,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};
