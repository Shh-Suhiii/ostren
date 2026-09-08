"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid email or password."
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

      router.push("/account");
      router.refresh();
    } catch {
      setError(
        "Unable to connect to the ostren server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <AnnouncementBar />
      <Navbar />

      <section className="flex min-h-[70vh] items-center justify-center px-5 py-20">
        <div className="w-full max-w-md bg-white p-7 md:p-9">

          <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
            Welcome back
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#022a46]">
            Login
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="h-12 w-full border border-black/10 px-4 outline-none focus:border-[#063b63]/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="h-12 w-full border border-black/10 px-4 outline-none focus:border-[#063b63]/40"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full bg-[#063b63] text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <p className="mt-6 text-center text-xs text-black/45">
            New to ostren?{" "}
            <Link
              href="/account/register"
              className="font-medium text-[#063b63]"
            >
              Create account
            </Link>
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}