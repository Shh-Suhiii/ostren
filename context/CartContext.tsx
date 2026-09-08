"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItemType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  className: string;
};

type CartContextType = {
  cartItems: CartItemType[];
  addToCart: (
    item: Omit<CartItemType, "quantity">,
    quantity?: number
  ) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
};

const CartContext =
  createContext<CartContextType | undefined>(undefined);

function getInitialCart(): CartItemType[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = localStorage.getItem("ostren-cart");

    if (!storedCart) {
      return [];
    }

    return JSON.parse(storedCart);
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] =
    useState<CartItemType[]>(getInitialCart);

  /*
   * Save cart whenever it changes.
   */
  useEffect(() => {
    localStorage.setItem(
      "ostren-cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  /*
   * Add item
   */
  const addToCart = (
    item: Omit<CartItemType, "quantity">,
    quantity = 1
  ) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity + quantity,
              }
            : cartItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity,
        },
      ];
    });
  };

  /*
   * Remove item
   */
  const removeFromCart = (id: number) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );
  };

  /*
   * Increase quantity
   */
  const increaseQuantity = (id: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  /*
   * Decrease quantity
   */
  const decreaseQuantity = (id: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity - 1
              ),
            }
          : item
      )
    );
  };

  /*
   * Clear cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /*
   * Total number of items
   */
  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cartItems]);

  /*
   * Cart subtotal
   */
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [cartItems]);

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

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}