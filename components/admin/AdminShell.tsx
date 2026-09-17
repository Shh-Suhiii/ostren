"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active?: boolean;
};

type AdminMeResponse = {
  success: boolean;
  user?: AdminUser;
};

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [admin, setAdmin] =
    useState<AdminUser | null>(
      null
    );

  const [checking, setChecking] =
    useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      const token =
        localStorage.getItem(
          "ostren-admin-token"
        );

      if (!token) {
        router.replace(
          "/admin/login"
        );

        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/admin/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data: AdminMeResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.user ||
          data.user.role !== "admin"
        ) {
          localStorage.removeItem(
            "ostren-admin-token"
          );

          localStorage.removeItem(
            "ostren-admin-user"
          );

          router.replace(
            "/admin/login"
          );

          return;
        }

        localStorage.setItem(
          "ostren-admin-user",
          JSON.stringify(
            data.user
          )
        );

        setAdmin(
          data.user
        );

        setChecking(
          false
        );
      } catch {
        localStorage.removeItem(
          "ostren-admin-token"
        );

        localStorage.removeItem(
          "ostren-admin-user"
        );

        router.replace(
          "/admin/login"
        );
      }
    }

    verifyAdmin();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ostren-off-white)]">

        <div className="text-center">

          <div className="mx-auto h-5 w-5 animate-spin rounded-full border border-black/15 border-t-black" />

          <p className="mt-4 text-[8px] font-semibold tracking-[0.2em] text-black/35 uppercase">
            Verifying admin...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ostren-off-white)] text-[#111111]">

      <AdminSidebar
        admin={admin}
      />

      <div className="min-h-screen pt-[64px] lg:ml-[270px] lg:pt-0">

        {children}

      </div>

    </div>
  );
}