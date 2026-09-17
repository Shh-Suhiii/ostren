"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OstrenEdit() {
  return (
    <section className="bg-[#111111] py-14 text-white md:py-18 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 lg:px-10">

        {/* MAIN SECTION */}
        <div className="grid overflow-hidden bg-black lg:grid-cols-[1.3fr_0.7fr]">

          {/* =========================================
              IMAGE / CUSTOM PRINT COLLAGE
          ========================================= */}
          <div
            className="
              relative
              flex
              min-h-[400px]
              items-center
              justify-center
              overflow-hidden
              bg-black
              sm:min-h-[480px]
              md:min-h-[560px]
              lg:min-h-[680px]
            "
          >
            <Image
              src="/ostrenedit/custom-print.png"
              alt="Ostren Fit custom print studio"
              fill
              priority
              className="object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 65vw"
            />

            {/* VERY LIGHT OVERLAY */}
            <div className="pointer-events-none absolute inset-0 bg-black/[0.03]" />

            {/* IMAGE LABEL */}
            <div className="absolute bottom-5 left-5 md:bottom-7 md:left-7">
              <p className="text-[8px] font-medium tracking-[0.22em] text-white/65 uppercase md:text-[9px]">
                Custom Studio / 01
              </p>
            </div>
          </div>

          {/* =========================================
              CONTENT
          ========================================= */}
          <div
            className="
              flex
              items-center
              bg-[#111111]
              px-6
              py-12
              sm:px-9
              sm:py-14
              md:px-12
              md:py-16
              lg:px-10
              lg:py-14
              xl:px-14
            "
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.65,
                ease: "easeOut",
              }}
              className="w-full max-w-[500px]"
            >

              {/* SMALL LABEL */}
              <p className="mb-5 text-[9px] font-medium tracking-[0.24em] text-white/45 uppercase">
                Ostren Custom Studio
              </p>

              {/* HEADING */}
              <h2
                className="
                  text-[42px]
                  font-medium
                  leading-[0.94]
                  tracking-[-0.045em]
                  sm:text-[52px]
                  md:text-[60px]
                  lg:text-[54px]
                  xl:text-[64px]
                "
              >
                Your design.
                <br />
                Your fit.
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-[420px] text-[12px] leading-6 text-white/60 sm:text-[13px] md:leading-7">
                Send us your artwork, photo or idea and we&apos;ll turn it into
                a custom print on the piece you choose.
              </p>

              {/* =========================================
                  CUSTOMIZABLE PRODUCTS
              ========================================= */}
              <div className="mt-7 flex flex-wrap gap-2">
                {["T-Shirts", "Hoodies", "Joggers"].map((item) => (
                  <span
                    key={item}
                    className="
                      border
                      border-white/15
                      px-4
                      py-2
                      text-[8px]
                      font-medium
                      tracking-[0.14em]
                      text-white/70
                      uppercase
                      md:text-[9px]
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* =========================================
                  PROCESS
              ========================================= */}
              <div className="mt-8 border-t border-white/10">
                <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10">

                  {/* STEP 01 */}
                  <div className="py-4 pr-3">
                    <p className="text-[8px] tracking-[0.2em] text-white/35 uppercase">
                      01
                    </p>

                    <p className="mt-2 text-[9px] leading-4 text-white/75 sm:text-[10px]">
                      Send your
                      <br className="hidden sm:block" /> print
                    </p>
                  </div>

                  {/* STEP 02 */}
                  <div className="px-3 py-4">
                    <p className="text-[8px] tracking-[0.2em] text-white/35 uppercase">
                      02
                    </p>

                    <p className="mt-2 text-[9px] leading-4 text-white/75 sm:text-[10px]">
                      Choose your
                      <br className="hidden sm:block" /> piece
                    </p>
                  </div>

                  {/* STEP 03 */}
                  <div className="py-4 pl-3">
                    <p className="text-[8px] tracking-[0.2em] text-white/35 uppercase">
                      03
                    </p>

                    <p className="mt-2 text-[9px] leading-4 text-white/75 sm:text-[10px]">
                      We print
                      <br className="hidden sm:block" /> it
                    </p>
                  </div>
                </div>
              </div>

              {/* =========================================
                  BUTTONS
              ========================================= */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                {/* PRIMARY */}
                <Link
                  href="/customize"
                  className="
                    group
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-3
                    bg-white
                    px-6
                    text-[9px]
                    font-semibold
                    tracking-[0.15em]
                    !text-black
                    uppercase
                    transition-all
                    duration-300
                    hover:bg-[#d8d1c7]
                    md:px-7
                  "
                >
                  Customize Yours

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />
                </Link>

                {/* SECONDARY */}
                <Link
                  href="/contact"
                  className="
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    border
                    border-white/25
                    px-6
                    text-[9px]
                    font-semibold
                    tracking-[0.15em]
                    text-white
                    uppercase
                    transition-all
                    duration-300
                    hover:border-white
                    hover:bg-white
                    hover:!text-black
                    md:px-7
                  "
                >
                  Send Your Design
                </Link>
              </div>

              {/* SMALL NOTE */}
              <p className="mt-5 text-[8px] tracking-[0.08em] text-white/30">
                Your artwork. Your placement. Made by Ostren Fit.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}