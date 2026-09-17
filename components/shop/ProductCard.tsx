import Link from "next/link";

import WishlistButton from "@/components/product/WishlistButton";
import type { ApiProduct } from "@/lib/products-api";

interface ProductCardProps {
  product: ApiProduct;
}

const placeholderClasses = [
  "bg-[var(--ostren-soft)]",
  "bg-[#eee9e2]",
  "bg-[#ebe7e0]",
  "bg-[#f0ece6]",
  "bg-[#e9e4dd]",
  "bg-[#efebe5]",
];

export function getProductPlaceholderClass(
  id: number
) {
  return placeholderClasses[
    (id - 1) % placeholderClasses.length
  ];
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const productClassName =
    getProductPlaceholderClass(product.id);

  const label = product.is_best_seller
    ? "Bestseller"
    : product.is_new
      ? "New"
      : null;

  const images = product.images ?? [];

  const mainImage =
    images.length > 0
      ? images[0]
      : null;

  return (
    <article className="group relative">

      <Link
        href={`/product/${product.id}`}
        className="block"
      >

        {/* PRODUCT IMAGE */}
        <div
          className={`relative aspect-[3/4] overflow-hidden ${productClassName}`}
        >

          {/* LABEL */}
          {label && (
            <div
              className={`absolute left-3 top-3 z-10 px-2.5 py-1.5 text-[8px] font-semibold tracking-[0.14em] uppercase ${product.is_best_seller
                  ? "bg-[#111111] text-white"
                  : "bg-[#F8F5EF]/95 text-[#111111] backdrop-blur-sm"
                }`}
            >
              {label}
            </div>
          )}

          {/* PRODUCT IMAGE */}
          {mainImage ? (
            <img
              src={mainImage.image_url}
              alt={
                mainImage.alt_text ||
                product.name
              }
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">

                <p className="text-[28px] font-semibold tracking-[-0.06em] text-black/10 md:text-[36px]">
                  Of.
                </p>

                <p className="mt-2 text-[7px] font-medium tracking-[0.28em] text-black/20 uppercase">
                  Ostren Fit
                </p>

              </div>
            </div>
          )}

          {/* QUICK VIEW */}
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
            <div className="bg-[#F8F5EF]/95 py-3 text-center text-[9px] font-semibold tracking-[0.15em] text-[#111111] uppercase backdrop-blur-sm transition-colors duration-300 group-hover:bg-[#111111] group-hover:text-white">
              View Product
            </div>
          </div>

        </div>

        {/* PRODUCT INFO */}
        <div className="pt-3.5 md:pt-4">

          {/* CATEGORY */}
          <p className="mb-1 text-[8px] font-medium tracking-[0.14em] text-black/40 uppercase">
            {product.category?.name || "Ostren Fit"}
          </p>

          {/* NAME */}
          <h3 className="pr-7 text-[11px] font-medium leading-5 text-[#111111] md:text-[12px]">
            {product.name}
          </h3>

          {/* PRICE */}
          <p className="mt-1 text-[11px] text-black/55 md:text-[12px]">
            ₹
            {Number(product.price).toLocaleString(
              "en-IN"
            )}
          </p>

        </div>

      </Link>

      {/* WISHLIST */}
      <div className="absolute right-2 top-2 z-20">
        <WishlistButton
          productId={product.id}
          productName={product.name}
          productPrice={Number(product.price)}
          productImage={
            mainImage?.image_url || ""
          }
          productClassName={productClassName}
        />
      </div>

    </article>
  );
}