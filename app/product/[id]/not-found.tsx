import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafaf8] px-5">

      <div className="text-center">

        <p className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-[#0877b5] uppercase">
          ostren
        </p>

        <h1 className="font-serif text-5xl text-[#022a46] md:text-7xl">
          Product not found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/50">
          The product you&apos;re looking for doesn&apos;t exist or may have
          been removed.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-3 bg-[#063b63] px-7 py-4 text-[10px] font-semibold tracking-[0.18em] text-white uppercase"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.5}
          />

          Back to shop
        </Link>

      </div>

    </main>
  );
}