import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const categoryCards = [
  {
    title: "Essentials",
    subtitle: "Everyday pieces, refined.",
    href: "/shop?category=Essentials",
    className: "bg-[#e7f1f5]",
  },
  {
    title: "Classics",
    subtitle: "Timeless forms for modern wardrobes.",
    href: "/shop?category=Classics",
    className: "bg-[#eef0ec]",
  },
  {
    title: "Signature",
    subtitle: "Distinctly ostren.",
    href: "/shop?category=Signature",
    className: "bg-[#e5eef2]",
  },
  {
    title: "Minimal",
    subtitle: "Clean design, quiet confidence.",
    href: "/shop?category=Minimal",
    className: "bg-[#ededeb]",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh additions to the collection.",
    href: "/shop?sort=newest",
    className: "bg-[#dcecf4]",
  },
  {
    title: "Best Sellers",
    subtitle: "The pieces everyone keeps coming back to.",
    href: "/shop?sort=best-selling",
    className: "bg-[#e8f0f3]",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <AnnouncementBar />
      <Navbar />

      <section className="px-5 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">

          <p className="mb-4 text-[10px] font-semibold tracking-[0.3em] text-[#0877b5] uppercase">
            Explore ostren
          </p>

          <h1 className="font-serif text-5xl tracking-[-0.025em] text-[#022a46] md:text-7xl">
            Categories
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-black/50 md:text-base">
            Browse the ostren collection by style, mood and everyday purpose.
          </p>

        </div>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28 lg:px-12">
        <div className="mx-auto max-w-[1440px]">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {categoryCards.map((category, index) => (
              <Link
                key={category.title}
                href={category.href}
                className={`group relative min-h-[380px] overflow-hidden ${category.className}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#022a46]/55 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-80" />

                <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#022a46] backdrop-blur-sm transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="absolute bottom-7 left-7 text-white md:bottom-8 md:left-8">
                  <span className="mb-2 block text-[9px] tracking-[0.2em] uppercase opacity-70">
                    0{index + 1}
                  </span>

                  <h2 className="font-serif text-3xl md:text-4xl">
                    {category.title}
                  </h2>

                  <p className="mt-2 max-w-[250px] text-xs leading-5 text-white/75">
                    {category.subtitle}
                  </p>
                </div>
              </Link>
            ))}

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}