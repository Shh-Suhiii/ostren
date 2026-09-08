import Link from "next/link";
import {
  ArrowRight,
  Gem,
  Heart,
  Sparkles,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const values = [
  {
    icon: Sparkles,
    title: "Thoughtful Design",
    description:
      "Every detail is considered with a focus on clean forms, versatility and modern simplicity.",
  },
  {
    icon: Gem,
    title: "Everyday Quality",
    description:
      "Pieces designed to feel considered, refined and easy to make part of your everyday wardrobe.",
  },
  {
    icon: Heart,
    title: "Made to Be Yours",
    description:
      "Style should feel personal. ostren is about pieces that complement you rather than define you.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <div className="mx-auto max-w-[1440px]">

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] text-[#0877b5] uppercase">
                Our story
              </p>

              <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.05] tracking-[-0.03em] text-[#022a46] md:text-7xl">
                Made for the way you live.
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-black/55 md:text-base md:leading-8">
                ostren is built around a simple idea: everyday
                style can feel refined without feeling
                complicated.
              </p>

              <p className="mt-4 max-w-lg text-sm leading-7 text-black/55 md:text-base md:leading-8">
                We bring together clean design, modern
                silhouettes and versatile pieces created to
                move naturally through everyday life.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex h-13 items-center gap-3 bg-[#063b63] px-7 text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#022a46]"
              >
                Explore ostren

                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            {/* Image placeholder */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e4edf1]">

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">
                  <p className="font-serif text-5xl tracking-[0.08em] text-[#063b63]/15 md:text-7xl">
                    ostren
                  </p>

                  <p className="mt-4 text-[8px] font-semibold tracking-[0.35em] text-[#063b63]/25 uppercase">
                    Brand visual
                  </p>
                </div>

              </div>

              <div className="absolute bottom-6 left-6 border border-white/40 bg-white/70 px-4 py-3 backdrop-blur-md">
                <p className="text-[8px] font-semibold tracking-[0.2em] text-[#063b63] uppercase">
                  Quietly distinctive
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Statement */}
      <section className="bg-[#063b63] px-5 py-20 md:px-8 md:py-28 lg:px-12">

        <div className="mx-auto max-w-[1100px] text-center">

          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#8bc6e6] uppercase">
            The ostren philosophy
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl font-serif text-4xl leading-[1.15] tracking-[-0.025em] text-white md:text-6xl">
            Less noise. More intention.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/60 md:text-base md:leading-8">
            We believe good design doesn&apos;t need to shout.
            It should feel effortless, useful and unmistakably
            yours.
          </p>

        </div>

      </section>

      {/* Values */}
      <section className="bg-white px-5 py-20 md:px-8 md:py-28 lg:px-12">

        <div className="mx-auto max-w-[1440px]">

          <div className="max-w-xl">
            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
              What matters to us
            </p>

            <h2 className="mt-4 font-serif text-4xl tracking-[-0.02em] text-[#022a46] md:text-5xl">
              Designed with intention.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 border-t border-black/10 md:grid-cols-3">

            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className={`py-9 md:px-8 md:py-12 ${
                    index !== 0
                      ? "border-t border-black/10 md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f4f9] text-[#063b63]">
                    <Icon
                      size={18}
                      strokeWidth={1.4}
                    />
                  </div>

                  <h3 className="mt-6 font-serif text-2xl text-[#022a46]">
                    {value.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-black/50">
                    {value.description}
                  </p>
                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* Closing CTA */}
      <section className="px-5 py-20 md:px-8 md:py-28 lg:px-12">

        <div className="mx-auto max-w-[1440px] bg-[#e7f1f5] px-6 py-16 text-center md:px-12 md:py-24">

          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#0877b5] uppercase">
            Discover the collection
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl tracking-[-0.025em] text-[#022a46] md:text-6xl">
            Find your everyday ostren.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-black/50">
            Explore pieces designed around simplicity,
            versatility and modern everyday style.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex h-13 items-center gap-3 bg-[#063b63] px-7 text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#022a46]"
          >
            Shop collection

            <ArrowRight
              size={15}
              strokeWidth={1.5}
            />
          </Link>

        </div>

      </section>

      <Footer />
    </main>
  );
}