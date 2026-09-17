"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


function ResetPasswordForm() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token") || "";

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    checkingToken,
    setCheckingToken,
  ] = useState(true);

  const [
    tokenValid,
    setTokenValid,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);


  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError(
          "Invalid password reset link."
        );

        setCheckingToken(false);
        return;
      }

      try {
        const apiUrl =
          process.env
            .NEXT_PUBLIC_API_URL ||
          "http://127.0.0.1:5000";

        const response =
          await fetch(
            `${apiUrl}/api/auth/verify-reset-token`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                token,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Invalid or expired reset link."
          );

          setTokenValid(false);
          return;
        }

        setTokenValid(true);
      } catch {
        setError(
          "Unable to verify reset link."
        );
      } finally {
        setCheckingToken(false);
      }
    };

    verifyToken();
  }, [token]);


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    setLoading(true);

    try {
      const apiUrl =
        process.env
          .NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:5000";

      const response =
        await fetch(
          `${apiUrl}/api/auth/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              token,
              password,
              confirm_password:
                confirmPassword,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to reset password."
        );

        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push(
          "/account/login"
        );
      }, 1800);

    } catch {
      setError(
        "Unable to connect to the Ostren Fit server."
      );
    } finally {
      setLoading(false);
    }
  };


  if (checkingToken) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <p className="text-[9px] font-medium tracking-[0.18em] text-black/40 uppercase">
          Checking reset link...
        </p>
      </div>
    );
  }


  if (!tokenValid) {
    return (
      <div className="flex min-h-[460px] flex-col justify-center">
        <p className="text-[8px] font-semibold tracking-[0.26em] text-black/35 uppercase">
          Reset link
        </p>

        <h1 className="mt-3 font-serif text-[42px] leading-[1] tracking-[-0.035em] text-[#111111]">
          Link expired.
        </h1>

        <p className="mt-5 max-w-[360px] text-[12px] leading-6 text-black/45">
          {error ||
            "This password reset link is invalid or has expired."}
        </p>

        <Link
          href="/account/forgot-password"
          className="mt-8 inline-flex h-11 w-fit items-center gap-3 bg-[#111111] px-6 text-[9px] font-semibold tracking-[0.16em] !text-white uppercase"
        >
          <span className="!text-white">
            Request new link
          </span>

          <ArrowRight
            size={14}
            className="text-white"
          />
        </Link>
      </div>
    );
  }


  if (success) {
    return (
      <div className="flex min-h-[460px] flex-col justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111]">
          <LockKeyhole
            size={17}
            className="text-white"
          />
        </div>

        <p className="mt-7 text-[8px] font-semibold tracking-[0.26em] text-black/35 uppercase">
          Password updated
        </p>

        <h1 className="mt-3 font-serif text-[42px] leading-[1] tracking-[-0.035em] text-[#111111]">
          You&apos;re all set.
        </h1>

        <p className="mt-5 text-[12px] leading-6 text-black/45">
          Your password has been
          changed successfully.
          Redirecting you to login...
        </p>
      </div>
    );
  }


  return (
    <>
      <p className="text-[8px] font-semibold tracking-[0.26em] text-black/35 uppercase">
        Account recovery
      </p>

      <h1 className="mt-3 font-serif text-[42px] leading-[1] tracking-[-0.035em] text-[#111111] md:text-[50px]">
        Create a new
        <br />
        password.
      </h1>

      <p className="mt-4 max-w-[360px] text-[12px] leading-6 text-black/45 md:text-[13px]">
        Choose a new password for your
        Ostren Fit account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="mb-2 block text-[8px] font-semibold tracking-[0.14em] text-black/40 uppercase">
            New password
          </label>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              minLength={6}
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              className="h-12 w-full border border-black/10 bg-transparent pl-4 pr-12 text-[13px] outline-none focus:border-black/40"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </div>


        <div>
          <label className="mb-2 block text-[8px] font-semibold tracking-[0.14em] text-black/40 uppercase">
            Confirm password
          </label>

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              className="h-12 w-full border border-black/10 bg-transparent pl-4 pr-12 text-[13px] outline-none focus:border-black/40"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35"
            >
              {showConfirmPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </div>


        {error && (
          <div className="border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-[11px] leading-5 text-red-600">
              {error}
            </p>
          </div>
        )}


        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-3 bg-[#111111] px-5 text-[9px] font-semibold tracking-[0.16em] uppercase transition-all hover:bg-black/80 disabled:opacity-50"
        >
          <span className="!text-white">
            {loading
              ? "Updating..."
              : "Update password"}
          </span>

          {!loading && (
            <ArrowRight
              size={14}
              className="text-white"
            />
          )}
        </button>
      </form>
    </>
  );
}


export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[var(--ostren-off-white)]">
      <AnnouncementBar />
      <Navbar />

      <section className="px-5 py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 overflow-hidden border border-black/10 lg:grid-cols-[0.9fr_1fr]">

          <div className="hidden min-h-[590px] flex-col justify-between bg-[#111111] p-10 text-white lg:flex">
            <p className="text-[9px] font-medium tracking-[0.24em] text-white/40 uppercase">
              Ostren Fit
            </p>

            <div>
              <p className="font-serif text-[54px] leading-[1.02] tracking-[-0.04em]">
                A fresh
                <br />
                start.
              </p>

              <p className="mt-6 max-w-[320px] text-[13px] leading-6 text-white/55">
                Set a new password
                and get back to your
                Ostren Fit account.
              </p>
            </div>

            <p className="text-[8px] font-medium tracking-[0.18em] text-white/30 uppercase">
              Everyday / Elevated
            </p>
          </div>


          <div className="bg-[#F8F5EF] px-5 py-9 md:px-10 md:py-12 lg:px-14 lg:py-16">
            <div className="mx-auto max-w-[430px]">
              <Suspense
                fallback={
                  <p className="text-[9px] text-black/40">
                    Loading...
                  </p>
                }
              >
                <ResetPasswordForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}