import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[var(--ostren-soft)] text-[#111111]">

      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-5 sm:py-14 md:px-8 md:py-16 lg:px-10 lg:py-20">

        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-2 md:text-left lg:grid-cols-12 lg:gap-8">

          {/* BRAND */}
          <div className="mx-auto max-w-[520px] md:mx-0 lg:col-span-5">
            <p className="text-[8px] font-medium tracking-[0.24em] text-black/40 uppercase sm:text-[9px]">
              Ostren Fit
            </p>

            <h2 className="mt-4 text-[34px] font-medium leading-[1] tracking-[-0.045em] sm:mt-5 sm:text-[42px] lg:text-[52px]">
              Made to wear.
              <br />
              Made to be yours.
            </h2>

            <p className="mx-auto mt-5 max-w-[420px] text-[11px] leading-6 text-black/50 sm:text-[12px] md:mx-0 md:text-[13px] md:leading-7">
              Everyday streetwear, bold prints and custom pieces designed
              around your style.
            </p>

            <Link
              href="/customize"
              className="mt-6 inline-flex border-b border-black pb-1 text-[8px] font-semibold tracking-[0.15em] uppercase transition-opacity hover:opacity-50 sm:text-[9px]"
            >
              Create Your Own →
            </Link>
          </div>

          {/* SHOP */}
          <div className="lg:col-span-2">
            <FooterHeading>Shop</FooterHeading>

            <div className="mt-4 flex flex-col items-center gap-3 md:items-start">
              <FooterLink href="/shop?sort=newest">
                New Arrivals
              </FooterLink>

              <FooterLink href="/shop?sort=best-selling">
                Best Sellers
              </FooterLink>

              <FooterLink href="/categories">
                Categories
              </FooterLink>

              <FooterLink href="/shop">
                Shop All
              </FooterLink>
            </div>
          </div>

          {/* EXPLORE */}
          <div className="lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>

            <div className="mt-4 flex flex-col items-center gap-3 md:items-start">
              <FooterLink href="/customize">
                Custom Prints
              </FooterLink>

              <FooterLink href="/about">
                About Ostren
              </FooterLink>

              <FooterLink href="/faq">
                FAQs
              </FooterLink>

              <FooterLink href="/contact">
                Contact
              </FooterLink>
            </div>
          </div>

          {/* SUPPORT */}
          <div className="mx-auto max-w-[320px] md:mx-0 lg:col-span-3">
            <FooterHeading>Need Help?</FooterHeading>

            <p className="mx-auto mt-4 max-w-[280px] text-[11px] leading-6 text-black/50 md:mx-0 md:text-[12px]">
              Questions about an order, custom print or sizing?
              We&apos;re here to help.
            </p>

            <a
              href="mailto:aoverayvivekkumar274@gmail.com"
              className="mt-4 inline-block border-b border-black/30 pb-1 text-[10px] transition-opacity hover:opacity-50 sm:text-[11px]"
            >
              aoverayvivekkumar274@gmail.com
            </a>

            <Link
              href="/contact"
              className="mt-4 block text-[8px] font-semibold tracking-[0.14em] uppercase transition-opacity hover:opacity-50 sm:text-[9px]"
            >
              Contact Support →
            </Link>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="mt-12 grid grid-cols-2 border-y border-black/10 md:mt-16 md:grid-cols-4 lg:mt-20">
          <TrustItem
            title="Free Shipping"
            text="On orders above ₹999"
          />

          <TrustItem
            title="Custom Printing"
            text="Send us your own design"
          />

          <TrustItem
            title="Secure Payments"
            text="Safe & protected checkout"
          />

          <TrustItem
            title="Support"
            text="We're here when you need us"
          />
        </div>

        {/* SOCIAL + TAGLINE */}
        <div className="mt-9 flex flex-col items-center gap-7 border-b border-black/10 pb-9 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">

          <div>
            <p className="text-[8px] font-medium tracking-[0.2em] text-black/40 uppercase sm:text-[9px]">
              Follow Ostren Fit
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:justify-start">
              <a
                href="#"
                className="text-[10px] text-black/60 transition-colors hover:text-black sm:text-[11px]"
              >
                Instagram
              </a>

              <a
                href="#"
                className="text-[10px] text-black/60 transition-colors hover:text-black sm:text-[11px]"
              >
                Facebook
              </a>

              <a
                href="#"
                className="text-[10px] text-black/60 transition-colors hover:text-black sm:text-[11px]"
              >
                Pinterest
              </a>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-[8px] tracking-[0.18em] text-black/35 uppercase sm:text-[9px]">
              Wear it your way.
            </p>

            <p className="mt-2 text-[10px] text-black/50 sm:text-[11px]">
              Designed by Ostren Fit.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col items-center gap-4 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">

          <p className="text-[8px] tracking-[0.08em] text-black/40 uppercase sm:text-[9px]">
            © 2026 Ostren Fit. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:justify-end">
            <FooterLegal href="/privacy">
              Privacy Policy
            </FooterLegal>

            <FooterLegal href="/terms">
              Terms & Conditions
            </FooterLegal>

            <FooterLegal href="/shipping">
              Shipping
            </FooterLegal>

            <FooterLegal href="/returns">
              Returns
            </FooterLegal>
          </div>
        </div>
      </div>

      {/* LARGE BRAND ENDING */}
      <div className="overflow-hidden border-t border-black/10 px-3 pb-5 pt-7 text-center sm:px-4 md:pb-7 md:pt-10">
        <p className="select-none text-[17vw] font-semibold leading-[0.78] tracking-[-0.07em] text-[#111111] sm:text-[13vw] md:text-[11vw]">
          OSTREN FIT
        </p>

        <p className="mt-4 text-[7px] font-medium tracking-[0.24em] text-black/30 uppercase sm:mt-5 sm:text-[8px] sm:tracking-[0.28em]">
          Your style / Your print / Your fit
        </p>
      </div>

    </footer>
  );
}


/* =========================================================
   FOOTER COMPONENTS
   ========================================================= */

function FooterHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="text-[8px] font-semibold tracking-[0.2em] text-black/40 uppercase sm:text-[9px]">
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
      className="text-[11px] text-black/60 transition-colors duration-300 hover:text-black sm:text-[12px]"
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
      className="text-[8px] tracking-[0.05em] text-black/40 transition-colors duration-300 hover:text-black sm:text-[9px]"
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
    <div className="flex min-h-[92px] flex-col items-center justify-center border-black/10 px-2 py-5 text-center odd:border-r md:min-h-[100px] md:border-l md:px-4 md:first:border-l-0 md:odd:border-r-0">
      <p className="text-[9px] font-medium text-[#111111] sm:text-[10px]">
        {title}
      </p>

      <p className="mt-1.5 max-w-[130px] text-[8px] leading-4 text-black/40 sm:text-[9px]">
        {text}
      </p>
    </div>
  );
}