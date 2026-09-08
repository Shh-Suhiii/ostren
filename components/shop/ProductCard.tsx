import Link from "next/link";

import WishlistButton from "@/components/product/WishlistButton";
import type { ApiProduct } from "@/lib/products-api";

interface ProductCardProps {
  product: ApiProduct;
}

const placeholderClasses = [
  "bg-[#e7f1f5]",
  "bg-[#eef0ec]",
  "bg-[#e4edf1]",
  "bg-[#e9e9e7]",
  "bg-[#e8f0f3]",
  "bg-[#e9ece8]",
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

  // Prevent crash if images are missing
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

        <div
          className={`relative aspect-[4/5] overflow-hidden ${productClassName}`}
        >

          {label && (
            <div
              className={`absolute left-3 top-3 z-10 px-2.5 py-1 text-[8px] font-semibold tracking-[0.14em] uppercase ${
                product.is_best_seller
                  ? "bg-[#063b63] text-white"
                  : "bg-white/85 text-[#063b63] backdrop-blur-sm"
              }`}
            >
              {label}
            </div>
          )}

          {mainImage ? (
            <img
              src={mainImage.image_url}
              alt={
                mainImage.alt_text ||
                product.name
              }
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">

              <div className="text-center">

                <span className="font-serif text-3xl tracking-wide text-[#063b63]/15 md:text-4xl">
                  ostren
                </span>

                <p className="mt-2 text-[7px] font-semibold tracking-[0.3em] text-[#063b63]/20 uppercase">
                  Product image
                </p>

              </div>

            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center pb-4 transition-transform duration-500 group-hover:translate-y-0">
            <span className="bg-[#063b63] px-5 py-3 text-[9px] font-semibold tracking-[0.16em] text-white uppercase">
              View product
            </span>
          </div>

        </div>

        <div className="pt-4">

          <p className="mb-1 text-[8px] font-semibold tracking-[0.14em] text-[#0877b5] uppercase">
            {product.category?.name || "ostren"}
          </p>

          <h3 className="text-[12px] font-medium tracking-[0.02em] text-[#15191d] md:text-sm">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-black/55">
            ₹
            {Number(product.price).toLocaleString(
              "en-IN"
            )}
          </p>

        </div>

      </Link>

      <WishlistButton
        productId={product.id}
        productName={product.name}
        productPrice={Number(product.price)}
        productClassName={productClassName}
      />

    </article>
  );
}