// app/account/orders/page.tsx
"use client";

import { Package } from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedAccount from "@/components/account/ProtectedAccount";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function OrdersPage() {
  return (
    <ProtectedAccount>
      <main className="min-h-screen bg-[#fafaf8]">
        <AnnouncementBar />
        <Navbar />

        <section className="px-5 py-14 md:px-8 md:py-20 lg:px-12">
          <div className="mx-auto max-w-[1200px]">

            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
              My account
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#022a46] md:text-6xl">
              Orders
            </h1>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">

              <AccountSidebar />

              <div className="flex min-h-[400px] flex-col items-center justify-center bg-white p-8 text-center">

                <Package
                  size={30}
                  strokeWidth={1.4}
                  className="text-[#063b63]"
                />

                <h2 className="mt-5 font-serif text-3xl text-[#022a46]">
                  No orders yet.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-black/45">
                  Your future ostren orders will appear here.
                </p>

              </div>

            </div>

          </div>
        </section>

        <Footer />
      </main>
    </ProtectedAccount>
  );
}