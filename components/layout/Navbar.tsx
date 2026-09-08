"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const { cartCount } = useCart();

  const {
    wishlistCount,
    wishlistReady,
  } = useWishlist();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
        <div className="relative mx-auto flex h-[78px] max-w-[1600px] items-center px-5 md:px-8 lg:px-10">

          {/* LEFT */}
          <div className="flex flex-1 items-center">

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex items-center justify-center transition-opacity hover:opacity-50 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X size={22} strokeWidth={1.4} />
              ) : (
                <Menu size={22} strokeWidth={1.4} />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 lg:flex">
              <Link
                href="/shop"
                className="text-[11px] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-50"
              >
                Shop
              </Link>

              <Link
                href="/categories"
                className="text-[11px] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-50"
              >
                Categories
              </Link>

              <Link
                href="/about"
                className="text-[11px] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-50"
              >
                About
              </Link>
            </nav>
          </div>

          {/* CENTER LOGO */}
          <Link
            href="/"
            aria-label="Ostren Fit home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src="/logo/ostren-logo.png"
              alt="Ostren Fit"
              width={120}
              height={60}
              className="h-auto w-[88px] object-contain md:w-[102px]"
              priority
            />
          </Link>

          {/* RIGHT ACTIONS */}
          <div className="ml-auto flex flex-1 items-center justify-end gap-4 md:gap-5">

            <Link
              href="/search"
              aria-label="Search"
              className="hidden transition-opacity hover:opacity-50 sm:inline-flex"
            >
              <Search size={20} strokeWidth={1.4} />
            </Link>

            <Link
              href="/account"
              aria-label="Account"
              className="hidden transition-opacity hover:opacity-50 sm:inline-flex"
            >
              <User size={20} strokeWidth={1.4} />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden transition-opacity hover:opacity-50 sm:inline-flex"
            >
              <Heart size={20} strokeWidth={1.4} />

              {mounted &&
                wishlistReady &&
                wishlistCount > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-black px-1 text-[8px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative inline-flex transition-opacity hover:opacity-50"
            >
              <ShoppingBag size={20} strokeWidth={1.4} />

              {mounted && cartCount > 0 && (
                <span className="absolute -right-2.5 -top-2.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-black px-1 text-[8px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[78px] z-40 border-b border-black/10 bg-white lg:hidden">
          <div className="px-5 py-7">

            <nav className="flex flex-col">

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

            <div className="mt-7 flex items-center gap-6 border-t border-black/10 pt-6">

              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.4} />
              </Link>

              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.4} />
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.4} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="border-b border-black/10 py-5 text-[12px] font-medium tracking-[0.14em] uppercase"
    >
      {label}
    </Link>
  );
}