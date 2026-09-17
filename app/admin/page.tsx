"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  AlertTriangle,
  Boxes,
  Layers3,
  PackageCheck,
  PackageX,
  Users,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

type DashboardStats = {
  total_products: number;
  active_products: number;
  inactive_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_categories: number;
  total_customers: number;
  total_admins: number;
};

type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(
      null
    );

  const [adminName, setAdminName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      const token =
        localStorage.getItem(
          "ostren-admin-token"
        );

      const storedAdmin =
        localStorage.getItem(
          "ostren-admin-user"
        );

      if (storedAdmin) {
        try {
          const admin: AdminUser =
            JSON.parse(storedAdmin);

          setAdminName(
            admin.full_name || ""
          );
        } catch {
          // AdminShell handles invalid auth data.
        }
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/admin/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          setError(
            data.message ||
              "Unable to load dashboard."
          );

          return;
        }

        setStats(
          data.stats
        );
      } catch {
        setError(
          "Unable to load dashboard. Make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AdminShell>

      <main className="min-h-screen">

        {/* ================================================
            PAGE HEADER
        ================================================= */}

        <header className="border-b border-black/10">

          <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center px-5 md:px-8 lg:px-10">

            <div>

              <p className="text-[7px] font-semibold tracking-[0.23em] text-black/35 uppercase">
                Ostren Fit Administration
              </p>

              <h1 className="mt-1.5 text-[23px] font-medium tracking-[-0.03em]">
                Dashboard
              </h1>

            </div>

          </div>

        </header>


        {/* ================================================
            DASHBOARD CONTENT
        ================================================= */}

        <section className="mx-auto max-w-[1500px] px-5 py-9 md:px-8 lg:px-10 lg:py-12">

          {/* INTRO */}

          <div className="mb-10">

            <p className="text-[8px] font-semibold tracking-[0.22em] text-black/35 uppercase">
              Store Overview
            </p>

            <h2 className="mt-3 text-[34px] font-medium tracking-[-0.045em] sm:text-[40px] lg:text-[46px]">

              {adminName
                ? `Welcome, ${adminName}.`
                : "Welcome back."}

            </h2>

            <p className="mt-3 max-w-lg text-[11px] leading-6 text-black/45">
              Here&apos;s what&apos;s happening
              across your Ostren Fit store.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mb-6 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

              <p className="text-[10px] leading-5 text-red-800">
                {error}
              </p>

            </div>
          )}


          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center border border-black/10">

              <div className="text-center">

                <div className="mx-auto h-5 w-5 animate-spin rounded-full border border-black/15 border-t-black" />

                <p className="mt-4 text-[8px] font-semibold tracking-[0.18em] text-black/30 uppercase">
                  Loading overview...
                </p>

              </div>

            </div>
          )}


          {/* STATS */}

          {!loading && stats && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Products"
                value={
                  stats.total_products
                }
                icon={
                  <Boxes
                    size={18}
                    strokeWidth={1.3}
                  />
                }
              />

              <StatCard
                title="Active Products"
                value={
                  stats.active_products
                }
                icon={
                  <PackageCheck
                    size={18}
                    strokeWidth={1.3}
                  />
                }
              />

              <StatCard
                title="Categories"
                value={
                  stats.total_categories
                }
                icon={
                  <Layers3
                    size={18}
                    strokeWidth={1.3}
                  />
                }
              />

              <StatCard
                title="Customers"
                value={
                  stats.total_customers
                }
                icon={
                  <Users
                    size={18}
                    strokeWidth={1.3}
                  />
                }
              />

              <StatCard
                title="Low Stock"
                value={
                  stats.low_stock_products
                }
                icon={
                  <AlertTriangle
                    size={18}
                    strokeWidth={1.3}
                  />
                }
              />

              <StatCard
                title="Out of Stock"
                value={
                  stats.out_of_stock_products
                }
                icon={
                  <PackageX
                    size={18}
                    strokeWidth={1.3}
                  />
                }
              />

              <StatCard
                title="Inactive Products"
                value={
                  stats.inactive_products
                }
                icon={
                  <PackageX
                    size={18}
                    strokeWidth={1.3}
                  />
                }
              />

              <StatCard
                title="Admins"
                value={
                  stats.total_admins
                }
                icon={
                  <Users
                    size={18}
                    strokeWidth={1.3}
                  />
                }
              />

            </div>
          )}

        </section>

      </main>

    </AdminShell>
  );
}


function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="group border border-black/10 bg-white/30 p-5 transition-colors duration-300 hover:bg-white/55 sm:p-6">

      <div className="flex items-start justify-between gap-4">

        <p className="text-[7px] font-semibold tracking-[0.18em] text-black/40 uppercase">
          {title}
        </p>

        <div className="text-black/35 transition-colors group-hover:text-black">
          {icon}
        </div>

      </div>

      <p className="mt-9 text-[38px] font-medium tracking-[-0.045em]">
        {value}
      </p>

    </div>
  );
}