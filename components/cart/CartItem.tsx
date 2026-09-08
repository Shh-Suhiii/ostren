"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import {
  CartItemType,
  useCart,
} from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({
  item,
}: CartItemProps) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="grid grid-cols-[100px_1fr] gap-5 border-b border-black/10 py-6 sm:grid-cols-[130px_1fr]">

      <Link href={`/product/${item.id}`}>
        <div
          className={`aspect-[4/5] ${item.className} flex items-center justify-center`}
        >
          <span className="font-serif text-2xl text-[#063b63]/20">
            O
          </span>
        </div>
      </Link>

      <div className="flex flex-col justify-between">

        <div className="flex items-start justify-between gap-4">

          <div>
            <Link
              href={`/product/${item.id}`}
              className="font-serif text-xl text-[#022a46] transition-opacity hover:opacity-60"
            >
              {item.name}
            </Link>

            <p className="mt-2 text-sm text-black/50">
              ₹{item.price.toLocaleString("en-IN")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.name}`}
            className="text-black/35 transition-colors hover:text-red-500"
          >
            <Trash2
              size={17}
              strokeWidth={1.5}
            />
          </button>

        </div>

        <div className="mt-5 flex items-end justify-between gap-4">

          <div className="flex h-10 items-center border border-black/10 bg-white">

            <button
              type="button"
              onClick={() =>
                decreaseQuantity(item.id)
              }
              disabled={item.quantity <= 1}
              className="flex h-full w-10 items-center justify-center text-[#063b63] disabled:opacity-25"
            >
              <Minus
                size={13}
                strokeWidth={1.5}
              />
            </button>

            <span className="flex h-full min-w-10 items-center justify-center border-x border-black/10 text-xs">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                increaseQuantity(item.id)
              }
              className="flex h-full w-10 items-center justify-center text-[#063b63]"
            >
              <Plus
                size={13}
                strokeWidth={1.5}
              />
            </button>

          </div>

          <p className="text-sm font-medium text-[#022a46]">
            ₹
            {(
              item.price * item.quantity
            ).toLocaleString("en-IN")}
          </p>

        </div>

      </div>

    </div>
  );
}