export default function Newsletter() {
  return (
    <section className="border-t border-black/10 bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 lg:px-10">

        <div className="mx-auto max-w-[720px] text-center">

          {/* EYEBROW */}
          <p className="mb-4 text-[9px] font-medium tracking-[0.24em] text-black/45 uppercase">
            Stay In The Loop
          </p>

          {/* HEADING */}
          <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.035em] text-[#111111] sm:text-[38px] md:text-[46px]">
            Join the Ostren Fit list.
          </h2>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-5 max-w-[480px] text-[13px] leading-6 text-black/55 md:text-sm">
            Sign up for first access to new drops, exclusive releases,
            offers and everything happening at Ostren Fit.
          </p>

          {/* FORM */}
          <form className="mx-auto mt-8 flex max-w-[540px] border-b border-black">
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              className="h-12 min-w-0 flex-1 bg-transparent pr-4 text-[12px] text-black outline-none placeholder:text-black/35"
            />

            <button
              type="submit"
              className="group flex h-12 items-center justify-center px-2 text-[9px] font-semibold tracking-[0.16em] text-black uppercase transition-opacity hover:opacity-50 sm:px-4"
            >
              Subscribe
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>

          {/* PRIVACY */}
          <p className="mt-4 text-[9px] leading-4 text-black/35">
            By subscribing, you agree to receive marketing emails from
            Ostren Fit. You can unsubscribe at any time.
          </p>

        </div>
      </div>
    </section>
  );
}