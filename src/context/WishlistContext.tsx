import { createContext, useCallback, useMemo, useState } from "react";
import { readWishlistIds, writeWishlistIds } from "../utils/wishlistStorage";

export interface WishlistContextValue {
  wishlistIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(readWishlistIds);

  const updateWishlist = useCallback((updater: (ids: string[]) => string[]) => {
    setWishlistIds((currentIds) => {
      const nextIds = [...new Set(updater(currentIds))];
      writeWishlistIds(nextIds);
      return nextIds;
    });
  }, []);

  const addToWishlist = useCallback(
    (productId: string) => {
      updateWishlist((ids) => (ids.includes(productId) ? ids : [...ids, productId]));
      window.dispatchEvent(
        new CustomEvent("wishlist-toast", {
          detail: { message: "Product added to wishlist", type: "success" },
        }),
      );
    },
    [updateWishlist],
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      updateWishlist((ids) => ids.filter((id) => id !== productId));
      window.dispatchEvent(
        new CustomEvent("wishlist-toast", {
          detail: { message: "Product removed from wishlist", type: "success" },
        }),
      );
    },
    [updateWishlist],
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      const wasWishlisted = wishlistIds.includes(productId);
      updateWishlist((ids) =>
        wasWishlisted
          ? ids.filter((id) => id !== productId)
          : [...ids, productId],
      );
      window.dispatchEvent(
        new CustomEvent("wishlist-toast", {
          detail: {
            message: wasWishlisted ? "Product removed from wishlist" : "Product added to wishlist",
            type: "success",
          },
        }),
      );
    },
    [updateWishlist, wishlistIds],
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds],
  );

  const value = useMemo(
    () => ({
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      wishlistCount: wishlistIds.length,
    }),
    [
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
};
