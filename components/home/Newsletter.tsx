export default function Newsletter() {
  return (
    <section className="border-t border-black/10 bg-[var(--ostren-soft)] py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 lg:px-10">

        <div className="mx-auto max-w-[760px] text-center">

          {/* EYEBROW */}
          <p className="mb-4 text-[9px] font-medium tracking-[0.24em] text-black/40 uppercase">
            Stay In The Loop
          </p>

          {/* HEADING */}
          <h2 className="text-[34px] font-medium leading-[1.02] tracking-[-0.04em] text-[#111111] sm:text-[42px] md:text-[50px]">
            Be first to know
            <br />
            what&apos;s next.
          </h2>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-5 max-w-[520px] text-[13px] leading-6 text-black/55 md:text-sm md:leading-7">
            New drops, custom print updates, limited releases and occasional
            offers — straight from Ostren Fit.
          </p>

          {/* FORM */}
          <form className="mx-auto mt-9 flex max-w-[560px] items-center border-b border-black/70">
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address"
              className="h-14 min-w-0 flex-1 bg-transparent pr-4 text-[12px] text-black outline-none placeholder:text-black/35"
            />

            <button
              type="submit"
              className="group flex h-14 shrink-0 items-center justify-center px-2 text-[9px] font-semibold tracking-[0.16em] text-black uppercase transition-opacity hover:opacity-55 sm:px-4"
            >
              Join The List

              <span className="ml-2 text-sm transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>

          {/* SMALL NOTE */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <p className="text-[8px] tracking-[0.14em] text-black/30 uppercase">
              New Drops
            </p>

            <span className="h-1 w-1 rounded-full bg-black/20" />

            <p className="text-[8px] tracking-[0.14em] text-black/30 uppercase">
              Custom Prints
            </p>

            <span className="h-1 w-1 rounded-full bg-black/20" />

            <p className="text-[8px] tracking-[0.14em] text-black/30 uppercase">
              Limited Releases
            </p>
          </div>

          {/* PRIVACY */}
          <p className="mx-auto mt-5 max-w-[460px] text-[8px] leading-4 text-black/30">
            By subscribing, you agree to receive emails from Ostren Fit.
            Unsubscribe anytime.
          </p>

        </div>
      </div>
    </section>
  );
}