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

  // Actual product image
  image: string;

  // Keep optional for old wishlist data
  className?: string;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];

  toggleWishlist: (
    item: WishlistItem
  ) => void;

  removeFromWishlist: (
    id: number
  ) => void;

  clearWishlist: () => void;

  isInWishlist: (
    id: number
  ) => boolean;

  wishlistCount: number;

  wishlistReady: boolean;
};

const WishlistContext =
  createContext<
    WishlistContextType | undefined
  >(undefined);

const WISHLIST_STORAGE_KEY =
  "ostren-wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    wishlistItems,
    setWishlistItems,
  ] = useState<
    WishlistItem[]
  >([]);

  const [
    wishlistReady,
    setWishlistReady,
  ] = useState(false);

  const initializedRef =
    useRef(false);

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    if (
      initializedRef.current
    ) {
      return;
    }

    initializedRef.current =
      true;

    let storedItems:
      WishlistItem[] = [];

    try {
      const stored =
        window.localStorage.getItem(
          WISHLIST_STORAGE_KEY
        );

      if (stored) {
        const parsed =
          JSON.parse(
            stored
          );

        if (
          Array.isArray(
            parsed
          )
        ) {
          storedItems =
            parsed.map(
              (
                item:
                  Partial<WishlistItem>
              ) => ({
                id:
                  Number(
                    item.id
                  ),

                name:
                  String(
                    item.name ??
                      ""
                  ),

                price:
                  Number(
                    item.price ??
                      0
                  ),

                // Old wishlist items won't
                // have this field.
                image:
                  String(
                    item.image ??
                      ""
                  ),

                className:
                  item.className,
              })
            );
        }
      }
    } catch {
      storedItems =
        [];
    }

    queueMicrotask(
      () => {
        setWishlistItems(
          storedItems
        );

        setWishlistReady(
          true
        );
      }
    );
  }, []);

  // =====================================================
  // SAVE WISHLIST
  // =====================================================

  useEffect(() => {
    if (
      !wishlistReady
    ) {
      return;
    }

    window.localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(
        wishlistItems
      )
    );
  }, [
    wishlistItems,
    wishlistReady,
  ]);

  // =====================================================
  // TOGGLE WISHLIST
  // =====================================================

  const toggleWishlist = (
    item:
      WishlistItem
  ) => {
    setWishlistItems(
      (
        currentItems
      ) => {
        const exists =
          currentItems.some(
            (
              wishlistItem
            ) =>
              wishlistItem.id ===
              item.id
          );

        if (exists) {
          return currentItems.filter(
            (
              wishlistItem
            ) =>
              wishlistItem.id !==
              item.id
          );
        }

        return [
          ...currentItems,
          {
            ...item,
            image:
              item.image ||
              "",
          },
        ];
      }
    );
  };

  // =====================================================
  // REMOVE
  // =====================================================

  const removeFromWishlist =
    (
      id: number
    ) => {
      setWishlistItems(
        (
          currentItems
        ) =>
          currentItems.filter(
            (
              item
            ) =>
              item.id !==
              id
          )
      );
    };

  // =====================================================
  // CLEAR
  // =====================================================

  const clearWishlist =
    () => {
      setWishlistItems(
        []
      );
    };

  // =====================================================
  // CHECK
  // =====================================================

  const isInWishlist =
    (
      id: number
    ) => {
      return wishlistItems.some(
        (
          item
        ) =>
          item.id ===
          id
      );
    };

  // =====================================================
  // COUNT
  // =====================================================

  const wishlistCount =
    useMemo(
      () =>
        wishlistItems.length,
      [
        wishlistItems,
      ]
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
  const context =
    useContext(
      WishlistContext
    );

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}