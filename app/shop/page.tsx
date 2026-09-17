"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";

import {
  ApiProduct,
  getProducts,
} from "@/lib/products-api";

const allowedCategories = [
  "All",
  "T-Shirts",
  "Hoodies",
  "Joggers",
  "Jewelry",
  "Mugs & Bottles",
  "Photo Frames",
];

const categorySlugMap: Record<string, string> = {
  "t-shirts": "T-Shirts",
  hoodies: "Hoodies",
  joggers: "Joggers",
  jewelry: "Jewelry",
  "mugs-bottles": "Mugs & Bottles",
  "photo-frames": "Photo Frames",
};

const validSortOptions = [
  "featured",
  "newest",
  "best-selling",
  "price-low",
  "price-high",
];

export default function ShopPage() {
  const searchParams = useSearchParams();

  const urlCategory =
    searchParams.get("category");

  const urlSort =
    searchParams.get("sort");

  const initialCategory =
    urlCategory &&
      categorySlugMap[urlCategory]
      ? categorySlugMap[urlCategory]
      : "All";

  const initialSort =
    urlSort &&
      validSortOptions.includes(urlSort)
      ? urlSort
      : "featured";

  const [products, setProducts] =
    useState<ApiProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState(initialCategory);

  const [sortBy, setSortBy] =
    useState(initialSort);

  useEffect(() => {
    async function loadProducts() {
      try {
        setError(false);

        const result =
          await getProducts();

        setProducts(result);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const availableCategories =
    useMemo(() => {
      const productCategoryNames =
        new Set(
          products
            .map(
              (product) =>
                product.category?.name
            )
            .filter(
              (
                name
              ): name is string =>
                Boolean(name)
            )
        );

      return allowedCategories.filter(
        (category) =>
          category === "All" ||
          productCategoryNames.has(
            category
          )
      );
    }, [products]);

  const filteredProducts =
    useMemo(() => {
      const result =
        activeCategory === "All"
          ? [...products]
          : products.filter(
            (product) =>
              product.category
                ?.name ===
              activeCategory
          );

      if (
        sortBy === "price-low"
      ) {
        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
      }

      if (
        sortBy === "price-high"
      ) {
        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
      }

      if (
        sortBy === "newest"
      ) {
        result.sort(
          (a, b) =>
            Number(b.is_new) -
            Number(a.is_new)
        );
      }

      if (
        sortBy === "best-selling"
      ) {
        result.sort(
          (a, b) =>
            Number(
              b.is_best_seller
            ) -
            Number(
              a.is_best_seller
            )
        );
      }

      return result;
    }, [
      products,
      activeCategory,
      sortBy,
    ]);

  return (
    <main className="min-h-screen bg-[var(--ostren-off-white)]">
      <AnnouncementBar />

      <Navbar />

      {/* HERO */}
      <section className="border-b border-black/5 bg-[var(--ostren-off-white)] px-5 pb-8 pt-9 md:px-8 md:pb-16 md:pt-20 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 text-[8px] font-semibold tracking-[0.26em] text-black/40 uppercase md:mb-4 md:text-[10px]">
            The collection
          </p>

          <h1 className="font-serif text-[40px] leading-none tracking-[-0.04em] text-[#111111] md:text-[68px] lg:text-[76px]">
            Shop ostren
          </h1>

          <p className="mt-4 max-w-[560px] text-[12px] leading-6 text-black/50 md:mt-5 md:text-[15px] md:leading-7">
            Discover thoughtfully designed
            essentials, modern classics and
            signature pieces made for
            everyday life.
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-5 py-5 md:px-8 md:py-10 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-black/45 uppercase">
                Loading collection...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-[420px] items-center justify-center text-center">
              <div>
                <h2 className="font-serif text-3xl text-[#111111]">
                  Unable to load products.
                </h2>

                <p className="mt-3 text-sm text-black/45">
                  Make sure the Ostren Fit
                  backend is running.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* FILTER + SORT */}
              <div className="mb-6 md:mb-10 md:border-b md:border-black/10">
                {/* MOBILE */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between gap-3 border-y border-black/10 py-3">

                    {/* CATEGORY */}
                    <div className="relative flex-1">
                      <select
                        value={activeCategory}
                        onChange={(event) =>
                          setActiveCategory(event.target.value)
                        }
                        className="
          h-9
          w-full
          appearance-none
          border-0
          bg-transparent
          pr-7
          text-[10px]
          font-medium
          tracking-[0.04em]
          text-[#111111]
          outline-none
        "
                      >
                        {availableCategories.map((category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={12}
                        strokeWidth={1.5}
                        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-black/45"
                      />
                    </div>

                    <div className="h-5 w-px bg-black/10" />

                    {/* SORT */}
                    <div className="relative flex-1">
                      <select
                        value={sortBy}
                        onChange={(event) =>
                          setSortBy(event.target.value)
                        }
                        className="
          h-9
          w-full
          appearance-none
          border-0
          bg-transparent
          pr-7
          text-right
          text-[10px]
          font-medium
          tracking-[0.04em]
          text-[#111111]
          outline-none
        "
                      >
                        <option value="featured">
                          Featured
                        </option>

                        <option value="newest">
                          Newest
                        </option>

                        <option value="best-selling">
                          Best sellers
                        </option>

                        <option value="price-low">
                          Price: Low to high
                        </option>

                        <option value="price-high">
                          Price: High to low
                        </option>
                      </select>

                      <ChevronDown
                        size={12}
                        strokeWidth={1.5}
                        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-black/45"
                      />
                    </div>

                  </div>

                  <p className="mt-3 text-[8px] font-medium tracking-[0.14em] text-black/35 uppercase">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                      ? "product"
                      : "products"}
                  </p>
                </div>

                {/* DESKTOP */}
                <div className="hidden pb-4 md:flex md:items-end md:justify-between md:gap-8">
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                      {availableCategories.map(
                        (category) => {
                          const isActive =
                            activeCategory ===
                            category;

                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() =>
                                setActiveCategory(
                                  category
                                )
                              }
                              className={`
                                relative
                                shrink-0
                                pb-3
                                text-[11px]
                                font-medium
                                tracking-[0.12em]
                                uppercase
                                transition-colors
                                duration-200
                                ${isActive
                                  ? "text-[#111111]"
                                  : "text-black/35 hover:text-black/70"
                                }
                              `}
                            >
                              {category}

                              <span
                                className={`
                                  absolute
                                  bottom-0
                                  left-0
                                  h-[1.5px]
                                  bg-[#111111]
                                  transition-all
                                  duration-300
                                  ${isActive
                                    ? "w-full opacity-100"
                                    : "w-0 opacity-0"
                                  }
                                `}
                              />
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[9px] font-semibold tracking-[0.14em] text-black/35 uppercase">
                      Sort by
                    </span>

                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(event) =>
                          setSortBy(
                            event.target
                              .value
                          )
                        }
                        className="
                          h-10
                          min-w-[170px]
                          appearance-none
                          border
                          border-black/10
                          bg-[#F8F5EF]
                          pl-4
                          pr-10
                          text-[10px]
                          font-medium
                          text-[#111111]
                          outline-none
                          transition-colors
                          hover:border-black/25
                          focus:border-black/30
                        "
                      >
                        <option value="featured">
                          Featured
                        </option>

                        <option value="newest">
                          Newest
                        </option>

                        <option value="best-selling">
                          Best sellers
                        </option>

                        <option value="price-low">
                          Price: Low to high
                        </option>

                        <option value="price-high">
                          Price: High to low
                        </option>
                      </select>

                      <ChevronDown
                        size={13}
                        strokeWidth={1.5}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/45"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCT COUNT - DESKTOP ONLY */}
              <div className="mb-7 hidden items-center justify-between md:flex">
                <p className="text-[9px] font-medium tracking-[0.14em] text-black/40 uppercase">
                  {
                    filteredProducts.length
                  }{" "}
                  {filteredProducts.length ===
                    1
                    ? "product"
                    : "products"}
                </p>
              </div>

              {/* PRODUCT GRID */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-5 md:gap-y-12 lg:grid-cols-4">
                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}