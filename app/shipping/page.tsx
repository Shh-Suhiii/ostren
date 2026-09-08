import AnnouncementBar from "@/components/layout/AnnouncementBar";

import Navbar from "@/components/layout/Navbar";

import Footer from "@/components/layout/Footer";

export default function ShippingPage() {

    return (

        <main className="min-h-screen bg-[#fafaf8]">

            <AnnouncementBar />

            <Navbar />

            <section className="px-5 py-16 md:px-8 md:py-24 lg:px-12">

                <div className="mx-auto max-w-[900px]">

                    <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">

                        Customer care

                    </p>

                    <h1 className="mt-4 font-serif text-5xl tracking-[-0.025em] text-[#022a46] md:text-7xl">

                        Shipping & Returns

                    </h1>

                    <div className="mt-12 space-y-10 text-sm leading-7 text-black/55">

                        <PolicySection title="Shipping">

                            ostren aims to process orders within a reasonable

                            timeframe after order confirmation. Delivery times may

                            vary depending on the customer&apos;s location and the

                            selected shipping provider.

                        </PolicySection>

                        <PolicySection title="Shipping Charges">

                            Standard shipping is currently shown as ₹99. Orders above

                            ₹999 may qualify for free shipping. Final shipping charges

                            will be confirmed during checkout.

                        </PolicySection>

                        <PolicySection title="Order Tracking">

                            Tracking information will be provided once courier

                            integration is enabled. Customers will be able to view

                            shipment status from their order details.

                        </PolicySection>

                        <PolicySection title="Returns">

                            Eligible products may be returned according to ostren&apos;s

                            approved return policy. Products should generally be

                            returned unused and in their original condition.

                        </PolicySection>

                        <PolicySection title="Refunds">

                            Refund processing timelines depend on the payment method

                            and payment provider. Advanced refund automation can be

                            integrated later.

                        </PolicySection>

                        <PolicySection title="Important Note">

                            This page contains temporary policy content for the Phase 1

                            website. Final shipping, return and refund terms should be

                            reviewed and approved by the business before launch.

                        </PolicySection>

                    </div>

                </div>

            </section>

            <Footer />

        </main>

    );

}

function PolicySection({

    title,

    children,

}: {

    title: string;

    children: React.ReactNode;

}) {

    return (

        <section className="border-b border-black/10 pb-8">

            <h2 className="font-serif text-2xl text-[#022a46] md:text-3xl">

                {title}

            </h2>

            <p className="mt-4">{children}</p>

        </section>

    );

}