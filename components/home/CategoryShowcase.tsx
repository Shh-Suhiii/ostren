import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "T-Shirts",
    subtitle: "Everyday essentials",
    image: "/category/ostren-tee.png",
    href: "/shop?category=t-shirts",
  },
  {
    name: "Hoodies",
    subtitle: "Comfort, elevated",
    image: "/category/ostren-hood.png",
    href: "/shop?category=hoodies",
  },
  {
    name: "Joggers",
    subtitle: "Relaxed everyday fits",
    image: "/category/ostren-jog.png",
    href: "/shop?category=joggers",
  },
  {
    name: "Jewelry",
    subtitle: "Details that stand out",
    image: "/category/ostren-jwel.png",
    href: "/shop?category=jewelry",
  },
  {
    name: "Mugs & Bottles",
    subtitle: "Everyday lifestyle essentials",
    image: "/category/ostren-mugs.png",
    href: "/shop?category=mugs-bottles",
  },
  {
    name: "Photo Frames",
    subtitle: "Made for your moments",
    image: "/category/ostren-frame.png",
    href: "/shop?category=photo-frames",
  },
];

export default function CategoryShowcase() {
  const featuredCategories = categories.slice(0, 4);

  return (
    <section className="bg-[var(--background)] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-5 md:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-6 flex items-end justify-between sm:mb-8 md:mb-10">
          <div>
            <p className="mb-2 text-[8px] font-medium tracking-[0.22em] text-black/40 uppercase sm:mb-3 sm:text-[9px]">
              Explore Ostren Fit
            </p>

            <h2 className="text-[26px] font-medium tracking-[-0.035em] text-[#111111] sm:text-[28px] md:text-[38px]">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/categories"
            className="hidden border-b border-black pb-1 text-[10px] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-50 sm:block"
          >
            View All
          </Link>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 sm:gap-x-3 sm:gap-y-7 md:grid-cols-4 md:gap-x-4 md:gap-y-10">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group block"
            >
              {/* IMAGE */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--surface-soft)]">
                <Image
                  src={category.image}
                  alt={`${category.name} - Ostren Fit`}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  sizes="(max-width: 767px) 50vw, 25vw"
                />

                {/* MOBILE OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 sm:opacity-50" />

                {/* MOBILE TITLE */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-2.5 text-white sm:hidden">
                  <p className="text-[10px] font-medium tracking-[0.01em]">
                    {category.name}
                  </p>

                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* DESKTOP INFO */}
              <div className="mt-4 hidden items-start justify-between sm:flex">
                <div>
                  <h3 className="text-[13px] font-medium text-black">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-[10px] tracking-[0.03em] text-black/45">
                    {category.subtitle}
                  </p>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:bg-black group-hover:text-white">
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-7 sm:hidden">
          <Link
            href="/categories"
            className="inline-block border-b border-black pb-1 text-[9px] font-medium tracking-[0.14em] uppercase"
          >
            View All Categories
          </Link>
        </div>

      </div>
    </section>
  );
}