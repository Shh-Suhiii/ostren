"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type WishlistItem = {
  id: number;
  name: string;
  price: number;
  className: string;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
  wishlistCount: number;
  wishlistReady: boolean;
};

const WishlistContext =
  createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishlistItems, setWishlistItems] =
    useState<WishlistItem[]>([]);

  const [wishlistReady, setWishlistReady] =
    useState(false);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    let storedItems: WishlistItem[] = [];

    try {
      const stored =
        window.localStorage.getItem("ostren-wishlist");

      if (stored) {
        storedItems = JSON.parse(stored);
      }
    } catch {
      storedItems = [];
    }

    queueMicrotask(() => {
      setWishlistItems(storedItems);
      setWishlistReady(true);
    });
  }, []);

  useEffect(() => {
    if (!wishlistReady) return;

    window.localStorage.setItem(
      "ostren-wishlist",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems, wishlistReady]);

  const toggleWishlist = (item: WishlistItem) => {
    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (wishlistItem) =>
          wishlistItem.id === item.id
      );

      if (exists) {
        return currentItems.filter(
          (wishlistItem) =>
            wishlistItem.id !== item.id
        );
      }

      return [...currentItems, item];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const isInWishlist = (id: number) => {
    return wishlistItems.some(
      (item) => item.id === id
    );
  };

  const wishlistCount = useMemo(
    () => wishlistItems.length,
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        wishlistCount,
        wishlistReady,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}