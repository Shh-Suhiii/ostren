"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Trash2,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  useWishlist,
} from "@/context/WishlistContext";

export default function WishlistPage() {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
    wishlistCount,
    wishlistReady,
  } = useWishlist();

  // Prevent showing empty wishlist
  // before localStorage has loaded.
  if (!wishlistReady) {
    return (
      <main className="min-h-screen bg-[#fafaf8]">
        <AnnouncementBar />
        <Navbar />

        <section className="min-h-[65vh]" />

        <Footer />
      </main>
    );
  }

  // =====================================================
  // EMPTY WISHLIST
  // =====================================================

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#fafaf8]">
        <AnnouncementBar />
        <Navbar />

        <section className="flex min-h-[65vh] items-center justify-center px-5">
          <div className="max-w-lg text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f4f9] text-[#063b63]">
              <Heart
                size={26}
                strokeWidth={1.4}
              />
            </div>

            <p className="mt-7 text-[10px] font-semibold tracking-[0.25em] text-[#0877b5] uppercase">
              Wishlist
            </p>

            <h1 className="mt-4 font-serif text-4xl text-[#022a46] md:text-5xl">
              Nothing saved yet.
            </h1>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-black/50">
              Save the Ostren Fit pieces you love and
              come back to them anytime.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex h-13 items-center gap-3 bg-[#111111] px-7 text-[10px] font-semibold tracking-[0.18em] !text-white uppercase transition-colors hover:bg-[#2a2a2a]"
            >
              Explore collection

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

  // =====================================================
  // WISHLIST
  // =====================================================

  return (
    <main className="min-h-screen bg-[#fafaf8]">

      <AnnouncementBar />
      <Navbar />

      <section className="px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20 lg:px-12">

        <div className="mx-auto max-w-[1440px]">

          {/* Header */}
          <div className="flex items-end justify-between gap-6 border-b border-black/10 pb-8">

            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-[#0877b5] uppercase">
                Saved pieces
              </p>

              <h1 className="mt-3 font-serif text-4xl tracking-[-0.02em] text-[#022a46] md:text-6xl">
                Wishlist
              </h1>

              <p className="mt-3 text-sm text-black/45">
                {wishlistCount}{" "}
                {wishlistCount === 1
                  ? "item"
                  : "items"}
              </p>
            </div>

            <button
              type="button"
              onClick={clearWishlist}
              className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.14em] text-black/40 uppercase transition-colors hover:text-red-500"
            >
              <Trash2
                size={14}
                strokeWidth={1.5}
              />

              Clear wishlist
            </button>

          </div>

          {/* Products */}
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-12 sm:grid-cols-2 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">

            {wishlistItems.map(
              (item) => (
                <article
                  key={item.id}
                  className="group relative"
                >

                  <Link
                    href={`/product/${item.id}`}
                    className="block"
                  >

                    {/* Product image */}
                    <div
                      className={`relative aspect-[4/5] overflow-hidden bg-[#eeebe5] ${
                        !item.image
                          ? item.className || ""
                          : ""
                      }`}
                    >

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">

                          <div className="text-center">
                            <p className="font-serif text-4xl text-[#063b63]/20">
                              ostren
                            </p>

                            <p className="mt-2 text-[7px] font-semibold tracking-[0.25em] text-black/20 uppercase">
                              Product image
                            </p>
                          </div>

                        </div>
                      )}

                      {/* Hover */}
                      <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center pb-4 transition-transform duration-500 group-hover:translate-y-0">

                        <span className="bg-[#111111] px-5 py-3 text-[9px] font-semibold tracking-[0.16em] !text-white uppercase">
                          View product
                        </span>

                      </div>

                    </div>

                    {/* Product info */}
                    <div className="pt-4">

                      <h2 className="text-[12px] font-medium tracking-[0.02em] text-[#15191d] md:text-sm">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-xs text-black/55">
                        ₹
                        {item.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </Link>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist(
                        item.id
                      )
                    }
                    aria-label={`Remove ${item.name}`}
                    className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0877b5] shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
                  >
                    <Heart
                      size={15}
                      strokeWidth={1.5}
                      fill="currentColor"
                    />
                  </button>

                </article>
              )
            )}

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}