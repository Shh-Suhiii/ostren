"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 1800);

    event.currentTarget.reset();
  };

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <AnnouncementBar />
      <Navbar />

      <section className="px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[1200px]">

          <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
            Get in touch
          </p>

          <h1 className="mt-4 font-serif text-5xl tracking-[-0.025em] text-[#022a46] md:text-7xl">
            Contact ostren
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-black/50 md:text-base">
            Questions about products, orders or anything else?
            We&apos;re here to help.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Info */}
            <div className="space-y-5">

              <InfoCard
                icon={Mail}
                title="Email"
                value="aoverayvivekkumar274@gmail.com"
              />

              <InfoCard
                icon={Phone}
                title="Phone"
                value="+91 8796620917"
              />

              <InfoCard
                icon={MapPin}
                title="Location"
                value="Noida, U.P."
              />

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 md:p-8"
            >
              <h2 className="font-serif text-3xl text-[#022a46]">
                Send us a message
              </h2>

              <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">

                <Field label="Full name" />
                <Field label="Email" type="email" />

              </div>

              <div className="mt-5">
                <Field label="Subject" />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
                  Message
                </label>

                <textarea
                  required
                  rows={6}
                  className="w-full resize-none border border-black/10 bg-[#fafaf8] px-4 py-4 text-sm outline-none focus:border-[#063b63]/40"
                />
              </div>

              <button
                type="submit"
                className="mt-6 flex h-13 items-center gap-3 bg-[#063b63] px-7 text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#022a46]"
              >
                <Send size={15} strokeWidth={1.5} />
                {sent ? "Message sent" : "Send message"}
              </button>

              <p className="mt-4 text-[9px] leading-5 text-black/35">
                This form is currently frontend-only. We&apos;ll connect it
                to the backend/email service later.
              </p>
            </form>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

type InfoCardProps = {
  icon: typeof Mail;
  title: string;
  value: string;
};

function InfoCard({
  icon: Icon,
  title,
  value,
}: InfoCardProps) {
  return (
    <div className="border border-black/10 bg-white p-6">
      <Icon
        size={20}
        strokeWidth={1.5}
        className="text-[#063b63]"
      />

      <p className="mt-5 text-[9px] font-semibold tracking-[0.16em] text-black/35 uppercase">
        {title}
      </p>

      <p className="mt-2 text-sm text-[#022a46]">
        {value}
      </p>
    </div>
  );
}

type FieldProps = {
  label: string;
  type?: string;
};

function Field({
  label,
  type = "text",
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
        {label}
      </label>

      <input
        required
        type={type}
        className="h-12 w-full border border-black/10 bg-[#fafaf8] px-4 text-sm outline-none focus:border-[#063b63]/40"
      />
    </div>
  );
}