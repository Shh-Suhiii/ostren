"use client";

import {
  ShoppingBag,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useCart,
} from "@/context/CartContext";

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  productPrice: number;

  // Actual product image
  productImage: string;

  productClassName: string;
  quantity: number;
}

export default function AddToCartButton({
  productId,
  productName,
  productPrice,
  productImage,
  productClassName,
  quantity,
}: AddToCartButtonProps) {
  const {
    addToCart,
  } = useCart();

  const [
    added,
    setAdded,
  ] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      {
        id: productId,

        name:
          productName,

        price:
          productPrice,

        // Save actual image
        // inside cart/localStorage.
        image:
          productImage,

        className:
          productClassName,
      },
      quantity
    );

    setAdded(true);

    window.setTimeout(
      () => {
        setAdded(false);
      },
      1400
    );
  };

  return (
    <button
      type="button"
      onClick={
        handleAddToCart
      }
      className="flex h-14 flex-1 items-center justify-center gap-3 bg-[#111111] px-6 text-[10px] font-semibold tracking-[0.18em] !text-white uppercase transition-colors hover:bg-[#2a2a2a]"
    >
      <ShoppingBag
        size={16}
        strokeWidth={1.5}
      />

      {added
        ? "Added to cart"
        : "Add to cart"}
    </button>
  );
}