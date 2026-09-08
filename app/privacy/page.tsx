import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-5 text-sm text-black/40">
            Last updated: August 2026
          </p>

          <div className="mt-12 space-y-10 text-sm leading-7 text-black/55">

            <PolicySection title="Information We Collect">
              ostren may collect information such as your name, email
              address, phone number, delivery address, account details
              and order information when you use the website.
            </PolicySection>

            <PolicySection title="How We Use Your Information">
              Information may be used to process orders, manage customer
              accounts, provide support, communicate order updates and
              improve the website experience.
            </PolicySection>

            <PolicySection title="Payment Information">
              Payment information should be processed through approved
              third-party payment providers. ostren should not directly
              store complete card details.
            </PolicySection>

            <PolicySection title="Cookies & Local Storage">
              The website may use browser storage or cookies to support
              features such as shopping cart, wishlist, sessions and
              customer preferences.
            </PolicySection>

            <PolicySection title="Third-Party Services">
              Third-party services such as payment gateways, shipping
              providers, email services and analytics providers may
              process information according to their own privacy terms.
            </PolicySection>

            <PolicySection title="Data Security">
              Reasonable technical measures should be used to protect
              customer information from unauthorized access or misuse.
            </PolicySection>

            <PolicySection title="Your Rights">
              Customers may contact ostren to request corrections or
              updates to their personal information where applicable.
            </PolicySection>

            <PolicySection title="Important Note">
              This is placeholder privacy content for development
              purposes. The final policy should be reviewed and approved
              by the business or a qualified legal professional before
              production launch.
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