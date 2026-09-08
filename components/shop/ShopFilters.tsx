"use client";

import { categories } from "@/data/products";

interface ShopFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ShopFilters({
  activeCategory,
  onCategoryChange,
}: ShopFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={`shrink-0 border px-5 py-3 text-[9px] font-semibold tracking-[0.16em] uppercase transition-colors ${
            activeCategory === category
              ? "border-[#063b63] bg-[#063b63] text-white"
              : "border-[#063b63]/15 bg-white text-[#063b63] hover:border-[#063b63]/40"
          }`}
        >
          {category}
        </button>
      ))}

    </div>
  );
}