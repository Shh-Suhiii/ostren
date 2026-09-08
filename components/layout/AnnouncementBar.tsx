import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="border-b border-white/10 bg-[#111111] text-white">
      <div className="mx-auto flex min-h-[32px] max-w-[1600px] items-center justify-center px-4">
        <p className="text-center text-[9px] font-medium tracking-[0.16em] uppercase sm:text-[10px] sm:tracking-[0.2em]">
          Free shipping on orders above ₹999

          <span className="mx-2.5 text-white/30">
            •
          </span>

          <Link
            href="/shop"
            className="border-b border-white/50 pb-[1px] transition-opacity hover:opacity-60"
          >
            Shop Now
          </Link>
        </p>
      </div>
    </div>
  );
}