"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";


/* =====================================================
   CUSTOMIZATION TYPES
===================================================== */

export type CartCustomization = {
  type:
  | "tshirt"
  | "hoodie"
  | "mug"
  | "bottle"
  | "frame";

  customText?: string;

  uploadedImage?: string;

  placement?: string;

  size?: string;

  customizationPrice: number;
};


/* =====================================================
   CART ITEM
===================================================== */

export type CartItemType = {
  id: number;

  /*
   Normal product:
   product-12

   Customized product:
   custom-12-1723456789-abc123
  */
  cartKey: string;

  name: string;
  price: number;
  quantity: number;
  image: string;

  className?: string;

  customization?:
  CartCustomization;
};


type AddToCartItem =
  Omit<
    CartItemType,
    "quantity" | "cartKey"
  > & {
    cartKey?: string;
  };


type CartContextType = {
  cartItems:
  CartItemType[];

  addToCart: (
    item:
      AddToCartItem,
    quantity?: number
  ) => void;

  removeFromCart: (
    cartKey: string
  ) => void;

  increaseQuantity: (
    cartKey: string
  ) => void;

  decreaseQuantity: (
    cartKey: string
  ) => void;

  clearCart:
  () => void;

  cartCount:
  number;

  subtotal:
  number;
};


const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined);


const CART_STORAGE_KEY =
  "ostren-cart";

const CART_EVENT =
  "ostren-cart-update";


/* =====================================================
   CACHE
===================================================== */

let cachedRaw:
  string | null = null;

let cachedCart:
  CartItemType[] = [];


/* =====================================================
   CREATE CUSTOM CART KEY
===================================================== */

function createCustomCartKey(
  productId: number
) {
  return [
    "custom",
    productId,
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 9),
  ].join("-");
}


/* =====================================================
   READ CART
===================================================== */

function readCart():
  CartItemType[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        CART_STORAGE_KEY
      );

    if (
      raw === cachedRaw
    ) {
      return cachedCart;
    }

    cachedRaw =
      raw;

    if (!raw) {
      cachedCart =
        [];

      return cachedCart;
    }

    const parsed =
      JSON.parse(
        raw
      );

    if (
      !Array.isArray(
        parsed
      )
    ) {
      cachedCart =
        [];

      return cachedCart;
    }

    cachedCart =
      parsed.map(
        (
          item:
            Partial<CartItemType>
        ) => {
          const id =
            Number(
              item.id
            );

          /*
           Backwards compatibility:
           old cart items don't have cartKey.
          */
          const cartKey =
            item.cartKey
              ? String(
                item.cartKey
              )
              : `product-${id}`;

          const customization =
            item.customization &&
              typeof item.customization ===
              "object"
              ? item.customization
              : undefined;

          return {
            id,

            cartKey,

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

            quantity:
              Math.max(
                1,
                Number(
                  item.quantity ??
                  1
                )
              ),

            image:
              String(
                item.image ??
                ""
              ),

            className:
              item.className,

            customization,
          };
        }
      );

    return cachedCart;
  } catch {
    cachedRaw =
      null;

    cachedCart =
      [];

    return cachedCart;
  }
}


/* =====================================================
   SERVER SNAPSHOT
===================================================== */

const serverCart:
  CartItemType[] = [];


function getServerSnapshot():
  CartItemType[] {
  return serverCart;
}


/* =====================================================
   CLIENT SNAPSHOT
===================================================== */

function getCartSnapshot():
  CartItemType[] {
  return readCart();
}


/* =====================================================
   SUBSCRIBE
===================================================== */

function subscribeCart(
  callback: () => void
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return () => { };
  }

  const handleCustomEvent =
    () => {
      callback();
    };

  const handleStorage =
    (
      event:
        StorageEvent
    ) => {
      if (
        event.key ===
        CART_STORAGE_KEY ||
        event.key === null
      ) {
        callback();
      }
    };

  window.addEventListener(
    CART_EVENT,
    handleCustomEvent
  );

  window.addEventListener(
    "storage",
    handleStorage
  );

  return () => {
    window.removeEventListener(
      CART_EVENT,
      handleCustomEvent
    );

    window.removeEventListener(
      "storage",
      handleStorage
    );
  };
}


/* =====================================================
   WRITE CART
===================================================== */

function writeCart(
  cart:
    CartItemType[]
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  const raw =
    JSON.stringify(
      cart
    );

  cachedRaw =
    raw;

  cachedCart =
    cart;

  window.localStorage.setItem(
    CART_STORAGE_KEY,
    raw
  );

  window.dispatchEvent(
    new Event(
      CART_EVENT
    )
  );
}


/* =====================================================
   PROVIDER
===================================================== */

export function CartProvider({
  children,
}: {
  children:
  React.ReactNode;
}) {
  const cartItems =
    useSyncExternalStore(
      subscribeCart,
      getCartSnapshot,
      getServerSnapshot
    );


  /* ===================================================
     ADD TO CART
  =================================================== */

  const addToCart = (
    item:
      AddToCartItem,
    quantity = 1
  ) => {
    const currentItems =
      readCart();

    const safeQuantity =
      Math.max(
        1,
        Number(
          quantity
        ) || 1
      );


    /*
     Customized products always receive a unique key.

     Normal products use product-{id}, so existing
     add-to-cart behaviour remains unchanged.
    */

    const isCustomized =
      Boolean(
        item.customization
      );

    const cartKey =
      item.cartKey ||
      (
        isCustomized
          ? createCustomCartKey(
            item.id
          )
          : `product-${item.id}`
      );


    /*
     Customized products must NOT merge.

     Two designs of the same base product
     are separate cart items.
    */

    if (
      isCustomized
    ) {
      writeCart([
        ...currentItems,

        {
          ...item,

          cartKey,

          image:
            item.image ||
            "",

          quantity:
            safeQuantity,
        },
      ]);

      return;
    }


    /*
     Normal products continue to merge.
    */

    const existingItem =
      currentItems.find(
        (
          cartItem
        ) =>
          cartItem.cartKey ===
          cartKey
      );


    if (
      existingItem
    ) {
      const updatedItems =
        currentItems.map(
          (
            cartItem
          ) =>
            cartItem.cartKey ===
              cartKey
              ? {
                ...cartItem,

                name:
                  item.name,

                price:
                  item.price,

                image:
                  item.image ||
                  cartItem.image,

                className:
                  item.className ||
                  cartItem.className,

                quantity:
                  cartItem.quantity +
                  safeQuantity,
              }
              : cartItem
        );

      writeCart(
        updatedItems
      );

      return;
    }


    writeCart([
      ...currentItems,

      {
        ...item,

        cartKey,

        image:
          item.image ||
          "",

        quantity:
          safeQuantity,
      },
    ]);
  };


  /* ===================================================
     REMOVE
  =================================================== */

  const removeFromCart =
    (
      cartKey: string
    ) => {
      const updatedItems =
        readCart().filter(
          (
            item
          ) =>
            item.cartKey !==
            cartKey
        );

      writeCart(
        updatedItems
      );
    };


  /* ===================================================
     INCREASE
  =================================================== */

  const increaseQuantity =
    (
      cartKey: string
    ) => {
      const updatedItems =
        readCart().map(
          (
            item
          ) =>
            item.cartKey ===
              cartKey
              ? {
                ...item,

                quantity:
                  item.quantity +
                  1,
              }
              : item
        );

      writeCart(
        updatedItems
      );
    };


  /* ===================================================
     DECREASE
  =================================================== */

  const decreaseQuantity =
    (
      cartKey: string
    ) => {
      const updatedItems =
        readCart().map(
          (
            item
          ) =>
            item.cartKey ===
              cartKey
              ? {
                ...item,

                quantity:
                  Math.max(
                    1,
                    item.quantity -
                    1
                  ),
              }
              : item
        );

      writeCart(
        updatedItems
      );
    };


  /* ===================================================
     CLEAR
  =================================================== */

  const clearCart =
    () => {
      writeCart(
        []
      );
    };


  /* ===================================================
     COUNT
  =================================================== */

  const cartCount =
    useMemo(
      () =>
        cartItems.reduce(
          (
            total,
            item
          ) =>
            total +
            item.quantity,
          0
        ),
      [
        cartItems,
      ]
    );


  /* ===================================================
     SUBTOTAL
  =================================================== */

  const subtotal =
    useMemo(
      () =>
        cartItems.reduce(
          (
            total,
            item
          ) =>
            total +
            item.price *
            item.quantity,
          0
        ),
      [
        cartItems,
      ]
    );


  return (
    <CartContext.Provider
      value={{
        cartItems,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        cartCount,

        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


/* =====================================================
   HOOK
===================================================== */

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}