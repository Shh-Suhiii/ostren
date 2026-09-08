import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import WishlistButton from "@/components/product/WishlistButton";

const products = [
  {
    id: 5,
    name: "Signature Relaxed Shirt",
    price: 1999,
    image: "/products/best-1.jpg",
    className: "bg-[#f2f2f0]",
  },
  {
    id: 6,
    name: "Classic Straight Fit Trousers",
    price: 2299,
    image: "/products/best-2.jpg",
    className: "bg-[#eeeeec]",
  },
  {
    id: 7,
    name: "Everyday Oversized Tee",
    price: 1799,
    image: "/products/best-3.jpg",
    className: "bg-[#f1f1ef]",
  },
  {
    id: 8,
    name: "Essential Co-ord Set",
    price: 2499,
    image: "/products/best-4.jpg",
    className: "bg-[#ededeb]",
  },
];

export default function BestSellers() {
  return (
    <section className="bg-[#f7f7f5] py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-8 flex items-end justify-between md:mb-10">
          <div>
            <p className="mb-3 text-[9px] font-medium tracking-[0.22em] text-black/45 uppercase">
              Most Wanted
            </p>

            <h2 className="text-[28px] font-medium tracking-[-0.03em] text-[#111111] md:text-[38px]">
              Best Sellers
            </h2>
          </div>

          <Link
            href="/shop?sort=best-selling"
            className="group hidden items-center gap-2 border-b border-black pb-1 text-[10px] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-50 sm:flex"
          >
            View All

            <ArrowRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-8 md:gap-x-4 md:gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative"
            >
              <Link
                href={`/product/${product.id}`}
                className="block"
              >
                {/* IMAGE */}
                <div
                  className={`relative aspect-[3/4] overflow-hidden ${product.className}`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />

                  {/* BADGE */}
                  <div className="absolute left-3 top-3 z-10 bg-black px-2.5 py-1.5 text-[8px] font-medium tracking-[0.14em] text-white uppercase">
                    Bestseller
                  </div>

                  {/* QUICK VIEW */}
                  <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
                    <div className="bg-white py-3 text-center text-[9px] font-medium tracking-[0.15em] text-black uppercase">
                      Quick View
                    </div>
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="pt-3.5 md:pt-4">
                  <h3 className="pr-6 text-[11px] font-medium leading-5 text-[#111111] md:text-[12px]">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-[11px] text-black/60 md:text-[12px]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>

              {/* WISHLIST */}
              <div className="absolute right-2 top-2 z-20">
                <WishlistButton
                  productId={product.id}
                  productName={product.name}
                  productPrice={product.price}
                  productClassName={product.className}
                />
              </div>
            </article>
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <Link
          href="/shop?sort=best-selling"
          className="mt-9 flex items-center justify-center gap-2 border border-black/20 py-3.5 text-[9px] font-medium tracking-[0.15em] uppercase sm:hidden"
        >
          View All

          <ArrowRight
            size={13}
            strokeWidth={1.5}
          />
        </Link>

      </div>
    </section>
  );
}