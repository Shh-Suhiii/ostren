"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminShell from "@/components/admin/AdminShell";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";


type ProductImage = {
  id?: number;
  image_url: string;
  alt_text?: string | null;
  sort_order?: number;
};


type Category = {
  id: number;
  name: string;
  slug: string;
};


type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compare_price?: number | null;
  sku?: string | null;
  stock: number;
  is_active: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  category?: Category | null;
  images: ProductImage[];
};


type ProductsResponse = {
  success: boolean;
  message?: string;
  count?: number;
  products?: Product[];
};


export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);


  useEffect(() => {
    async function loadProducts() {
      const token =
        localStorage.getItem(
          "ostren-admin-token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/admin/products`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data: ProductsResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          setError(
            data.message ||
              "Unable to load products."
          );

          return;
        }

        setProducts(
          data.products || []
        );
      } catch {
        setError(
          "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);


  const filteredProducts =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) => {
          return (
            product.name
              .toLowerCase()
              .includes(query) ||
            product.slug
              .toLowerCase()
              .includes(query) ||
            product.sku
              ?.toLowerCase()
              .includes(query) ||
            product.category?.name
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [products, search]);


  async function handleDelete(
    product: Product
  ) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem(
        "ostren-admin-token"
      );

    if (!token) {
      return;
    }

    setDeletingId(
      product.id
    );

    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to delete product."
        );

        return;
      }

      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (item) =>
              item.id !==
              product.id
          )
      );
    } catch {
      setError(
        "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }


  return (
    <AdminShell>

      <main className="min-h-screen">

        {/* HEADER */}

        <header className="border-b border-black/10">

          <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center justify-between gap-4 px-5 md:px-8 lg:px-10">

            <div>

              <p className="text-[7px] font-semibold tracking-[0.23em] text-black/35 uppercase">
                Management
              </p>

              <h1 className="mt-1.5 text-[23px] font-medium tracking-[-0.03em]">
                Products
              </h1>

            </div>


            <Link
              href="/admin/products/new"
              className="flex h-[44px] items-center gap-2 bg-[#111111] px-4 text-[8px] font-semibold tracking-[0.15em] !text-white uppercase transition hover:bg-black/80"
            >
              <Plus
                size={14}
                strokeWidth={1.5}
              />

              <span className="!text-white">
                Add Product
              </span>
            </Link>

          </div>

        </header>


        {/* CONTENT */}

        <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">

          {/* TOP */}

          <div className="flex flex-col gap-5 border-b border-black/10 pb-7 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-[8px] font-semibold tracking-[0.2em] text-black/35 uppercase">
                Inventory
              </p>

              <h2 className="mt-2 text-[30px] font-medium tracking-[-0.04em]">
                All Products
              </h2>

              <p className="mt-2 text-[10px] text-black/40">
                {products.length} products
                in your store
              </p>

            </div>


            {/* SEARCH */}

            <div className="relative w-full md:w-[300px]">

              <Search
                size={15}
                strokeWidth={1.4}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products..."
                className="h-[46px] w-full border border-black/10 bg-transparent pl-11 pr-4 text-[10px] outline-none transition placeholder:text-black/30 focus:border-black"
              />

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mt-6 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

              <p className="text-[10px] text-red-800">
                {error}
              </p>

            </div>
          )}


          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[400px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-5 w-5 animate-spin rounded-full border border-black/15 border-t-black" />

                <p className="mt-4 text-[8px] font-semibold tracking-[0.18em] text-black/30 uppercase">
                  Loading products...
                </p>

              </div>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            filteredProducts.length === 0 && (
              <div className="flex min-h-[350px] flex-col items-center justify-center border-b border-black/10 text-center">

                <Package
                  size={28}
                  strokeWidth={1.1}
                  className="text-black/25"
                />

                <p className="mt-4 text-[11px] font-medium">
                  No products found.
                </p>

                <p className="mt-2 text-[9px] text-black/35">
                  Try another search or
                  add a new product.
                </p>

              </div>
            )}


          {/* DESKTOP TABLE */}

          {!loading &&
            filteredProducts.length > 0 && (
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full border-collapse">

                  <thead>

                    <tr className="border-b border-black/10">

                      <TableHeading>
                        Product
                      </TableHeading>

                      <TableHeading>
                        Category
                      </TableHeading>

                      <TableHeading>
                        Price
                      </TableHeading>

                      <TableHeading>
                        Stock
                      </TableHeading>

                      <TableHeading>
                        Status
                      </TableHeading>

                      <TableHeading>
                        Labels
                      </TableHeading>

                      <TableHeading align="right">
                        Actions
                      </TableHeading>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredProducts.map(
                      (product) => (
                        <tr
                          key={product.id}
                          className="border-b border-black/10 transition hover:bg-white/35"
                        >

                          {/* PRODUCT */}

                          <td className="py-4 pr-5">

                            <div className="flex items-center gap-4">

                              <ProductThumbnail
                                product={product}
                              />

                              <div className="min-w-0">

                                <p className="max-w-[260px] truncate text-[11px] font-medium">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-[8px] text-black/35">
                                  {product.sku ||
                                    `ID ${product.id}`}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* CATEGORY */}

                          <td className="px-3 py-4 text-[9px] text-black/55">
                            {product.category
                              ?.name ||
                              "—"}
                          </td>


                          {/* PRICE */}

                          <td className="px-3 py-4">

                            <p className="text-[10px] font-medium">
                              ₹
                              {product.price.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            {product.compare_price && (
                              <p className="mt-1 text-[8px] text-black/30 line-through">
                                ₹
                                {product.compare_price.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            )}

                          </td>


                          {/* STOCK */}

                          <td className="px-3 py-4">

                            <span
                              className={
                                product.stock <= 0
                                  ? "text-[9px] font-medium text-red-700"
                                  : product.stock <= 5
                                    ? "text-[9px] font-medium text-amber-700"
                                    : "text-[9px] text-black/55"
                              }
                            >
                              {product.stock}
                            </span>

                          </td>


                          {/* STATUS */}

                          <td className="px-3 py-4">

                            <StatusBadge
                              active={
                                product.is_active
                              }
                            />

                          </td>


                          {/* LABELS */}

                          <td className="px-3 py-4">

                            <div className="flex flex-wrap gap-1.5">

                              {product.is_new && (
                                <MiniBadge>
                                  New
                                </MiniBadge>
                              )}

                              {product.is_best_seller && (
                                <MiniBadge>
                                  Best Seller
                                </MiniBadge>
                              )}

                              {!product.is_new &&
                                !product.is_best_seller && (
                                  <span className="text-[8px] text-black/25">
                                    —
                                  </span>
                                )}

                            </div>

                          </td>


                          {/* ACTIONS */}

                          <td className="py-4 pl-3">

                            <div className="flex justify-end gap-2">

                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/55 transition hover:bg-black hover:!text-white"
                                aria-label={`Edit ${product.name}`}
                              >
                                <Edit3
                                  size={14}
                                  strokeWidth={1.4}
                                />
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  product.id
                                }
                                className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/55 transition hover:border-red-700 hover:bg-red-700 hover:text-white disabled:opacity-30"
                                aria-label={`Delete ${product.name}`}
                              >
                                <Trash2
                                  size={14}
                                  strokeWidth={1.4}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}


          {/* MOBILE CARDS */}

          {!loading &&
            filteredProducts.length > 0 && (
              <div className="divide-y divide-black/10 md:hidden">

                {filteredProducts.map(
                  (product) => (
                    <article
                      key={product.id}
                      className="py-5"
                    >

                      <div className="flex gap-4">

                        <ProductThumbnail
                          product={product}
                        />

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <p className="text-[11px] font-medium leading-5">
                                {product.name}
                              </p>

                              <p className="mt-1 text-[8px] text-black/35">
                                {product.category
                                  ?.name ||
                                  "Uncategorized"}
                              </p>

                            </div>

                            <StatusBadge
                              active={
                                product.is_active
                              }
                            />

                          </div>


                          <div className="mt-4 grid grid-cols-2 gap-3">

                            <SmallInfo
                              label="Price"
                              value={`₹${product.price.toLocaleString(
                                "en-IN"
                              )}`}
                            />

                            <SmallInfo
                              label="Stock"
                              value={String(
                                product.stock
                              )}
                            />

                          </div>


                          <div className="mt-4 flex gap-2">

                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="flex h-9 flex-1 items-center justify-center gap-2 border border-black/10 text-[8px] font-semibold tracking-[0.12em] text-black uppercase"
                            >
                              <Edit3
                                size={13}
                                strokeWidth={1.4}
                              />

                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  product
                                )
                              }
                              disabled={
                                deletingId ===
                                product.id
                              }
                              className="flex h-9 w-10 items-center justify-center border border-black/10 text-black/55"
                            >
                              <Trash2
                                size={13}
                                strokeWidth={1.4}
                              />
                            </button>

                          </div>

                        </div>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}

        </section>

      </main>

    </AdminShell>
  );
}


function ProductThumbnail({
  product,
}: {
  product: Product;
}) {
  const image =
    product.images?.[0]?.image_url;

  return (
    <div className="relative h-[62px] w-[52px] shrink-0 overflow-hidden bg-black/[0.04]">

      {image ? (
        <Image
          src={image}
          alt={
            product.images?.[0]
              ?.alt_text ||
            product.name
          }
          fill
          sizes="52px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">

          <Package
            size={16}
            strokeWidth={1.2}
            className="text-black/20"
          />

        </div>
      )}

    </div>
  );
}


function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`
        inline-flex px-2 py-1
        text-[7px] font-semibold
        tracking-[0.12em]
        uppercase
        ${
          active
            ? "bg-black text-white"
            : "border border-black/10 text-black/35"
        }
      `}
    >
      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
}


function MiniBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="border border-black/10 px-2 py-1 text-[6px] font-semibold tracking-[0.1em] text-black/45 uppercase">
      {children}
    </span>
  );
}


function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`py-4 text-[7px] font-semibold tracking-[0.17em] text-black/35 uppercase ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}


function SmallInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[7px] font-semibold tracking-[0.12em] text-black/30 uppercase">
        {label}
      </p>

      <p className="mt-1 text-[10px]">
        {value}
      </p>
    </div>
  );
}