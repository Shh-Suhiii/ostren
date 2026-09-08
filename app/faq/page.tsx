"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const faqs = [
    {
        question: "How can I place an order?",
        answer:
            "Browse the ostren collection, open a product, select the quantity, add it to your cart and continue to checkout.",
    },
    {
        question: "Do I need an account to shop?",
        answer:
            "For the final platform, customers will be able to create an ostren account to manage addresses, orders and profile information.",
    },
    {
        question: "How much is shipping?",
        answer:
            "Standard shipping is currently shown as ₹99, while orders above ₹999 qualify for free shipping. Final shipping rules can be updated later.",
    },
    {
        question: "How can I track my order?",
        answer:
            "Order tracking will be available once the shipping provider integration is added to the platform.",
    },
    {
        question: "Can I cancel or return an order?",
        answer:
            "Returns and cancellations will follow ostren's approved return and refund policy. Advanced return management can be added as a separate module.",
    },
    {
        question: "Which payment methods are available?",
        answer:
            "Payment gateway integration is not enabled in the current Phase 1 frontend. Razorpay or another approved provider can be added later.",
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] =
        useState<number | null>(0);

    return (
        <main className="min-h-screen bg-[#fafaf8]">
            <AnnouncementBar />
            <Navbar />

            <section className="px-5 py-16 md:px-8 md:py-24 lg:px-12">
                <div className="mx-auto max-w-[900px]">

                    <div className="text-center">
                        <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
                            Help
                        </p>

                        <h1 className="mt-4 font-serif text-5xl tracking-[-0.025em] text-[#022a46] md:text-7xl">
                            Frequently asked questions
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-black/50">
                            Everything you need to know about shopping with ostren.
                        </p>
                    </div>

                    <div className="mt-12 border-t border-black/10">

                        {faqs.map((faq, index) => {
                            const open = openIndex === index;

                            return (
                                <div
                                    key={faq.question}
                                    className="border-b border-black/10"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenIndex(open ? null : index)
                                        }
                                        className="flex w-full items-center justify-between gap-5 py-6 text-left"
                                    >
                                        <span className="font-serif text-xl text-[#022a46] md:text-2xl">
                                            {faq.question}
                                        </span>

                                        <ChevronDown
                                            size={18}
                                            strokeWidth={1.5}
                                            className={`shrink-0 text-[#063b63] transition-transform ${open ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {open && (
                                        <p className="max-w-2xl pb-6 text-sm leading-7 text-black/50">
                                            {faq.answer}
                                        </p>
                                    )}
                                </div>
                            );
                        })}

                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}