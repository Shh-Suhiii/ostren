"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ArrowRight,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ProtectedAccount from "@/components/account/ProtectedAccount";

type AccountUser = {
  id?: number;
  full_name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
  is_active?: boolean;
};

function getStoredUser(): AccountUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser =
    localStorage.getItem("ostren-user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(
      storedUser
    ) as AccountUser;
  } catch {
    localStorage.removeItem(
      "ostren-user"
    );

    localStorage.removeItem(
      "ostren-access-token"
    );

    return null;
  }
}

export default function AccountPage() {
  const router = useRouter();

  const [user] =
    useState<AccountUser | null>(
      getStoredUser
    );

  const handleLogout = () => {
    localStorage.removeItem(
      "ostren-access-token"
    );

    localStorage.removeItem(
      "ostren-user"
    );

    router.replace(
      "/account/login"
    );

    router.refresh();
  };

  const firstName =
    user?.full_name
      ?.trim()
      .split(" ")[0] ||
    "there";

  const initial =
    user?.full_name
      ?.trim()
      .charAt(0)
      .toUpperCase() ||
    "O";

  return (
    <ProtectedAccount>
      <main className="min-h-screen bg-[var(--ostren-off-white)] text-[#111111]">
        <AnnouncementBar />
        <Navbar />

        <section className="border-b border-black/10">
          <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-20 lg:px-10 lg:py-24">

            {/* TOP */}
            <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">

              {/* WELCOME */}
              <div>
                <p className="text-[9px] font-medium tracking-[0.24em] text-black/40 uppercase">
                  My Account
                </p>

                <h1 className="mt-4 text-[42px] font-medium leading-none tracking-[-0.04em] sm:text-[52px] md:text-[64px]">
                  Hi, {firstName}.
                </h1>

                <p className="mt-5 text-[13px] text-black/50 md:text-sm">
                  Manage your account
                  and orders.
                </p>
              </div>

              {/* PROFILE MINI CARD */}
              <div className="flex items-center gap-4 md:flex-col md:items-end">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eeebe5] text-lg font-medium md:h-16 md:w-16">
                  {initial}
                </div>

                <div className="md:text-right">
                  <p className="max-w-[260px] truncate text-[11px] text-black/50">
                    {user?.email ||
                      "Ostren Fit account"}
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-2
                      border
                      border-black/15
                      px-4
                      py-2.5
                      text-[9px]
                      font-medium
                      tracking-[0.12em]
                      uppercase
                      transition-colors
                      hover:bg-black
                      hover:!text-white
                    "
                  >
                    <span>
                      Logout
                    </span>

                    <LogOut
                      size={13}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="mt-14 space-y-3 md:mt-16">

              <AccountRow
                href="/account/profile"
                icon={User}
                title="Personal Information"
                description="Update your details"
              />

              <AccountRow
                href="/account/addresses"
                icon={MapPin}
                title="Saved Addresses"
                description="Manage your addresses"
              />

              <AccountRow
                href="/account/orders"
                icon={Package}
                title="Orders"
                description="View your order history"
              />

            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedAccount>
  );
}

type AccountRowProps = {
  href: string;
  title: string;
  description: string;
  icon: typeof User;
};

function AccountRow({
  href,
  title,
  description,
  icon: Icon,
}: AccountRowProps) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        min-h-[100px]
        items-center
        border
        border-black/10
        bg-[#F8F5EF]
        px-5
        py-5
        transition-colors
        hover:bg-[#eeebe5]
        md:min-h-[112px]
        md:px-7
      "
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center text-black md:h-12 md:w-12">
        <Icon
          size={25}
          strokeWidth={1.35}
        />
      </div>

      <div className="ml-4 flex-1 md:ml-6">
        <h2 className="text-[15px] font-medium tracking-[-0.01em] md:text-[17px]">
          {title}
        </h2>

        <p className="mt-1 text-[11px] text-black/45 md:text-[12px]">
          {description}
        </p>
      </div>

      <ArrowRight
        size={19}
        strokeWidth={1.3}
        className="ml-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}