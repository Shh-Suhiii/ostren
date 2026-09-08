"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div className="flex h-12 w-fit items-center border border-[#063b63]/15 bg-white">

      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="flex h-full w-12 items-center justify-center text-[#063b63] transition-colors hover:bg-[#f5f7f7] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={15} strokeWidth={1.5} />
      </button>

      <span className="flex h-full min-w-12 items-center justify-center border-x border-[#063b63]/10 text-sm text-[#022a46]">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="flex h-full w-12 items-center justify-center text-[#063b63] transition-colors hover:bg-[#f5f7f7]"
      >
        <Plus size={15} strokeWidth={1.5} />
      </button>

    </div>
  );
}