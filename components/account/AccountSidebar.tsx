"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin,
  Package,
  User,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const links = [
  {
    href: "/account/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: Package,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="h-fit border border-black/10 bg-white p-5 md:p-6">
      <p className="mb-5 text-[9px] font-semibold tracking-[0.18em] text-black/35 uppercase">
        My account
      </p>

      <div className="flex flex-col gap-2">
        {links.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 text-sm transition-colors ${
                active
                  ? "bg-[#e9f4f9] text-[#063b63]"
                  : "text-black/55 hover:bg-black/[0.03]"
              }`}
            >
              <Icon
                size={16}
                strokeWidth={1.5}
              />
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex items-center gap-3 border-t border-black/10 px-3 pt-4 text-sm text-black/45 transition-colors hover:text-red-500"
        >
          <LogOut
            size={16}
            strokeWidth={1.5}
          />
          Logout
        </button>
      </div>
    </aside>
  );
}