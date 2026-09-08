import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <AnnouncementBar />
      <Navbar />

      <section className="px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[900px]">

          <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
            Legal
          </p>

          <h1 className="mt-4 font-serif text-5xl tracking-[-0.025em] text-[#022a46] md:text-7xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 text-sm text-black/40">
            Last updated: August 2026
          </p>

          <div className="mt-12 space-y-10 text-sm leading-7 text-black/55">

            <PolicySection title="Use of the Website">
              By using the ostren website, users agree to use the
              platform only for lawful purposes and in accordance with
              applicable terms and policies.
            </PolicySection>

            <PolicySection title="Products & Pricing">
              ostren may update product information, availability and
              pricing when required. Product images and descriptions are
              intended to represent items as accurately as possible.
            </PolicySection>

            <PolicySection title="Orders">
              An order may be subject to product availability and order
              verification. ostren may cancel or reject an order where
              necessary.
            </PolicySection>

            <PolicySection title="Payments">
              Payments will be handled through approved third-party
              payment providers once payment integration is enabled.
            </PolicySection>

            <PolicySection title="Shipping">
              Delivery timelines and shipping charges may vary according
              to location, courier availability and other operational
              factors.
            </PolicySection>

            <PolicySection title="Returns & Refunds">
              Returns, cancellations and refunds are governed by the
              approved ostren return and refund policy.
            </PolicySection>

            <PolicySection title="Intellectual Property">
              ostren branding, website design, text, graphics and related
              materials may not be copied or reused without appropriate
              permission.
            </PolicySection>

            <PolicySection title="Limitation of Liability">
              ostren is not responsible for interruptions or failures
              caused by circumstances outside reasonable control,
              including certain third-party service failures.
            </PolicySection>

            <PolicySection title="Changes to These Terms">
              These terms may be updated when business operations,
              services or legal requirements change.
            </PolicySection>

            <PolicySection title="Important Note">
              This page contains draft terms for development purposes.
              Final terms should be reviewed and approved by the business
              or a qualified legal professional before launch.
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