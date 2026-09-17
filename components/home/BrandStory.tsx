import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="bg-[var(--ostren-off-white)] px-4 py-14 sm:px-5 sm:py-16 md:px-8 md:py-24 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1600px]">

        {/* TOP LABEL */}
        <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10 md:mb-14 lg:justify-start">
          <div className="hidden h-px w-10 bg-black/10 sm:block lg:hidden" />

          <p className="shrink-0 text-[8px] font-medium tracking-[0.24em] text-black/40 uppercase sm:text-[9px]">
            About Ostren Fit
          </p>

          <div className="h-px flex-1 bg-black/10 sm:max-w-[140px] lg:max-w-none" />

          <p className="hidden text-[9px] font-medium tracking-[0.2em] text-black/30 uppercase lg:block">
            Wear it your way
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-9 text-center md:gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20 lg:text-left">

          {/* BIG STATEMENT */}
          <div className="flex justify-center lg:justify-start">
            <h2
              className="
                max-w-[900px]
                text-[42px]
                font-medium
                leading-[0.92]
                tracking-[-0.045em]
                text-[#111111]
                min-[390px]:text-[46px]
                sm:text-[56px]
                md:text-[68px]
                lg:text-[84px]
                xl:text-[94px]
              "
            >
              Your style.
              <br />
              Your story.
              <br />

              <span className="text-black/30">
                Your Ostren.
              </span>
            </h2>
          </div>

          {/* DESCRIPTION */}
          <div className="mx-auto max-w-[520px] lg:mx-0 lg:pb-2">

            <p className="mx-auto max-w-[430px] text-[12px] leading-6 text-black/55 sm:text-[13px] md:text-[14px] md:leading-7 lg:mx-0">
              Ostren Fit is made for people who wear things their own way.
              From everyday essentials to bold printed pieces, we create
              clothing that feels personal, effortless and easy to make
              your own.
            </p>

            <p className="mx-auto mt-4 max-w-[430px] text-[12px] leading-6 text-black/55 sm:text-[13px] md:mt-5 md:text-[14px] md:leading-7 lg:mx-0">
              Pick a piece, choose a print or bring your own idea —
              we&apos;ll help turn it into something made for you.
            </p>

            {/* CTA */}
            <Link
              href="/about"
              className="
                group mt-7 inline-flex
                items-center gap-3
                border-b border-black
                pb-1.5
                text-[8px] font-semibold
                tracking-[0.16em]
                text-black uppercase
                sm:text-[9px]
              "
            >
              Discover Ostren Fit

              <ArrowUpRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        {/* BOTTOM BRAND LINE */}
        <div className="mt-12 border-t border-black/10 pt-4 sm:mt-14 md:mt-18 md:pt-5">

          {/* MOBILE */}
          <div className="text-center md:hidden">
            <p className="text-[7px] leading-4 tracking-[0.16em] text-black/35 uppercase sm:text-[8px]">
              Everyday essentials / Custom prints / Made for you
            </p>
          </div>

          {/* TABLET + DESKTOP */}
          <div className="hidden items-center justify-between gap-5 md:flex">
            <p className="text-[9px] tracking-[0.18em] text-black/35 uppercase">
              Everyday essentials / Custom prints / Made for you
            </p>

            <p className="text-[9px] tracking-[0.18em] text-black/35 uppercase">
              Ostren Fit © 2026
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}