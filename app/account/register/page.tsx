"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
        `${apiUrl}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to create your account."
        );

        return;
      }

      router.push(
        "/account/login?registered=1"
      );
    } catch {
      setError(
        "Unable to connect to the Ostrin server."
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
            Join Ostrin
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#022a46]">
            Create account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <Field
              label="Full name"
              value={fullName}
              onChange={setFullName}
            />

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
            />

            <Field
              label="Phone"
              type="tel"
              value={phone}
              onChange={setPhone}
            />

            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />

            {error && (
              <p className="text-xs leading-5 text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full bg-[#063b63] text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          <p className="mt-6 text-center text-xs text-black/45">
            Already have an account?{" "}
            <Link
              href="/account/login"
              className="font-medium text-[#063b63]"
            >
              Login
            </Link>
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
}: FieldProps) {
  return (
    <div>

      <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
        {label}
      </label>

      <input
        type={type}
        required
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-12 w-full border border-black/10 px-4 outline-none focus:border-[#063b63]/40"
      />

    </div>
  );
}