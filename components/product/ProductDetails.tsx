"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

import type { ApiProduct } from "@/lib/products-api";
import {
  getProductPlaceholderClass,
} from "@/components/shop/ProductCard";

import QuantitySelector from "@/components/product/QuantitySelector";
import AddToCartButton from "@/components/product/AddToCartButton";

import { useWishlist } from "@/context/WishlistContext";

interface ProductDetailsProps {
  product: ApiProduct;
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const wishlistActive =
    isInWishlist(product.id);

  const productClassName =
    getProductPlaceholderClass(
      product.id
    );

  const images =
    product.images ?? [];

  const increaseQuantity = () => {
    setQuantity(
      (current) => current + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: Number(
        product.price
      ),
      image:
        images[0]?.image_url ||
        "",
      className:
        productClassName,
    });
  };

  const handleBuyNow = () => {
    console.log(
      `Buy now: ${quantity} × ${product.name}`
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text:
            product.description || "",
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(
        window.location.href
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

      {/* Visual */}
      <div>

        <div
          className={`relative aspect-[4/5] overflow-hidden ${productClassName}`}
        >

          {(product.is_new ||
            product.is_best_seller) && (
              <div
                className={`absolute left-4 top-4 z-10 px-3 py-1.5 text-[8px] font-semibold tracking-[0.16em] uppercase ${product.is_best_seller
                  ? "bg-[#063b63] text-white"
                  : "bg-white/85 text-[#063b63] backdrop-blur-sm"
                  }`}
              >
                {product.is_best_seller
                  ? "Bestseller"
                  : "New"}
              </div>
            )}

          {images.length > 0 ? (
            <img
              src={images[0].image_url}
              alt={
                images[0].alt_text ||
                product.name
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">

              <div className="text-center">

                <p className="font-serif text-4xl tracking-wide text-[#063b63]/20 md:text-6xl">
                  ostren
                </p>

                <p className="mt-3 text-[8px] font-semibold tracking-[0.35em] text-[#063b63]/25 uppercase">
                  Product image
                </p>

              </div>

            </div>
          )}

        </div>

        {/* Thumbnails */}
        <div className="mt-3 grid grid-cols-4 gap-3">

          {images.length > 0
            ? images
              .slice(0, 4)
              .map((image) => (
                <div
                  key={image.id}
                  className="aspect-square overflow-hidden bg-[#eef2f3]"
                >
                  <img
                    src={image.image_url}
                    alt={
                      image.alt_text ||
                      product.name
                    }
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            : [1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className={`flex aspect-square items-center justify-center ${productClassName}`}
                >
                  <span className="font-serif text-xs text-[#063b63]/20">
                    O
                  </span>
                </div>
              )
            )}

        </div>

      </div>

      {/* Product info */}
      <div className="flex flex-col justify-center">

        <div className="mb-5 flex items-center justify-between">

          <p className="text-[9px] font-semibold tracking-[0.2em] text-[#0877b5] uppercase">
            {product.category?.name ||
              "ostren"}
          </p>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share product"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#063b63]/10 text-[#063b63] transition-colors hover:bg-[#f5f7f7]"
          >
            <Share2
              size={15}
              strokeWidth={1.5}
            />
          </button>

        </div>

        <h1 className="font-serif text-4xl leading-tight tracking-[-0.02em] text-[#022a46] md:text-5xl">
          {product.name}
        </h1>

        <p className="mt-5 text-xl text-[#063b63]">
          ₹
          {Number(
            product.price
          ).toLocaleString("en-IN")}
        </p>

        {product.compare_price && (
          <p className="mt-2 text-sm text-black/35 line-through">
            ₹
            {Number(
              product.compare_price
            ).toLocaleString(
              "en-IN"
            )}
          </p>
        )}

        <div className="my-8 h-px bg-black/10" />

        <p className="text-sm leading-7 text-black/55">
          {product.description ||
            "A thoughtfully designed ostren piece made for modern everyday life."}
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleWishlist}
            aria-pressed={
              wishlistActive
            }
            className={`flex h-12 items-center gap-3 border px-5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-all ${wishlistActive
              ? "border-[#0877b5] bg-[#e9f4f9] text-[#0877b5]"
              : "border-[#063b63]/15 text-[#063b63] hover:bg-[#f5f7f7]"
              }`}
          >
            <Heart
              size={15}
              strokeWidth={1.5}
              fill={
                wishlistActive
                  ? "currentColor"
                  : "none"
              }
            />

            {wishlistActive
              ? "Saved to wishlist"
              : "Add to wishlist"}
          </button>
        </div>

        <div className="mt-8">

          <p className="mb-3 text-[9px] font-semibold tracking-[0.16em] text-black/40 uppercase">
            Quantity
          </p>

          <QuantitySelector
            quantity={quantity}
            onIncrease={
              increaseQuantity
            }
            onDecrease={
              decreaseQuantity
            }
          />

        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <AddToCartButton
            productId={
              product.id
            }
            productName={
              product.name
            }
            productPrice={
              Number(
                product.price
              )
            }
            productImage={
              images[0]?.image_url ||
              ""
            }
            productClassName={
              productClassName
            }
            quantity={
              quantity
            }
          />

          <button
            type="button"
            onClick={handleBuyNow}
            className="h-14 border border-[#063b63] px-8 text-[10px] font-semibold tracking-[0.18em] text-[#063b63] uppercase transition-colors hover:bg-[#063b63] hover:text-white"
          >
            Buy now
          </button>

        </div>

        <div className="mt-10 border-t border-black/10">

          <div className="border-b border-black/10 py-5">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#022a46] uppercase">
              Product details
            </p>

            <p className="mt-3 text-xs leading-6 text-black/50">
              SKU:{" "}
              {product.sku || "N/A"}
              <br />
              Stock: {product.stock}
            </p>
          </div>

          <div className="border-b border-black/10 py-5">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#022a46] uppercase">
              Shipping
            </p>

            <p className="mt-3 text-xs leading-6 text-black/50">
              Fast and reliable delivery.
              Shipping details will be
              confirmed during checkout.
            </p>
          </div>

          <div className="py-5">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#022a46] uppercase">
              Returns
            </p>

            <p className="mt-3 text-xs leading-6 text-black/50">
              Easy returns subject to
              ostren&apos;s return policy.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}