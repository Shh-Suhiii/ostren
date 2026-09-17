"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";


type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  role: string;
  is_active: boolean;
};


type LoginResponse = {
  success: boolean;
  message?: string;
  access_token?: string;
  user?: AdminUser;
};


export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError(
        "Please enter your admin email."
      );

      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password,
          }),
        }
      );

      const data: LoginResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.access_token ||
        !data.user
      ) {
        setError(
          data.message ||
            "Unable to sign in."
        );

        return;
      }

      if (data.user.role !== "admin") {
        setError(
          "This account does not have admin access."
        );

        return;
      }

      localStorage.setItem(
        "ostren-admin-token",
        data.access_token
      );

      localStorage.setItem(
        "ostren-admin-user",
        JSON.stringify(
          data.user
        )
      );

      router.replace(
        "/admin"
      );

      router.refresh();
    } catch {
      setError(
        "Unable to connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-[var(--ostren-off-white)] text-[#111111]">

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* =================================================
            LEFT PANEL
        ================================================= */}

        <section className="relative hidden overflow-hidden bg-[#111111] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

          {/* BACKGROUND DETAILS */}

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full border border-white/10" />

            <div className="absolute -left-16 -top-16 h-[280px] w-[280px] rounded-full border border-white/10" />

            <div className="absolute bottom-[-220px] right-[-160px] h-[520px] w-[520px] rounded-full border border-white/10" />

            <div className="absolute bottom-[-110px] right-[-50px] h-[300px] w-[300px] rounded-full border border-white/10" />

          </div>


          {/* BRAND */}

          <div className="relative z-10">

            <Image
              src="/logo/ostren-logo.png"
              alt="Ostren Fit"
              width={220}
              height={130}
              className="h-auto w-[105px] brightness-0 invert"
              priority
            />

          </div>


          {/* MAIN CONTENT */}

          <div className="relative z-10 max-w-xl">

            <p className="mb-5 text-[9px] font-semibold tracking-[0.28em] text-white/45 uppercase">
              Ostren Fit Administration
            </p>

            <h1 className="max-w-lg text-[52px] font-medium leading-[0.98] tracking-[-0.045em] xl:text-[66px]">
              Control your
              <br />
              store from one
              <br />
              place.
            </h1>

            <p className="mt-8 max-w-md text-[13px] leading-7 text-white/50">
              Manage products, inventory,
              categories and customers
              through your private Ostren Fit
              dashboard.
            </p>

          </div>


          {/* FOOTER */}

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">

            <p className="text-[8px] tracking-[0.18em] text-white/30 uppercase">
              Private Access
            </p>

            <div className="flex items-center gap-2 text-[8px] tracking-[0.16em] text-white/40 uppercase">

              <LockKeyhole
                size={12}
                strokeWidth={1.4}
              />

              Protected Dashboard

            </div>

          </div>

        </section>


        {/* =================================================
            LOGIN PANEL
        ================================================= */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-[430px]">

            {/* MOBILE LOGO */}

            <div className="mb-12 lg:hidden">

              <Image
                src="/logo/ostren-logo.png"
                alt="Ostren Fit"
                width={180}
                height={100}
                className="h-auto w-[88px]"
                priority
              />

            </div>


            {/* HEADER */}

            <div>

              <p className="text-[9px] font-semibold tracking-[0.24em] text-black/35 uppercase">
                Admin Portal
              </p>

              <h2 className="mt-3 text-[34px] font-medium tracking-[-0.035em] sm:text-[40px]">
                Welcome back.
              </h2>

              <p className="mt-3 max-w-sm text-[12px] leading-6 text-black/45">
                Sign in using your administrator
                account to manage Ostren Fit.
              </p>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="admin-email"
                  className="mb-2.5 block text-[8px] font-semibold tracking-[0.17em] text-black/45 uppercase"
                >
                  Email Address
                </label>

                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="admin@ostrenfit.com"
                  className="
                    h-[54px]
                    w-full
                    border
                    border-black/15
                    bg-transparent
                    px-4
                    text-[12px]
                    text-[#111111]
                    outline-none
                    transition
                    placeholder:text-black/25
                    focus:border-black
                  "
                />

              </div>


              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="admin-password"
                  className="mb-2.5 block text-[8px] font-semibold tracking-[0.17em] text-black/45 uppercase"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="admin-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    className="
                      h-[54px]
                      w-full
                      border
                      border-black/15
                      bg-transparent
                      px-4
                      pr-12
                      text-[12px]
                      text-[#111111]
                      outline-none
                      transition
                      placeholder:text-black/25
                      focus:border-black
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
                    className="absolute right-0 top-0 flex h-[54px] w-[50px] items-center justify-center text-black/40 transition hover:text-black"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff
                        size={17}
                        strokeWidth={1.4}
                      />
                    ) : (
                      <Eye
                        size={17}
                        strokeWidth={1.4}
                      />
                    )}

                  </button>

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

                  <p className="text-[10px] leading-5 text-red-800">
                    {error}
                  </p>

                </div>
              )}


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  h-[56px]
                  w-full
                  items-center
                  justify-between
                  bg-[#111111]
                  px-5
                  text-[9px]
                  font-semibold
                  tracking-[0.18em]
                  !text-white
                  uppercase
                  transition
                  hover:bg-black/85
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <span className="!text-white">
                  {loading
                    ? "Signing in..."
                    : "Sign in to dashboard"}
                </span>

                {!loading && (
                  <ArrowRight
                    size={16}
                    strokeWidth={1.4}
                    className="text-white transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>


            {/* SECURITY NOTE */}

            <div className="mt-8 border-t border-black/10 pt-6">

              <div className="flex items-start gap-3">

                <LockKeyhole
                  size={14}
                  strokeWidth={1.3}
                  className="mt-0.5 shrink-0 text-black/35"
                />

                <p className="text-[9px] leading-5 text-black/35">
                  This area is restricted to
                  authorized Ostren Fit
                  administrators only.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}