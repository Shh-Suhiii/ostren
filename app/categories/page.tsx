import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const categoryCards = [
  {
    title: "T-Shirts",
    subtitle: "Oversized graphics and everyday essentials.",
    href: "/shop?category=t-shirts",
    image: "/category/ostren-tee.png",
  },
  {
    title: "Hoodies",
    subtitle: "Relaxed layers built for everyday comfort.",
    href: "/shop?category=hoodies",
    image: "/category/ostren-hood.png",
  },
  {
    title: "Joggers",
    subtitle: "Easy silhouettes made to move with you.",
    href: "/shop?category=joggers",
    image: "/category/ostren-jog.png",
  },
  {
    title: "Jewelry",
    subtitle: "Minimal details designed to complete the look.",
    href: "/shop?category=jewelry",
    image: "/category/ostren-jwel.png",
  },
  {
    title: "Mugs & Bottles",
    subtitle: "Ostren essentials beyond the wardrobe.",
    href: "/shop?category=mugs-bottles",
    image: "/products/shop/bottle.png",
  },
  {
    title: "Photo Frames",
    subtitle: "Personal pieces made for your favorite moments.",
    href: "/shop?category=photo-frames",
    image: "/products/shop/frame.png",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[var(--ostren-off-white)]">
      <AnnouncementBar />
      <Navbar />

      {/* HERO */}
      <section className="border-b border-black/5 px-5 pb-10 pt-10 md:px-8 md:pb-16 md:pt-20 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 text-[8px] font-semibold tracking-[0.28em] text-black/40 uppercase md:mb-4 md:text-[10px]">
            Explore Ostren Fit
          </p>

          <h1 className="font-serif text-[42px] leading-none tracking-[-0.04em] text-[#111111] md:text-[68px] lg:text-[76px]">
            Categories
          </h1>

          <p className="mt-4 max-w-[520px] text-[12px] leading-6 text-black/50 md:mt-5 md:text-[15px] md:leading-7">
            Explore the collection by category and find pieces designed
            for everyday style, comfort and expression.
          </p>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="px-5 py-7 md:px-8 md:py-12 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-5 md:gap-y-10">
            {categoryCards.map((category, index) => (
              <Link
                key={category.title}
                href={category.href}
                className="group block"
              >
                {/* IMAGE */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe7e0]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

                  {/* NUMBER */}
                  <span className="absolute left-3 top-3 text-[8px] font-medium tracking-[0.15em] text-white/80 md:left-4 md:top-4 md:text-[9px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* ARROW */}
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F5EF]/90 text-[#111111] backdrop-blur-sm transition-all duration-300 group-hover:bg-[#111111] group-hover:text-white md:right-4 md:top-4 md:h-10 md:w-10">
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  </div>

                  {/* MOBILE TITLE OVER IMAGE */}
                  <div className="absolute inset-x-3 bottom-3 md:hidden">
                    <h2 className="font-serif text-[22px] leading-tight text-white">
                      {category.title}
                    </h2>
                  </div>
                </div>

                {/* DESKTOP TEXT */}
                <div className="hidden pt-4 md:block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-[28px] leading-none tracking-[-0.02em] text-[#111111] lg:text-[32px]">
                        {category.title}
                      </h2>

                      <p className="mt-2 max-w-[300px] text-[11px] leading-5 text-black/45 lg:text-[12px]">
                        {category.subtitle}
                      </p>
                    </div>

                    <span className="mt-1 text-[8px] font-medium tracking-[0.16em] text-black/30 uppercase">
                      Shop
                    </span>
                  </div>
                </div>

                {/* MOBILE DESCRIPTION */}
                <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-black/45 md:hidden">
                  {category.subtitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK COLLECTION LINKS */}
      <section className="px-5 pb-14 pt-4 md:px-8 md:pb-24 md:pt-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-3">
          <Link
            href="/shop?sort=newest"
            className="group flex min-h-[110px] flex-col justify-between border border-black/10 bg-[#F8F5EF] p-4 transition-colors hover:border-black/25 md:min-h-[150px] md:p-6"
          >
            <ArrowUpRight
              size={16}
              strokeWidth={1.4}
              className="ml-auto transition-transform duration-300 group-hover:rotate-45"
            />

            <div>
              <p className="text-[8px] font-medium tracking-[0.16em] text-black/35 uppercase">
                Discover
              </p>

              <h3 className="mt-1 font-serif text-[21px] text-[#111111] md:text-[30px]">
                New Arrivals
              </h3>
            </div>
          </Link>

          <Link
            href="/shop?sort=best-selling"
            className="group flex min-h-[110px] flex-col justify-between bg-[#111111] p-4 text-white md:min-h-[150px] md:p-6"
          >
            <ArrowUpRight
              size={16}
              strokeWidth={1.4}
              className="ml-auto transition-transform duration-300 group-hover:rotate-45"
            />

            <div>
              <p className="text-[8px] font-medium tracking-[0.16em] text-white/45 uppercase">
                Most loved
              </p>

              <h3 className="mt-1 font-serif text-[21px] md:text-[30px]">
                Best Sellers
              </h3>
            </div>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}