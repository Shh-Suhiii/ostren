import Image from "next/image";
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
    number: "01",
    title: "Thoughtful Design",
    description:
      "Clean forms, wearable silhouettes and details designed with purpose.",
  },
  {
    icon: Gem,
    number: "02",
    title: "Everyday Quality",
    description:
      "Pieces created to feel considered, comfortable and easy to live in.",
  },
  {
    icon: Heart,
    number: "03",
    title: "Made to Be Yours",
    description:
      "Style should feel personal. Ostren Fit is designed to complement you, not define you.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--ostren-off-white)]">
      <AnnouncementBar />
      <Navbar />

      {/* HERO */}
      <section className="border-b border-black/10 px-5 py-10 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:gap-20">
            {/* LEFT */}
            <div>
              <p className="text-[8px] font-semibold tracking-[0.28em] text-black/40 uppercase md:text-[10px]">
                Our story
              </p>

              <h1 className="mt-4 max-w-[760px] font-serif text-[46px] leading-[0.98] tracking-[-0.045em] text-[#111111] md:mt-6 md:text-[76px] lg:text-[92px]">
                Made for the way you live.
              </h1>

              <div className="mt-7 max-w-[590px] space-y-4 md:mt-9">
                <p className="text-[13px] leading-6 text-black/55 md:text-[15px] md:leading-7">
                  Ostren Fit started with a simple idea — everyday style
                  should feel refined without becoming complicated.
                </p>

                <p className="text-[13px] leading-6 text-black/55 md:text-[15px] md:leading-7">
                  We create modern essentials built around comfort,
                  individuality and pieces that naturally become part
                  of your everyday life.
                </p>
              </div>

              <Link
                href="/shop"
                className="
                  mt-7
                  inline-flex
                  h-11
                  items-center
                  gap-3
                  bg-[#111111]
                  px-6
                  text-[9px]
                  font-semibold
                  tracking-[0.16em]
                  !text-white
                  uppercase
                  transition-colors
                  hover:bg-black/80
                  hover:!text-white
                  md:mt-9
                  md:h-12
                  md:px-7
                  md:text-[10px]
                "
              >
                <span className="!text-white">
                  Explore the collection
                </span>

                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="text-white"
                />
              </Link>
            </div>

            {/* RIGHT BRAND PANEL */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e5de] lg:aspect-[4/5]">
              <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7 lg:p-8">
                <div className="flex items-start justify-between">
                  <span className="text-[8px] font-medium tracking-[0.18em] text-black/35 uppercase">
                    Ostren Fit / 2026
                  </span>

                  <span className="text-[8px] font-medium tracking-[0.18em] text-black/35 uppercase">
                    Est. 2026
                  </span>
                </div>

                <div className="flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative h-[170px] w-[260px] md:h-[220px] md:w-[340px] lg:h-[280px] lg:w-[420px]">
                      <Image
                        src="/logo/ostren-logo.png"
                        alt="Ostren Fit"
                        fill
                        priority
                        sizes="(max-width: 768px) 260px, (max-width: 1024px) 340px, 420px"
                        className="object-contain"
                      />
                    </div>
                    <p className="mt-1 text-[7px] font-medium tracking-[0.32em] text-black/30 uppercase md:text-[8px]">
                      Everyday / Elevated
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <p className="max-w-[180px] text-[10px] leading-4 text-black/40 md:text-[11px]">
                    Designed around simplicity,
                    comfort and expression.
                  </p>

                  <div className="h-10 w-10 rounded-full border border-black/15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-[#111111] px-5 py-16 text-white md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.55fr_1fr] md:items-start md:gap-14">
            <p className="text-[8px] font-semibold tracking-[0.28em] text-white/40 uppercase md:text-[10px]">
              The philosophy
            </p>

            <div>
              <h2 className="font-serif text-[40px] leading-[1.02] tracking-[-0.035em] md:text-[64px]">
                Less noise.
                <br />
                More intention.
              </h2>

              <p className="mt-6 max-w-[600px] text-[13px] leading-6 text-white/55 md:text-[15px] md:leading-7">
                We believe good design should feel effortless.
                Something you reach for without thinking, wear
                without trying too hard and make your own over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-5 py-14 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-7 border-b border-black/10 pb-8 md:grid-cols-[0.65fr_1fr] md:items-end md:pb-10">
            <div>
              <p className="text-[8px] font-semibold tracking-[0.28em] text-black/40 uppercase md:text-[10px]">
                What matters to us
              </p>

              <h2 className="mt-3 font-serif text-[38px] leading-none tracking-[-0.035em] text-[#111111] md:text-[56px]">
                Designed with intention.
              </h2>
            </div>

            <p className="max-w-[500px] text-[12px] leading-6 text-black/45 md:justify-self-end md:text-[14px] md:leading-7">
              From the first idea to the final detail, every piece
              is guided by simplicity, versatility and everyday use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className={`py-8 md:px-7 md:py-12 lg:px-9 ${index !== 0
                    ? "border-t border-black/10 md:border-l md:border-t-0"
                    : ""
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-medium tracking-[0.18em] text-black/30">
                      {value.number}
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10">
                      <Icon
                        size={15}
                        strokeWidth={1.4}
                      />
                    </div>
                  </div>

                  <h3 className="mt-8 font-serif text-[26px] tracking-[-0.02em] text-[#111111] md:text-[30px]">
                    {value.title}
                  </h3>

                  <p className="mt-3 max-w-[320px] text-[12px] leading-6 text-black/45 md:text-[13px]">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="border-y border-black/10 px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-[8px] font-semibold tracking-[0.28em] text-black/40 uppercase md:text-[10px]">
                Built for everyday
              </p>

              <h2 className="mt-4 max-w-[650px] font-serif text-[40px] leading-[1.04] tracking-[-0.04em] text-[#111111] md:text-[60px]">
                Clothes should fit your life, not the other way around.
              </h2>
            </div>

            <div className="lg:pl-12">
              <p className="max-w-[500px] text-[13px] leading-7 text-black/50 md:text-[15px]">
                Ostren Fit is about creating pieces that work across
                days, moods and moments — from relaxed everyday fits
                to details that make an outfit feel more personal.
              </p>

              <div className="mt-8 grid grid-cols-3 border-y border-black/10 py-5">
                <div>
                  <p className="font-serif text-[24px] text-[#111111] md:text-[30px]">
                    Clean
                  </p>
                  <p className="mt-1 text-[7px] tracking-[0.16em] text-black/30 uppercase">
                    Design
                  </p>
                </div>

                <div className="border-l border-black/10 pl-4">
                  <p className="font-serif text-[24px] text-[#111111] md:text-[30px]">
                    Easy
                  </p>
                  <p className="mt-1 text-[7px] tracking-[0.16em] text-black/30 uppercase">
                    Everyday
                  </p>
                </div>

                <div className="border-l border-black/10 pl-4">
                  <p className="font-serif text-[24px] text-[#111111] md:text-[30px]">
                    Yours
                  </p>
                  <p className="mt-1 text-[7px] tracking-[0.16em] text-black/30 uppercase">
                    Personal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-12 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[1440px] bg-[#e9e5de] px-6 py-12 md:px-12 md:py-20">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[8px] font-semibold tracking-[0.28em] text-black/35 uppercase md:text-[10px]">
                Discover Ostren Fit
              </p>

              <h2 className="mt-4 max-w-[780px] font-serif text-[38px] leading-[1.03] tracking-[-0.035em] text-[#111111] md:text-[58px]">
                Find something that feels like you.
              </h2>

              <p className="mt-4 max-w-[500px] text-[12px] leading-6 text-black/45 md:text-[14px]">
                Explore everyday pieces designed around
                comfort, simplicity and personal style.
              </p>
            </div>

            <Link
              href="/shop"
              className="
                inline-flex
                h-11
                w-fit
                items-center
                gap-3
                bg-[#111111]
                px-6
                text-[9px]
                font-semibold
                tracking-[0.16em]
                !text-white
                uppercase
                transition-colors
                hover:bg-black/80
                hover:!text-white
                md:h-12
                md:px-7
                md:text-[10px]
              "
            >
              <span className="!text-white">
                Shop collection
              </span>

              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="text-white"
              />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}