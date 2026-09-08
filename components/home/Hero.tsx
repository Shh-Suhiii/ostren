"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f3]">
      <div className="relative min-h-[78vh] md:min-h-[86vh]">

        {/* HERO IMAGE */}
        <Image
          src="/hero/hero-main.jpg"
          alt="Ostren Fit new collection"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1600px] items-end px-5 pb-12 pt-24 md:min-h-[86vh] md:px-8 md:pb-16 lg:px-10 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="max-w-[660px] text-white"
          >
            <p className="mb-5 text-[10px] font-medium tracking-[0.28em] uppercase md:text-[11px]">
              Ostren Fit / New Season
            </p>

            <h1 className="max-w-[620px] text-[48px] font-medium leading-[0.92] tracking-[-0.045em] sm:text-[64px] md:text-[78px] lg:text-[92px]">
              Made to fit
              <br />
              your everyday.
            </h1>

            <p className="mt-6 max-w-[440px] text-sm leading-6 text-white/80 md:text-[15px] md:leading-7">
              Clean silhouettes, effortless fits and everyday essentials
              designed for modern wardrobes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-gray px-6 py-3.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase transition-colors hover:bg-black md:px-7 md:py-4"
              >
                Shop New Arrivals

                <ArrowRight
                  size={15}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center border border-white/50 px-6 py-3.5 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-black hover:text-black md:px-7 md:py-4"
              >
                Explore Collection
              </Link>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM LABEL */}
        <div className="absolute bottom-5 right-5 z-10 hidden md:block lg:right-10">
          <p className="text-[9px] font-medium tracking-[0.22em] text-white/70 uppercase">
            Collection 01 / 2026
          </p>
        </div>
      </div>
    </section>
  );
}