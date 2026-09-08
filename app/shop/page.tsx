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

const validSortOptions = [
  "featured",
  "newest",
  "best-selling",
  "price-low",
  "price-high",
];

export default function ShopPage() {
  const searchParams =
    useSearchParams();

  const urlCategory =
    searchParams.get("category");

  const urlSort =
    searchParams.get("sort");

  const [products, setProducts] =
    useState<ApiProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [activeCategory, setActiveCategory] =
    useState(
      urlCategory || "All"
    );

  const [sortBy, setSortBy] =
    useState(
      urlSort &&
        validSortOptions.includes(urlSort)
        ? urlSort
        : "featured"
    );

  useEffect(() => {
    async function loadProducts() {
      try {
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

  const categories =
    useMemo(() => {
      const names = products
        .map(
          (product) =>
            product.category?.name
        )
        .filter(
          (name): name is string =>
            Boolean(name)
        );

      return [
        "All",
        ...Array.from(new Set(names)),
      ];
    }, [products]);

  const filteredProducts =
    useMemo(() => {
      const result =
        activeCategory === "All"
          ? [...products]
          : products.filter(
              (product) =>
                product.category?.name ===
                activeCategory
            );

      if (sortBy === "price-low") {
        result.sort(
          (a, b) =>
            a.price - b.price
        );
      }

      if (sortBy === "price-high") {
        result.sort(
          (a, b) =>
            b.price - a.price
        );
      }

      if (sortBy === "newest") {
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
    <main className="min-h-screen bg-[#fafaf8]">

      <AnnouncementBar />
      <Navbar />

      <section className="bg-white px-5 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24 lg:px-12">

        <div className="mx-auto max-w-[1440px]">

          <p className="mb-4 text-[10px] font-semibold tracking-[0.3em] text-[#0877b5] uppercase">
            The collection
          </p>

          <h1 className="font-serif text-5xl tracking-[-0.025em] text-[#022a46] md:text-7xl">
            Shop ostren
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-black/50 md:text-base">
            Discover thoughtfully designed essentials,
            modern classics and signature pieces made
            for everyday life.
          </p>

        </div>

      </section>

      <section className="px-5 py-12 md:px-8 md:py-16 lg:px-12">

        <div className="mx-auto max-w-[1440px]">

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">

              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#063b63] uppercase">
                Loading collection...
              </p>

            </div>
          ) : error ? (
            <div className="flex min-h-[400px] items-center justify-center text-center">

              <div>
                <h2 className="font-serif text-3xl text-[#022a46]">
                  Unable to load products.
                </h2>

                <p className="mt-3 text-sm text-black/45">
                  Make sure the ostren backend
                  is running.
                </p>
              </div>

            </div>
          ) : (
            <>

              {/* Toolbar */}
              <div className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-6 md:flex-row md:items-center md:justify-between">

                {/* Category filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">

                  {categories.map(
                    (category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() =>
                          setActiveCategory(
                            category
                          )
                        }
                        className={`shrink-0 border px-5 py-3 text-[9px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                          activeCategory ===
                          category
                            ? "border-[#063b63] bg-[#063b63] text-white"
                            : "border-[#063b63]/15 bg-white text-[#063b63]"
                        }`}
                      >
                        {category}
                      </button>
                    )
                  )}

                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">

                  <span className="text-[9px] font-semibold tracking-[0.15em] text-black/40 uppercase">
                    Sort
                  </span>

                  <div className="relative">

                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(
                          event.target.value
                        )
                      }
                      className="h-10 appearance-none border border-[#063b63]/15 bg-white pl-4 pr-10 text-[10px] font-medium text-[#063b63] outline-none"
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
                      size={14}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#063b63]"
                    />

                  </div>

                </div>

              </div>

              <p className="mb-7 text-[9px] font-semibold tracking-[0.15em] text-black/40 uppercase">
                {filteredProducts.length}{" "}
                {filteredProducts.length ===
                1
                  ? "product"
                  : "products"}
              </p>

              <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">

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