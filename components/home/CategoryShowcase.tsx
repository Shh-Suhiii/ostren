import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Shirts",
    subtitle: "Everyday essentials",
    image: "/categories/shirts.jpg",
    href: "/shop?category=shirts",
  },
  {
    name: "T-Shirts",
    subtitle: "Clean & effortless",
    image: "/categories/tshirts.jpg",
    href: "/shop?category=t-shirts",
  },
  {
    name: "Bottoms",
    subtitle: "Built for everyday",
    image: "/categories/bottoms.jpg",
    href: "/shop?category=bottoms",
  },
  {
    name: "New Arrivals",
    subtitle: "The latest drop",
    image: "/categories/new-arrivals.jpg",
    href: "/shop",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-8 flex items-end justify-between md:mb-10">
          <div>
            <p className="mb-3 text-[9px] font-medium tracking-[0.22em] text-black/45 uppercase">
              Explore Ostren Fit
            </p>

            <h2 className="text-[28px] font-medium tracking-[-0.03em] text-[#111111] md:text-[38px]">
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
        <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group block"
            >
              {/* IMAGE */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f1f1ef]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />

                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70" />

                {/* MOBILE TITLE OVER IMAGE */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 text-white sm:hidden">
                  <p className="text-[12px] font-medium">
                    {category.name}
                  </p>

                  <ArrowUpRight size={15} strokeWidth={1.5} />
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

                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:bg-black group-hover:text-white">
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
        <div className="mt-8 sm:hidden">
          <Link
            href="/categories"
            className="inline-block border-b border-black pb-1 text-[10px] font-medium tracking-[0.14em] uppercase"
          >
            View All Categories
          </Link>
        </div>

      </div>
    </section>
  );
}