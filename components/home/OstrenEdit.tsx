"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OstrenEdit() {
  return (
    <section className="bg-[#111111] py-16 text-white md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 lg:px-10">

        <div className="grid overflow-hidden bg-black lg:grid-cols-[1.35fr_0.65fr]">

          {/* IMAGE */}
          <div className="relative min-h-[520px] overflow-hidden md:min-h-[650px] lg:min-h-[720px]">
            <Image
              src="/campaign/ostren-edit.jpg"
              alt="The Ostren Edit"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 68vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 md:bottom-7 md:left-7">
              <p className="text-[9px] font-medium tracking-[0.22em] text-white/70 uppercase">
                Editorial / 01
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex items-center bg-[#111111] px-6 py-12 sm:px-10 md:px-12 lg:px-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="max-w-md"
            >
              <p className="mb-5 text-[9px] font-medium tracking-[0.24em] text-white/45 uppercase">
                The Ostren Edit
              </p>

              <h2 className="text-[38px] font-medium leading-[0.98] tracking-[-0.04em] sm:text-[48px] md:text-[56px]">
                Designed with
                <br />
                intention.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
                A refined selection of modern essentials designed around
                clean silhouettes, comfort and effortless everyday style.
              </p>

              <Link
                href="/shop"
                className="group mt-8 inline-flex items-center gap-3 border-b border-white pb-1.5 text-[10px] font-medium tracking-[0.15em] uppercase"
              >
                Explore The Edit

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}