"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:5000";

      const response = await fetch(
        `${apiUrl}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to request password reset."
        );

        return;
      }

      /*
        LOCAL DEVELOPMENT ONLY

        Backend abhi reset URL response
        me return kar raha hai.

        Browser console me bhi show hoga
        aur localStorage me save hoga.
      */
      if (data.reset_url) {
        console.log(
          "OSTREN RESET URL:",
          data.reset_url
        );

        localStorage.setItem(
          "ostren-dev-reset-url",
          data.reset_url
        );
      }

      setSubmitted(true);
    } catch {
      setError(
        "Unable to connect to the Ostren Fit server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--ostren-off-white)]">
      <AnnouncementBar />
      <Navbar />

      <section className="px-5 py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 overflow-hidden border border-black/10 lg:grid-cols-[0.9fr_1fr]">

          {/* LEFT PANEL */}
          <div className="hidden min-h-[590px] flex-col justify-between bg-[#111111] p-10 text-white lg:flex">
            <p className="text-[9px] font-medium tracking-[0.24em] text-white/40 uppercase">
              Ostren Fit
            </p>

            <div>
              <p className="font-serif text-[54px] leading-[1.02] tracking-[-0.04em]">
                Reset.
                <br />
                Return.
              </p>

              <p className="mt-6 max-w-[320px] text-[13px] leading-6 text-white/55">
                Enter your email and
                we&apos;ll help you get
                back into your account.
              </p>
            </div>

            <p className="text-[8px] font-medium tracking-[0.18em] text-white/30 uppercase">
              Everyday / Elevated
            </p>
          </div>

          {/* RIGHT */}
          <div className="bg-[#F8F5EF] px-5 py-9 md:px-10 md:py-12 lg:px-14 lg:py-16">
            <div className="mx-auto max-w-[430px]">

              {!submitted ? (
                <>
                  <Link
                    href="/account/login"
                    className="inline-flex items-center gap-2 text-[9px] font-medium tracking-[0.05em] text-black/40 transition-colors hover:text-black"
                  >
                    <ArrowLeft
                      size={13}
                      strokeWidth={1.5}
                    />

                    Back to login
                  </Link>

                  <div className="mt-9">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10">
                      <Mail
                        size={16}
                        strokeWidth={1.4}
                      />
                    </div>

                    <p className="mt-7 text-[8px] font-semibold tracking-[0.26em] text-black/35 uppercase md:text-[9px]">
                      Account recovery
                    </p>

                    <h1 className="mt-3 font-serif text-[40px] leading-[1.02] tracking-[-0.035em] text-[#111111] md:text-[50px]">
                      Forgot your
                      password?
                    </h1>

                    <p className="mt-4 max-w-[370px] text-[12px] leading-6 text-black/45 md:text-[13px]">
                      Enter the email address
                      connected to your Ostren Fit
                      account and we&apos;ll send you
                      instructions to reset your
                      password.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="mt-8"
                  >
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[8px] font-semibold tracking-[0.14em] text-black/40 uppercase"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className="
                        h-12
                        w-full
                        border
                        border-black/10
                        bg-transparent
                        px-4
                        text-[13px]
                        text-[#111111]
                        outline-none
                        transition-colors
                        placeholder:text-black/25
                        focus:border-black/40
                      "
                    />

                    {error && (
                      <div className="mt-4 border border-red-500/20 bg-red-500/5 px-4 py-3">
                        <p className="text-[11px] leading-5 text-red-600">
                          {error}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        mt-5
                        flex
                        h-12
                        w-full
                        items-center
                        justify-center
                        gap-3
                        bg-[#111111]
                        px-5
                        text-[9px]
                        font-semibold
                        tracking-[0.16em]
                        uppercase
                        transition-all
                        hover:bg-black/80
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <span className="!text-white">
                        {loading
                          ? "Sending..."
                          : "Send reset link"}
                      </span>

                      {!loading && (
                        <ArrowRight
                          size={14}
                          strokeWidth={1.5}
                          className="text-white"
                        />
                      )}
                    </button>
                  </form>

                  <p className="mt-7 text-center text-[10px] leading-5 text-black/35">
                    Remember your password?{" "}
                    <Link
                      href="/account/login"
                      className="font-semibold text-[#111111] underline decoration-black/25 underline-offset-4"
                    >
                      Login
                    </Link>
                  </p>
                </>
              ) : (
                /* SUCCESS STATE */
                <div className="flex min-h-[430px] flex-col justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111]">
                    <Mail
                      size={17}
                      strokeWidth={1.4}
                      className="text-white"
                    />
                  </div>

                  <p className="mt-7 text-[8px] font-semibold tracking-[0.26em] text-black/35 uppercase">
                    Check your inbox
                  </p>

                  <h1 className="mt-3 font-serif text-[40px] leading-[1.02] tracking-[-0.035em] text-[#111111] md:text-[50px]">
                    Reset link
                    <br />
                    sent.
                  </h1>

                  <p className="mt-5 max-w-[380px] text-[12px] leading-6 text-black/45 md:text-[13px]">
                    If an account exists for{" "}
                    <span className="font-medium text-[#111111]">
                      {email}
                    </span>
                    , you&apos;ll receive password
                    reset instructions shortly.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/account/login"
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
                      "
                    >
                      <span className="!text-white">
                        Back to login
                      </span>

                      <ArrowRight
                        size={14}
                        strokeWidth={1.5}
                        className="text-white"
                      />
                    </Link>

                    {/* DEV RESET LINK */}
                    <button
                      type="button"
                      onClick={() => {
                        const resetUrl =
                          localStorage.getItem(
                            "ostren-dev-reset-url"
                          );

                        if (resetUrl) {
                          window.location.href =
                            resetUrl;
                        }
                      }}
                      className="
                        h-11
                        border
                        border-black/15
                        px-5
                        text-[8px]
                        font-semibold
                        tracking-[0.14em]
                        text-black/55
                        uppercase
                        transition-colors
                        hover:border-black/40
                        hover:text-black
                      "
                    >
                      Open reset page
                    </button>
                  </div>

                  <p className="mt-5 text-[8px] leading-4 text-black/25">
                    “Open reset page” is only
                    visible for local development.
                    Production me reset link email
                    ke through send hoga.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}