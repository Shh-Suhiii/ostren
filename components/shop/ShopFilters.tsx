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
    <div className="w-full border-b border-black/10">
      <div
        className="
          flex items-center gap-7
          overflow-x-auto
          scrollbar-hide
          px-0
          md:gap-9
        "
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`
                relative shrink-0
                pb-4 pt-2
                text-[10px] font-medium
                tracking-[0.12em] uppercase
                transition-colors duration-200
                md:text-[11px]
                ${
                  isActive
                    ? "text-[#111111]"
                    : "text-black/40 hover:text-[#111111]"
                }
              `}
            >
              {category}

              <span
                className={`
                  absolute bottom-0 left-0 h-[1.5px]
                  bg-[#111111]
                  transition-all duration-300
                  ${
                    isActive
                      ? "w-full opacity-100"
                      : "w-0 opacity-0"
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}