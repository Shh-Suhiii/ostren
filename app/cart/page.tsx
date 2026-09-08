"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartItem from "@/components/cart/CartItem";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    subtotal,
    clearCart,
    cartCount,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#fafaf8]">

        <AnnouncementBar />
        <Navbar />

        <section className="flex min-h-[65vh] items-center justify-center px-5">

          <div className="max-w-lg text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f4f9] text-[#063b63]">
              <ShoppingBag
                size={25}
                strokeWidth={1.3}
              />
            </div>

            <p className="mt-7 text-[10px] font-semibold tracking-[0.25em] text-[#0877b5] uppercase">
              Your cart
            </p>

            <h1 className="mt-4 font-serif text-4xl text-[#022a46] md:text-5xl">
              Your cart is empty.
            </h1>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-black/50">
              Discover the ostren collection and add
              something you love.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex h-13 items-center gap-3 bg-[#063b63] px-7 text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#022a46]"
            >
              Shop collection

              <ArrowRight
                size={15}
                strokeWidth={1.5}
              />
            </Link>

          </div>

        </section>

        <Footer />

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf8]">

      <AnnouncementBar />
      <Navbar />

      <section className="px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20 lg:px-12">

        <div className="mx-auto max-w-[1440px]">

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[9px] font-semibold tracking-[0.16em] text-[#063b63] uppercase transition-opacity hover:opacity-50"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
            />

            Continue shopping
          </Link>

          <div className="mt-8 flex items-end justify-between gap-5 border-b border-black/10 pb-8">

            <div>

              <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-[#0877b5] uppercase">
                ostren
              </p>

              <h1 className="font-serif text-4xl tracking-[-0.02em] text-[#022a46] md:text-6xl">
                Your cart
              </h1>

              <p className="mt-3 text-sm text-black/45">
                {cartCount}{" "}
                {cartCount === 1
                  ? "item"
                  : "items"}
              </p>

            </div>

            <button
              type="button"
              onClick={clearCart}
              className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.14em] text-black/40 uppercase transition-colors hover:text-red-500"
            >
              <Trash2
                size={14}
                strokeWidth={1.5}
              />

              Clear cart
            </button>

          </div>

          <div className="mt-3 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">

            {/* Items */}
            <div>

              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}

            </div>

            {/* Summary */}
            <aside className="h-fit bg-white p-6 md:p-8 lg:sticky lg:top-32">

              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#0877b5] uppercase">
                Order summary
              </p>

              <h2 className="mt-3 font-serif text-3xl text-[#022a46]">
                Summary
              </h2>

              <div className="mt-7 space-y-4 text-sm">

                <div className="flex justify-between text-black/55">
                  <span>Subtotal</span>

                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-black/55">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

              </div>

              <div className="my-6 h-px bg-black/10" />

              <div className="flex items-center justify-between">

                <span className="text-sm font-medium text-[#022a46]">
                  Total
                </span>

                <span className="text-xl font-medium text-[#022a46]">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <Link
                href="/checkout"
                className="mt-7 flex h-14 w-full items-center justify-center gap-3 bg-[#063b63] px-6 text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#022a46]"
              >
                Checkout

                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                />
              </Link>

              <p className="mt-4 text-center text-[9px] leading-5 text-black/35">
                Shipping and applicable charges
                will be calculated at checkout.
              </p>

            </aside>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}