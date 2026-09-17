"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Menu,
  ShoppingBag,
  User,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  const { cartCount } = useCart();
  const { wishlistCount, wishlistReady } = useWishlist();

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[var(--ostren-off-white)]/95 backdrop-blur-md">
        <div className="relative mx-auto flex h-[72px] max-w-[1600px] items-center px-4 sm:px-5 md:px-8 lg:h-[78px] lg:px-10">

          {/* LEFT */}
          <div className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center text-[#111111] transition-opacity hover:opacity-50 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} strokeWidth={1.4} />
            </button>

            <nav className="hidden items-center gap-8 lg:flex">
              <NavLink href="/shop">Shop</NavLink>
              <NavLink href="/categories">Categories</NavLink>
              <NavLink href="/customize">Customize</NavLink>
              <NavLink href="/about">About</NavLink>
            </nav>
          </div>

          {/* LOGO */}
          <Link
            href="/"
            aria-label="Ostren Fit home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src="/logo/ostren-logo.png"
              alt="Ostren Fit"
              width={180}
              height={120}
              className="h-auto w-[74px] object-contain md:w-[90px] lg:w-[96px]"
              priority
              unoptimized
            />
          </Link>

          {/* RIGHT */}
          <div className="ml-auto flex flex-1 items-center justify-end gap-4 md:gap-5">

            <Link
              href="/account"
              aria-label="Account"
              className="hidden transition-opacity hover:opacity-50 sm:inline-flex"
            >
              <User size={19} strokeWidth={1.4} />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden transition-opacity hover:opacity-50 sm:inline-flex"
            >
              <Heart size={19} strokeWidth={1.4} />

              {mounted && wishlistReady && wishlistCount > 0 && (
                <CountBadge count={wishlistCount} />
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative inline-flex transition-opacity hover:opacity-50"
            >
              <ShoppingBag size={19} strokeWidth={1.4} />

              {mounted && cartCount > 0 && (
                <CountBadge count={cartCount} />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* BACKDROP */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`
          fixed left-0 top-0 z-[70]
          h-[100dvh] w-[86%] max-w-[360px]
          bg-[var(--ostren-off-white)]
          shadow-2xl
          transition-transform duration-300 ease-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* DRAWER HEADER */}
        <div className="flex h-[72px] items-center justify-between border-b border-black/10 px-5">
          <p className="text-[9px] font-semibold tracking-[0.22em] text-black/45 uppercase">
            Ostren Fit
          </p>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-black hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={1.4} />
          </button>
        </div>

        {/* LINKS */}
        <nav className="px-5 pt-4">
          <MobileLink
            href="/shop"
            label="Shop"
            onClick={() => setMobileOpen(false)}
          />

          <MobileLink
            href="/categories"
            label="Categories"
            onClick={() => setMobileOpen(false)}
          />

          <MobileLink
            href="/customize"
            label="Customize"
            onClick={() => setMobileOpen(false)}
            featured
          />

          <MobileLink
            href="/about"
            label="About"
            onClick={() => setMobileOpen(false)}
          />

          <MobileLink
            href="/contact"
            label="Contact"
            onClick={() => setMobileOpen(false)}
          />
        </nav>

        {/* CUSTOM CTA */}
        <div className="px-5 pt-7">
          <Link
            href="/customize"
            onClick={() => setMobileOpen(false)}
            className="group flex min-h-[52px] items-center justify-between bg-[#111111] px-5 text-[9px] font-semibold tracking-[0.16em] !text-white uppercase"
          >
            Create Your Own

            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* ACCOUNT ACTIONS */}
        <div className="absolute inset-x-0 bottom-0 border-t border-black/10 bg-[var(--ostren-off-white)] px-5 py-5">
          <div className="grid grid-cols-4 gap-2">

            <MobileAction
              href="/account"
              label="Account"
              onClick={() => setMobileOpen(false)}
            >
              <User size={18} strokeWidth={1.4} />
            </MobileAction>

            <MobileAction
              href="/wishlist"
              label="Wishlist"
              onClick={() => setMobileOpen(false)}
            >
              <Heart size={18} strokeWidth={1.4} />
            </MobileAction>

            <MobileAction
              href="/cart"
              label="Cart"
              onClick={() => setMobileOpen(false)}
            >
              <ShoppingBag size={18} strokeWidth={1.4} />
            </MobileAction>
          </div>
        </div>
      </aside>
    </>
  );
}


/* =========================================================
   DESKTOP LINK
   ========================================================= */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[10px] font-medium tracking-[0.15em] text-[#111111] uppercase transition-opacity hover:opacity-50"
    >
      {children}
    </Link>
  );
}


/* =========================================================
   MOBILE LINK
   ========================================================= */

function MobileLink({
  href,
  label,
  onClick,
  featured = false,
}: {
  href: string;
  label: string;
  onClick: () => void;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        group flex min-h-[58px]
        items-center justify-between
        border-b border-black/10
        text-[11px] font-medium
        tracking-[0.14em]
        text-[#111111] uppercase
      "
    >
      <span>{label}</span>

      {featured && (
        <span className="text-[7px] tracking-[0.14em] text-black/35">
          CUSTOM
        </span>
      )}
    </Link>
  );
}


/* =========================================================
   MOBILE ACTION
   ========================================================= */

function MobileAction({
  href,
  label,
  children,
  onClick,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 py-2 text-black/70"
    >
      {children}

      <span className="text-[7px] tracking-[0.08em] uppercase">
        {label}
      </span>
    </Link>
  );
}


/* =========================================================
   COUNT BADGE
   ========================================================= */

function CountBadge({
  count,
}: {
  count: number;
}) {
  return (
    <span className="absolute -right-2.5 -top-2.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#111111] px-1 text-[8px] font-semibold text-white">
      {count}
    </span>
  );
}