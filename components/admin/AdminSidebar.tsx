"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  ExternalLink,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  PackageCheck,
  Users,
  X,
} from "lucide-react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { useState } from "react";


type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};


const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: PackageCheck,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Boxes,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers3,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
];


export default function AdminSidebar({
  admin,
}: {
  admin: AdminUser | null;
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  function handleLogout() {
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


  function isActive(
    href: string
  ) {
    if (href === "/admin") {
      return (
        pathname === "/admin"
      );
    }

    return pathname.startsWith(
      href
    );
  }


  return (
    <>
      {/* ================================================
          MOBILE HEADER
      ================================================= */}

      <header className="fixed inset-x-0 top-0 z-40 flex h-[64px] items-center justify-between border-b border-black/10 bg-[var(--ostren-off-white)] px-5 lg:hidden">

        <Link
          href="/admin"
          aria-label="Ostren Fit Admin"
        >
          <Image
            src="/logo/ostren-logo.png"
            alt="Ostren Fit"
            width={120}
            height={70}
            className="h-auto w-[68px]"
            priority
          />
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(true)
          }
          className="flex h-9 w-9 items-center justify-center border border-black/10"
          aria-label="Open admin menu"
        >
          <Menu
            size={18}
            strokeWidth={1.4}
          />
        </button>

      </header>


      {/* ================================================
          MOBILE BACKDROP
      ================================================= */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px] lg:hidden"
        />
      )}


      {/* ================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed left-0 top-0 z-[60]
          flex h-[100dvh] w-[270px]
          flex-col
          bg-[#111111]
          text-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ================================================
            LOGO
        ================================================= */}

        <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">

          <Link
            href="/admin"
            onClick={() =>
              setMobileOpen(false)
            }
            aria-label="Admin dashboard"
          >
            <Image
              src="/logo/ostren-logo.png"
              alt="Ostren Fit"
              width={150}
              height={90}
              className="h-auto w-[78px] brightness-0 invert"
              priority
            />
          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(false)
            }
            className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/70 lg:hidden"
            aria-label="Close admin menu"
          >
            <X
              size={17}
              strokeWidth={1.4}
            />
          </button>

        </div>


        {/* ================================================
            NAVIGATION
        ================================================= */}

        <div className="flex-1 overflow-y-auto px-4 py-7">

          <p className="mb-3 px-3 text-[7px] font-semibold tracking-[0.24em] text-white/30 uppercase">
            Overview
          </p>

          <nav className="space-y-1">

            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  isActive(
                    item.href
                  );

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className={`
                      group
                      flex h-[48px]
                      items-center
                      gap-3
                      px-3
                      text-[9px]
                      font-medium
                      tracking-[0.13em]
                      uppercase
                      transition
                      ${
                        active
                          ? "bg-white !text-black"
                          : "!text-white/55 hover:bg-white/5 hover:!text-white"
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={
                        1.4
                      }
                    />

                    <span>
                      {
                        item.label
                      }
                    </span>
                  </Link>
                );
              }
            )}

          </nav>


          {/* ================================================
              STORE
          ================================================= */}

          <div className="mt-9">

            <p className="mb-3 px-3 text-[7px] font-semibold tracking-[0.24em] text-white/30 uppercase">
              Store
            </p>

            <Link
              href="/"
              target="_blank"
              className="group flex h-[48px] items-center justify-between px-3 text-[9px] font-medium tracking-[0.13em] !text-white/55 uppercase transition hover:bg-white/5 hover:!text-white"
            >
              <span className="flex items-center gap-3">

                <ExternalLink
                  size={16}
                  strokeWidth={
                    1.4
                  }
                />

                View Store

              </span>

            </Link>

          </div>

        </div>


        {/* ================================================
            ADMIN PROFILE
        ================================================= */}

        <div className="border-t border-white/10 p-4">

          <div className="mb-3 flex items-center gap-3 px-2 py-2">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-black">

              {admin
                ?.full_name
                ?.charAt(0)
                .toUpperCase() ||
                "A"}

            </div>

            <div className="min-w-0">

              <p className="truncate text-[10px] font-medium text-white">
                {admin
                  ?.full_name ||
                  "Administrator"}
              </p>

              <p className="mt-1 text-[7px] tracking-[0.14em] text-white/35 uppercase">
                Administrator
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={
              handleLogout
            }
            className="flex h-[46px] w-full items-center gap-3 border border-white/10 px-3 text-[8px] font-medium tracking-[0.14em] text-white/50 uppercase transition hover:bg-white hover:text-black"
          >
            <LogOut
              size={15}
              strokeWidth={
                1.4
              }
            />

            Logout
          </button>

        </div>

      </aside>
    </>
  );
}