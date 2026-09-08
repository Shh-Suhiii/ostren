import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="bg-white px-5 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1000px] text-center">

        <p className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-[#0877b5] uppercase">
          Our philosophy
        </p>

        <h2 className="font-serif text-4xl leading-[1.08] tracking-[-0.025em] text-[#022a46] sm:text-5xl md:text-6xl lg:text-7xl">
          Less noise.
          <br />
          More intention.
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-black/55 md:text-base md:leading-8">
          ostren is built around the idea that the things we use every day
          should feel considered. Clean forms, thoughtful details and a
          timeless approach come together to create pieces made for modern
          life.
        </p>

        <Link
          href="/about"
          className="group mt-9 inline-flex items-center gap-3 border-b border-[#063b63]/30 pb-2 text-[10px] font-semibold tracking-[0.18em] text-[#063b63] uppercase"
        >
          Discover ostren

          <ArrowUpRight
            size={15}
            strokeWidth={1.5}
            className="transition-transform group-hover:rotate-45"
          />
        </Link>

      </div>
    </section>
  );
}