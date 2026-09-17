import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import WishlistButton from "@/components/product/WishlistButton";

const products = [
  {
    id: 1,
    name: "Mountain Graphic Oversized Tee",
    price: 1299,
    label: "New",
    image: "/arrivals/ostren-tee.png",
    className: "bg-[var(--surface-soft)]",
  },
  {
    id: 2,
    name: "Mountain Graphic Hoodie",
    price: 2199,
    label: "New",
    image: "/arrivals/ostren-hood.png",
    className: "bg-[var(--surface-soft)]",
  },
  {
    id: 3,
    name: "Relaxed Logo Joggers",
    price: 1699,
    label: "Trending",
    image: "/arrivals/ostren-jogg.png",
    className: "bg-[var(--surface-soft)]",
  },
  {
    id: 4,
    name: "Minimal Gold Jewelry Set",
    price: 999,
    label: "New",
    image: "/arrivals/ostren-jwel.png",
    className: "bg-[var(--surface-soft)]",
  },
];

export default function NewArrivals() {
  return (
    <section className="bg-[var(--background)] py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-8 flex items-end justify-between md:mb-10">
          <div>
            <p className="mb-3 text-[9px] font-medium tracking-[0.22em] text-black/45 uppercase">
              Fresh Drop
            </p>

            <h2 className="text-[28px] font-medium tracking-[-0.03em] text-[#111111] md:text-[38px]">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/shop?sort=newest"
            className="group hidden items-center gap-2 border-b border-black pb-1 text-[10px] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-50 sm:flex"
          >
            Shop All

            <ArrowRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-4 md:gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative"
            >
              <Link
                href={`/product/${product.id}`}
                className="block"
              >
                {/* PRODUCT IMAGE */}
                <div
                  className={`relative aspect-[3/4] overflow-hidden ${product.className}`}
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} - Ostren Fit`}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    sizes="(max-width: 767px) 50vw, 25vw"
                  />

                  {/* PRODUCT LABEL */}
                  <div className="absolute left-3 top-3 z-10 bg-[#F8F5EF]/95 px-2.5 py-1.5 text-[8px] font-semibold tracking-[0.14em] text-[#111111] uppercase backdrop-blur-sm">
                    {product.label}
                  </div>

                  {/* QUICK VIEW */}
                  <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
                    <div className="bg-[#F8F5EF]/95 py-3 text-center text-[9px] font-semibold tracking-[0.15em] text-[#111111] uppercase backdrop-blur-sm transition-colors duration-300 group-hover:bg-[#111111] group-hover:text-white">
                      Quick View
                    </div>
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="pt-3.5 md:pt-4">
                  <h3 className="pr-8 text-[11px] font-medium leading-5 text-[#111111] md:text-[12px]">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-[11px] text-black/55 md:text-[12px]">
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

        {/* MOBILE SHOP ALL */}
        <Link
          href="/shop?sort=newest"
          className="mt-9 flex items-center justify-center gap-2 border border-black/20 py-3.5 text-[9px] font-semibold tracking-[0.15em] text-[#111111] uppercase transition-colors duration-300 hover:bg-[#111111] hover:text-white sm:hidden"
        >
          Shop All

          <ArrowRight
            size={13}
            strokeWidth={1.5}
          />
        </Link>

      </div>
    </section>
  );
}