"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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
        `${apiUrl}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid email or password."
        );

        return;
      }

      if (
        !data.access_token ||
        !data.user
      ) {
        setError(
          "Invalid response from server."
        );

        return;
      }

      localStorage.setItem(
        "ostren-access-token",
        data.access_token
      );

      localStorage.setItem(
        "ostren-user",
        JSON.stringify(data.user)
      );

      /*
        Hard redirect:
        AuthContext / ProtectedAccount
        fresh localStorage read karega.
      */
      window.location.href =
        "/account";
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
          {/* LEFT BRAND PANEL */}
          <div className="hidden min-h-[620px] flex-col justify-between bg-[#111111] p-10 text-white lg:flex">
            <div>
              <p className="text-[9px] font-medium tracking-[0.24em] text-white/40 uppercase">
                Ostren Fit
              </p>
            </div>

            <div>
              <p className="font-serif text-[56px] leading-[1.02] tracking-[-0.04em]">
                Welcome
                <br />
                back.
              </p>

              <p className="mt-6 max-w-[320px] text-[13px] leading-6 text-white/55">
                Sign in to manage your
                profile, wishlist and
                orders.
              </p>
            </div>

            <p className="text-[8px] font-medium tracking-[0.18em] text-white/30 uppercase">
              Everyday / Elevated
            </p>
          </div>

          {/* FORM */}
          <div className="bg-[#F8F5EF] px-5 py-9 md:px-10 md:py-12 lg:px-14 lg:py-16">
            <div className="mx-auto max-w-[430px]">
              <p className="text-[8px] font-semibold tracking-[0.26em] text-black/35 uppercase md:text-[9px]">
                Welcome back
              </p>

              <h1 className="mt-3 font-serif text-[42px] leading-none tracking-[-0.035em] text-[#111111] md:text-[52px]">
                Login
              </h1>

              <p className="mt-4 max-w-[360px] text-[12px] leading-6 text-black/45 md:text-[13px]">
                Sign in to continue to your
                Ostren Fit account.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* EMAIL */}
                <div>
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
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[8px] font-semibold tracking-[0.14em] text-black/40 uppercase"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter your password"
                      className="
                        h-12
                        w-full
                        border
                        border-black/10
                        bg-transparent
                        pl-4
                        pr-12
                        text-[13px]
                        text-[#111111]
                        outline-none
                        transition-colors
                        placeholder:text-black/25
                        focus:border-black/40
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35 transition-colors hover:text-black/70"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={16}
                          strokeWidth={1.5}
                        />
                      ) : (
                        <Eye
                          size={16}
                          strokeWidth={1.5}
                        />
                      )}
                    </button>
                  </div>

                  {/* FORGOT PASSWORD */}
                  <div className="mt-3 flex justify-end">
                    <Link
                      href="/account/forgot-password"
                      className="
                        text-[9px]
                        font-medium
                        tracking-[0.04em]
                        text-black/45
                        underline
                        decoration-black/20
                        underline-offset-4
                        transition-colors
                        hover:text-[#111111]
                        hover:decoration-black
                      "
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-[11px] leading-5 text-red-600">
                      {error}
                    </p>
                  </div>
                )}

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
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
                      ? "Logging in..."
                      : "Login"}
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

              {/* REGISTER */}
              <div className="mt-7 border-t border-black/10 pt-6">
                <p className="text-center text-[11px] text-black/45">
                  New to Ostren Fit?{" "}
                  <Link
                    href="/account/register"
                    className="font-semibold text-[#111111] underline decoration-black/25 underline-offset-4 transition-colors hover:decoration-black"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              {/* SMALL FOOTER */}
              <p className="mt-8 text-center text-[8px] leading-4 text-black/25">
                By continuing, you agree to
                our terms and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}