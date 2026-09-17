"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#d9d4cc]">
      <div className="relative min-h-[84svh] sm:min-h-[82vh] md:min-h-[86vh] lg:min-h-[88vh]">

        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">
          <Image
            src="/hero/ostren-home2.png"
            alt="Ostren Fit new collection"
            fill
            priority
            className="
              object-cover
              object-[72%_center]
              sm:object-[65%_center]
              md:object-center
            "
            sizes="100vw"
          />
        </div>

        {/* MOBILE READABILITY LAYER */}
        <div className="absolute inset-0 bg-black/[0.10] sm:bg-black/[0.07] md:bg-black/[0.05]" />

        {/* CONTENT */}
        <div
          className="
            relative z-10 mx-auto flex
            min-h-[84svh]
            max-w-[1600px]
            items-end
            px-5 pb-7 pt-20
            sm:min-h-[82vh] sm:px-7 sm:pb-12 sm:pt-24
            md:min-h-[86vh] md:px-10 md:pb-16
            lg:min-h-[88vh] lg:px-14 lg:pb-20
            xl:px-16
          "
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="w-full max-w-[760px]"
          >
            {/* LABEL */}
            <p
              className="
                mb-3
                text-[8px] font-semibold
                tracking-[0.26em]
                text-white/85 uppercase
                [text-shadow:0_1px_10px_rgba(0,0,0,0.22)]
                sm:mb-4 sm:text-[10px]
                md:mb-5
              "
            >
              Ostren Fit / New Season
            </p>

            {/* HEADING */}
            <h1
              className="
                max-w-[680px]
                text-[43px] font-medium
                leading-[0.9]
                tracking-[-0.05em]
                text-[#F8F4ED]
                [text-shadow:0_2px_20px_rgba(0,0,0,0.22)]
                min-[390px]:text-[47px]
                sm:text-[64px]
                md:text-[78px]
                lg:text-[94px]
                xl:text-[108px]
              "
            >
              Made to fit
              <br />
              your everyday.
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-4 max-w-[360px]
                text-[11px] leading-[1.65]
                text-white/85
                [text-shadow:0_1px_10px_rgba(0,0,0,0.25)]
                sm:mt-5 sm:max-w-[430px] sm:text-[13px] sm:leading-6
                md:mt-6 md:text-[14px]
              "
            >
              Wear your mood. Own your style. Made for everyday moments and
              everything beyond.
            </p>

            {/* ACTIONS */}
            <div
              className="
                mt-6 grid w-full
                grid-cols-1 gap-2.5
                sm:mt-7 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3
                md:mt-8
              "
            >
              {/* PRIMARY */}
              <Link
                href="/shop"
                className="
                  group inline-flex
                  min-h-[46px]
                  w-full
                  items-center justify-center
                  gap-3
                  bg-[#F8F4ED]
                  px-5
                  text-[9px] font-semibold
                  tracking-[0.15em]
                  !text-[#171717] uppercase
                  transition-all duration-300
                  hover:bg-[#171717]
                  hover:!text-white
                  sm:w-auto sm:px-6
                  md:min-h-[50px]
                  md:px-7
                "
              >
                <span className="transition-colors duration-300 group-hover:!text-white">
                  Shop New Arrivals
                </span>

                <ArrowRight
                  size={14}
                  strokeWidth={1.6}
                  className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                />
              </Link>

              {/* SECONDARY */}
              <Link
                href="/categories"
                className="
                  inline-flex
                  min-h-[46px]
                  w-full
                  items-center justify-center
                  border border-white/60
                  bg-black/15
                  px-5
                  text-[9px] font-semibold
                  tracking-[0.15em]
                  text-white uppercase
                  backdrop-blur-[2px]
                  transition-all duration-300
                  hover:border-[#F8F4ED]
                  hover:bg-[#F8F4ED]
                  hover:text-[#171717]
                  sm:w-auto sm:px-6
                  md:min-h-[50px]
                  md:px-7
                "
              >
                Explore Collection
              </Link>
            </div>
          </motion.div>
        </div>

        {/* COLLECTION LABEL */}
        <div className="absolute bottom-5 right-6 z-10 hidden md:block lg:right-10">
          <p className="text-[8px] font-medium tracking-[0.24em] text-white/75 uppercase">
            Collection 01 / 2026
          </p>
        </div>

      </div>
    </section>
  );
}