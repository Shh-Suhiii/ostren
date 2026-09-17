"use client";

import Link from "next/link";
import {
  ArrowRight,
  ImagePlus,
  Shirt,
  Coffee,
  Frame,
  Sparkles,
  Upload,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const customizeOptions = [
  {
    id: "tshirts",
    title: "T-Shirts",
    description:
      "Create a tee with your own artwork, photo or text.",
    icon: Shirt,
  },
  {
    id: "hoodies",
    title: "Hoodies",
    description:
      "Personalize everyday hoodies with your own design.",
    icon: Sparkles,
  },
  {
    id: "mugs",
    title: "Mugs & Bottles",
    description:
      "Turn photos, names and memories into everyday pieces.",
    icon: Coffee,
  },
  {
    id: "frames",
    title: "Photo Frames",
    description:
      "Create a personalized frame for moments worth keeping.",
    icon: Frame,
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your piece",
    description:
      "Start with the product you want to personalize.",
  },
  {
    number: "02",
    title: "Add your design",
    description:
      "Upload a photo, artwork or add custom text.",
  },
  {
    number: "03",
    title: "Make it yours",
    description:
      "Adjust the placement and preview your customized piece.",
  },
  {
    number: "04",
    title: "Place your order",
    description:
      "Add it to your bag and we'll take care of the rest.",
  },
];

export default function CustomizePage() {
  return (
    <main className="min-h-screen bg-[#f5f2ec] text-[#111111]">
      <AnnouncementBar />
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="border-b border-black/10 px-5 py-16 md:px-8 md:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

          <div className="max-w-xl">

            <p className="text-[9px] font-semibold tracking-[0.28em] text-black/45 uppercase">
              Made by you
            </p>

            <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-[86px]">
              Make it
              <br />
              personal.
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-black/50 md:text-[15px]">
              Turn your photos, artwork and ideas into
              something uniquely yours. Pick a piece,
              personalize it and let Ostren Fit bring
              your design to life.
            </p>

            <a
              href="#customize-products"
              className="mt-9 inline-flex h-14 items-center gap-3 bg-[#111111] px-7 text-[9px] font-semibold tracking-[0.18em] !text-white uppercase transition-colors hover:bg-[#292929]"
            >
              Start customizing

              <ArrowRight
                size={15}
                strokeWidth={1.5}
              />
            </a>

          </div>

          {/* Preview */}
          <div className="relative min-h-[480px] overflow-hidden bg-[#e9e4dd] md:min-h-[620px]">

            <div className="absolute inset-0 flex items-center justify-center">

              <div className="relative flex aspect-[4/5] w-[58%] items-center justify-center bg-[#ded8cf] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">

                <div className="text-center">

                  <p className="text-[8px] font-semibold tracking-[0.3em] text-black/30 uppercase">
                    Your design
                  </p>

                  <p className="mt-3 font-serif text-4xl tracking-[-0.04em] text-black/70 md:text-6xl">
                    yours.
                  </p>

                  <div className="mx-auto mt-5 h-px w-10 bg-black/25" />

                  <p className="mt-5 text-[7px] font-semibold tracking-[0.25em] text-black/30 uppercase">
                    Ostren Fit
                  </p>

                </div>

              </div>

            </div>

            <div className="absolute bottom-5 left-5 bg-[#f5f2ec]/90 px-4 py-3 backdrop-blur-sm">
              <p className="text-[7px] font-semibold tracking-[0.2em] text-black/45 uppercase">
                Designed by you
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          PRODUCT TYPES
      ===================================================== */}

      <section
        id="customize-products"
        className="px-5 py-20 md:px-8 md:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-[1440px]">

          <div className="max-w-xl">

            <p className="text-[9px] font-semibold tracking-[0.25em] text-black/40 uppercase">
              Choose your canvas
            </p>

            <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-6xl">
              What do you want
              <br />
              to customize?
            </h2>

          </div>

          <div className="mt-12 grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">

            {customizeOptions.map(
              (option) => {
                const Icon =
                  option.icon;

                return (
                  <Link
                    key={option.id}
                    href={`/customize/${option.id}`}
                    className="group min-h-[330px] bg-[#f5f2ec] p-7 transition-colors duration-300 hover:bg-[#111111]"
                  >
                    <div className="flex h-full flex-col">

                      <div className="flex h-12 w-12 items-center justify-center border border-black/15 transition-colors group-hover:border-white/20 group-hover:text-white">
                        <Icon
                          size={19}
                          strokeWidth={1.3}
                        />
                      </div>

                      <div className="mt-auto">

                        <p className="font-serif text-3xl tracking-[-0.02em] transition-colors group-hover:text-white">
                          {option.title}
                        </p>

                        <p className="mt-3 max-w-[230px] text-xs leading-6 text-black/45 transition-colors group-hover:text-white/55">
                          {option.description}
                        </p>

                        <div className="mt-6 flex items-center gap-2 text-[8px] font-semibold tracking-[0.16em] uppercase transition-colors group-hover:text-white">
                          Customize

                          <ArrowRight
                            size={13}
                            strokeWidth={1.5}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </div>

                      </div>

                    </div>
                  </Link>
                );
              }
            )}

          </div>

        </div>
      </section>

      {/* =====================================================
          CUSTOM DESIGN BANNER
      ===================================================== */}

      <section className="px-5 pb-20 md:px-8 md:pb-28 lg:px-12">

        <div className="mx-auto grid max-w-[1440px] overflow-hidden bg-[#111111] lg:grid-cols-2">

          <div className="flex min-h-[430px] items-center p-8 md:p-14 lg:p-16">

            <div className="max-w-md">

              <div className="flex h-11 w-11 items-center justify-center border border-white/15 text-white">
                <ImagePlus
                  size={18}
                  strokeWidth={1.3}
                />
              </div>

              <p className="mt-8 text-[8px] font-semibold tracking-[0.25em] text-white/40 uppercase">
                Your idea. Your piece.
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] text-white md:text-5xl">
                Have your own
                <br />
                design?
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/45">
                Upload your artwork, photograph or graphic
                and turn it into a personalized Ostren Fit
                piece.
              </p>

              <a
                href="#customize-products"
                className="mt-8 inline-flex items-center gap-3 border-b border-white/40 pb-2 text-[8px] font-semibold tracking-[0.18em] text-white uppercase"
              >
                Choose a product

                <ArrowRight
                  size={13}
                  strokeWidth={1.5}
                />
              </a>

            </div>

          </div>

          <div className="flex min-h-[430px] items-center justify-center bg-[#ded8cf] p-8">

            <div className="flex aspect-square w-[68%] max-w-[340px] flex-col items-center justify-center border border-dashed border-black/20 bg-[#e9e4dd]">

              <Upload
                size={24}
                strokeWidth={1.2}
                className="text-black/35"
              />

              <p className="mt-5 text-[8px] font-semibold tracking-[0.18em] text-black/40 uppercase">
                Upload your creativity
              </p>

              <p className="mt-2 text-[9px] text-black/30">
                Images • Artwork • Text
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="border-y border-black/10 bg-[#eeebe5] px-5 py-20 md:px-8 md:py-28 lg:px-12">

        <div className="mx-auto max-w-[1440px]">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-[9px] font-semibold tracking-[0.25em] text-black/40 uppercase">
                Simple by design
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-6xl">
                How it works.
              </h2>

            </div>

            <p className="max-w-sm text-xs leading-6 text-black/45">
              From an idea on your screen to a piece made
              especially for you.
            </p>

          </div>

          <div className="mt-14 grid border-t border-black/15 md:grid-cols-2 lg:grid-cols-4">

            {steps.map(
              (step) => (
                <div
                  key={step.number}
                  className="border-b border-black/15 py-8 md:border-r md:px-7 lg:border-b-0 first:pl-0 last:border-r-0"
                >

                  <p className="text-[8px] font-semibold tracking-[0.2em] text-black/30">
                    {step.number}
                  </p>

                  <h3 className="mt-8 font-serif text-2xl tracking-[-0.02em]">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-[240px] text-xs leading-6 text-black/45">
                    {step.description}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="px-5 py-24 text-center md:px-8 md:py-32">

        <div className="mx-auto max-w-2xl">

          <p className="text-[9px] font-semibold tracking-[0.25em] text-black/40 uppercase">
            Made for one
          </p>

          <h2 className="mt-5 font-serif text-5xl tracking-[-0.04em] md:text-7xl">
            Yours, truly.
          </h2>

          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-black/45">
            Some things mean more when they are made
            specifically for you.
          </p>

          <a
            href="#customize-products"
            className="mt-9 inline-flex h-14 items-center gap-3 bg-[#111111] px-8 text-[9px] font-semibold tracking-[0.18em] !text-white uppercase transition-colors hover:bg-[#292929]"
          >
            Create yours

            <ArrowRight
              size={14}
              strokeWidth={1.5}
            />
          </a>

        </div>

      </section>

      <Footer />
    </main>
  );
}