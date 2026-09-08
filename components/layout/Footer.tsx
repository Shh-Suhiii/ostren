import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#f7f7f5] text-[#111111]">

      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-16 lg:px-10 lg:py-20">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* BRAND */}
          <div className="lg:col-span-5">
            <p className="text-[10px] font-medium tracking-[0.24em] text-black/40 uppercase">
              Ostren Fit
            </p>

            <h2 className="mt-5 max-w-[480px] text-[36px] font-medium leading-[1.02] tracking-[-0.04em] sm:text-[42px] lg:text-[50px]">
              Fits that feel as
              <br />
              good as they look.
            </h2>

            <p className="mt-6 max-w-[390px] text-[12px] leading-6 text-black/50 md:text-[13px]">
              Contemporary everyday clothing designed around comfort,
              clean silhouettes and effortless style.
            </p>
          </div>

          {/* SHOP */}
          <div className="lg:col-span-2">
            <FooterHeading>Shop</FooterHeading>

            <div className="mt-5 flex flex-col items-start gap-3.5">
              <FooterLink href="/shop">New Arrivals</FooterLink>
              <FooterLink href="/shop?sort=best-selling">
                Best Sellers
              </FooterLink>
              <FooterLink href="/categories">Categories</FooterLink>
              <FooterLink href="/shop">Shop All</FooterLink>
            </div>
          </div>

          {/* HELP */}
          <div className="lg:col-span-2">
            <FooterHeading>Help</FooterHeading>

            <div className="mt-5 flex flex-col items-start gap-3.5">
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
              <FooterLink href="/shipping">
                Shipping & Delivery
              </FooterLink>
              <FooterLink href="/returns">
                Returns & Exchanges
              </FooterLink>
            </div>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-3">
            <FooterHeading>Get In Touch</FooterHeading>

            <p className="mt-5 max-w-[260px] text-[12px] leading-6 text-black/50">
              Questions about your order or need help finding the right fit?
              We&apos;re here to help.
            </p>

            <a
              href="mailto:aoverayvivekkumar274@gmail.com"
              className="mt-5 inline-block border-b border-black/40 pb-1 text-[11px] transition-opacity hover:opacity-50"
            >
              aoverayvivekkumar274@gmail.com
            </a>

            <Link
              href="/contact"
              className="mt-4 block text-[10px] font-medium tracking-[0.12em] uppercase transition-opacity hover:opacity-50"
            >
              Contact Support →
            </Link>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="mt-14 grid grid-cols-2 border-y border-black/10 md:mt-20 md:grid-cols-4">

          <TrustItem
            title="Free Shipping"
            text="On orders above ₹999"
          />

          <TrustItem
            title="Easy Returns"
            text="Simple return process"
          />

          <TrustItem
            title="Secure Payments"
            text="Safe & protected checkout"
          />

          <TrustItem
            title="Customer Support"
            text="We're here to help"
          />

        </div>

        {/* SOCIAL */}
        <div className="mt-10 flex flex-col justify-between gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end">

          <div>
            <p className="text-[9px] font-medium tracking-[0.2em] text-black/40 uppercase">
              Follow Ostren Fit
            </p>

            <div className="mt-4 flex items-center gap-6">
              <a
                href="#"
                className="text-[11px] transition-opacity hover:opacity-50"
              >
                Instagram
              </a>

              <a
                href="#"
                className="text-[11px] transition-opacity hover:opacity-50"
              >
                Facebook
              </a>

              <a
                href="#"
                className="text-[11px] transition-opacity hover:opacity-50"
              >
                Pinterest
              </a>
            </div>
          </div>

          <p className="text-[10px] text-black/40">
            Made for everyday.
          </p>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[9px] tracking-[0.08em] text-black/40 uppercase">
            © 2026 Ostren Fit. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <FooterLegal href="/privacy">
              Privacy Policy
            </FooterLegal>

            <FooterLegal href="/terms">
              Terms & Conditions
            </FooterLegal>
          </div>

        </div>
      </div>

      {/* LARGE BRAND ENDING */}
      <div className="overflow-hidden border-t border-black/10 px-4 py-5 text-center md:py-7">
        <p className="text-[13vw] font-semibold leading-[0.8] tracking-[-0.065em] text-[#111111] md:text-[11vw]">
          OSTREN FIT
        </p>
      </div>

    </footer>
  );
}

/* ---------------- COMPONENTS ---------------- */

function FooterHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="text-[9px] font-semibold tracking-[0.2em] text-black/40 uppercase">
      {children}
    </h3>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[12px] text-black/65 transition-colors hover:text-black"
    >
      {children}
    </Link>
  );
}

function FooterLegal({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[9px] tracking-[0.05em] text-black/40 transition-colors hover:text-black"
    >
      {children}
    </Link>
  );
}

function TrustItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="border-black/10 px-3 py-6 first:border-l-0 md:border-l md:px-5">
      <p className="text-[10px] font-medium">
        {title}
      </p>

      <p className="mt-1.5 text-[9px] text-black/40">
        {text}
      </p>
    </div>
  );
}