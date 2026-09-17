"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

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


  const isCustomized =
    Boolean(
      item.customization
    );


  return (
    <div className="grid grid-cols-[100px_1fr] gap-5 border-b border-black/10 py-6 sm:grid-cols-[130px_1fr]">

      {/* ================================================
          PRODUCT IMAGE
      ================================================= */}

      <Link
        href={`/product/${item.id}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#eeebe5]">

          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100px, 130px"
              className="object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">

              <span className="text-[9px] font-semibold tracking-[0.16em] text-black/20 uppercase">
                Ostren Fit
              </span>

            </div>
          )}

        </div>
      </Link>


      {/* ================================================
          PRODUCT DETAILS
      ================================================= */}

      <div className="flex flex-col justify-between">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            {/* CUSTOM BADGE */}

            {isCustomized && (
              <p className="mb-2 text-[7px] font-semibold tracking-[0.18em] text-black/35 uppercase">
                Customized
              </p>
            )}


            <Link
              href={`/product/${item.id}`}
              className="text-[16px] font-medium tracking-[-0.02em] text-[#111111] transition-opacity hover:opacity-60 sm:text-[18px]"
            >
              {item.name}
            </Link>


            <p className="mt-2 text-[11px] text-black/45">
              ₹
              {item.price.toLocaleString(
                "en-IN"
              )}
            </p>


            {/* ============================================
                CUSTOMIZATION DETAILS
            ============================================= */}

            {item.customization && (
              <div className="mt-3 space-y-1.5 border-l border-black/15 pl-3">

                {item.customization.customText && (
                  <p className="text-[8px] leading-4 text-black/45">
                    <span className="font-medium text-black/65">
                      Text:
                    </span>{" "}
                    {item.customization.customText}
                  </p>
                )}


                {item.customization.uploadedImage && (
                  <p className="text-[8px] leading-4 text-black/45">
                    Custom image added
                  </p>
                )}


                {item.customization.placement && (
                  <p className="text-[8px] leading-4 text-black/45">
                    <span className="font-medium text-black/65">
                      Placement:
                    </span>{" "}
                    {item.customization.placement}
                  </p>
                )}


                {item.customization.size && (
                  <p className="text-[8px] leading-4 text-black/45">
                    <span className="font-medium text-black/65">
                      Size:
                    </span>{" "}
                    {item.customization.size}
                  </p>
                )}


                {item.customization.customizationPrice >
                  0 && (
                    <p className="text-[8px] leading-4 text-black/45">
                      Customization charge: ₹
                      {item.customization.customizationPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  )}

              </div>
            )}

          </div>


          {/* ================================================
              REMOVE
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              removeFromCart(
                item.cartKey
              )
            }
            aria-label={`Remove ${item.name}`}
            className="shrink-0 text-black/30 transition-colors hover:text-red-600"
          >
            <Trash2
              size={16}
              strokeWidth={1.4}
            />
          </button>

        </div>


        {/* ================================================
            QUANTITY + TOTAL
        ================================================= */}

        <div className="mt-5 flex items-end justify-between gap-4">

          <div className="flex h-10 items-center border border-black/10 bg-[#F8F5EF]">

            {/* DECREASE */}

            <button
              type="button"
              onClick={() =>
                decreaseQuantity(
                  item.cartKey
                )
              }
              disabled={
                item.quantity <= 1
              }
              aria-label="Decrease quantity"
              className="flex h-full w-10 items-center justify-center text-black transition-opacity hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-20"
            >
              <Minus
                size={13}
                strokeWidth={1.5}
              />
            </button>


            {/* QUANTITY */}

            <span className="flex h-full min-w-10 items-center justify-center border-x border-black/10 text-[10px] font-medium">
              {item.quantity}
            </span>


            {/* INCREASE */}

            <button
              type="button"
              onClick={() =>
                increaseQuantity(
                  item.cartKey
                )
              }
              aria-label="Increase quantity"
              className="flex h-full w-10 items-center justify-center text-black transition-opacity hover:opacity-50"
            >
              <Plus
                size={13}
                strokeWidth={1.5}
              />
            </button>

          </div>


          {/* LINE TOTAL */}

          <p className="text-[12px] font-medium text-[#111111]">
            ₹
            {(
              item.price *
              item.quantity
            ).toLocaleString(
              "en-IN"
            )}
          </p>

        </div>

      </div>

    </div>
  );
}