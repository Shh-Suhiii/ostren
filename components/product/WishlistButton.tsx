"use client";

import {
  Heart,
} from "lucide-react";

import {
  useWishlist,
} from "@/context/WishlistContext";

interface WishlistButtonProps {
  productId: number;
  productName: string;
  productPrice: number;

  // Actual product image
  productImage: string;

  productClassName: string;
}

export default function WishlistButton({
  productId,
  productName,
  productPrice,
  productImage,
  productClassName,
}: WishlistButtonProps) {
  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const active =
    isInWishlist(
      productId
    );

  const handleWishlist =
    () => {
      toggleWishlist({
        id:
          productId,

        name:
          productName,

        price:
          productPrice,

        // Save actual image
        image:
          productImage,

        className:
          productClassName,
      });
    };

  return (
    <button
      type="button"
      aria-label={
        active
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
      aria-pressed={
        active
      }
      onClick={
        handleWishlist
      }
      className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-105 ${
        active
          ? "text-[#0877b5]"
          : "text-[#022a46]"
      }`}
    >
      <Heart
        size={15}
        strokeWidth={1.5}
        fill={
          active
            ? "currentColor"
            : "none"
        }
      />
    </button>
  );
}