"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Clock3,
  Eye,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  Search,
  Truck,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

import Link from "next/link";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ProtectedAccount from "@/components/account/ProtectedAccount";
import AccountSidebar from "@/components/account/AccountSidebar";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";


type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";


type OrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  sku?: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};


type Order = {
  id: number;
  order_number: string;
  user_id?: number | null;

  full_name: string;
  email: string;
  phone: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  subtotal: number;
  shipping: number;
  total: number;

  status: OrderStatus;

  payment_method: string;
  payment_status: string;

  items: OrderItem[];

  created_at?: string | null;
  updated_at?: string | null;
};


type OrdersResponse = {
  success: boolean;
  message?: string;
  count?: number;
  orders?: Order[];
};


type OrderResponse = {
  success: boolean;
  message?: string;
  order?: Order;
};


export default function OrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedOrder,
    setSelectedOrder,
  ] =
    useState<Order | null>(
      null
    );

  const [
    loadingOrderId,
    setLoadingOrderId,
  ] =
    useState<number | null>(
      null
    );


  // ======================================================
  // LOAD ORDERS
  // ======================================================

  useEffect(() => {
    async function loadOrders() {
      const token =
        localStorage.getItem(
          "ostren-access-token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/orders`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data:
          OrdersResponse =
            await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          setError(
            data.message ||
              "Unable to load your orders."
          );

          return;
        }

        setOrders(
          data.orders || []
        );
      } catch {
        setError(
          "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);


  // ======================================================
  // SEARCH
  // ======================================================

  const filteredOrders =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return orders;
      }

      return orders.filter(
        (order) => {
          const orderMatch =
            order.order_number
              ?.toLowerCase()
              .includes(query);

          const statusMatch =
            order.status
              ?.toLowerCase()
              .includes(query);

          const itemMatch =
            order.items?.some(
              (item) =>
                item.product_name
                  ?.toLowerCase()
                  .includes(query)
            );

          return (
            orderMatch ||
            statusMatch ||
            itemMatch
          );
        }
      );
    }, [
      orders,
      search,
    ]);


  // ======================================================
  // VIEW ORDER
  // ======================================================

  async function viewOrder(
    orderId: number
  ) {
    const token =
      localStorage.getItem(
        "ostren-access-token"
      );

    if (!token) {
      setError(
        "Please login again to view this order."
      );

      return;
    }

    setError("");
    setLoadingOrderId(
      orderId
    );

    try {
      const response =
        await fetch(
          `${API_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data:
        OrderResponse =
          await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.order
      ) {
        setError(
          data.message ||
            "Unable to load order details."
        );

        return;
      }

      setSelectedOrder(
        data.order
      );
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setLoadingOrderId(
        null
      );
    }
  }


  // ======================================================
  // PAGE
  // ======================================================

  return (
    <ProtectedAccount>

      <main className="min-h-screen bg-[var(--ostren-off-white)] text-[#111111]">

        <AnnouncementBar />

        <Navbar />


        <section className="px-5 py-14 md:px-8 md:py-20 lg:px-12">

          <div className="mx-auto max-w-[1200px]">

            {/* HEADER */}

            <p className="text-[9px] font-semibold tracking-[0.24em] text-black/35 uppercase">
              My Account
            </p>

            <h1 className="mt-3 text-[40px] font-medium tracking-[-0.04em] md:text-[54px]">
              Orders
            </h1>


            {/* ACCOUNT LAYOUT */}

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">

              <AccountSidebar />


              <div className="min-w-0">

                {/* TOP */}

                {!loading &&
                  orders.length >
                    0 && (
                    <div className="mb-6 flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">

                      <div>

                        <p className="text-[8px] font-semibold tracking-[0.18em] text-black/35 uppercase">
                          Order History
                        </p>

                        <h2 className="mt-2 text-[25px] font-medium tracking-[-0.03em]">
                          Your Orders
                        </h2>

                        <p className="mt-2 text-[9px] text-black/40">
                          {orders.length}{" "}
                          {orders.length ===
                          1
                            ? "order"
                            : "orders"}{" "}
                          placed
                        </p>

                      </div>


                      <div className="relative w-full sm:w-[260px]">

                        <Search
                          size={14}
                          strokeWidth={1.4}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                        />

                        <input
                          type="search"
                          value={
                            search
                          }
                          onChange={(
                            event
                          ) =>
                            setSearch(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="Search orders..."
                          className="h-[44px] w-full border border-black/10 bg-transparent pl-11 pr-4 text-[9px] outline-none transition placeholder:text-black/30 focus:border-black"
                        />

                      </div>

                    </div>
                  )}


                {/* ERROR */}

                {error && (
                  <div className="mb-6 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

                    <p className="text-[10px] leading-5 text-red-800">
                      {error}
                    </p>

                  </div>
                )}


                {/* LOADING */}

                {loading && (
                  <div className="flex min-h-[400px] flex-col items-center justify-center border border-black/10 bg-[#F8F5EF]">

                    <Loader2
                      size={24}
                      strokeWidth={1.2}
                      className="animate-spin text-black/30"
                    />

                    <p className="mt-4 text-[8px] font-semibold tracking-[0.17em] text-black/30 uppercase">
                      Loading orders...
                    </p>

                  </div>
                )}


                {/* NO ORDERS */}

                {!loading &&
                  orders.length ===
                    0 && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center border border-black/10 bg-[#F8F5EF] p-8 text-center">

                      <Package
                        size={31}
                        strokeWidth={1.2}
                        className="text-black/30"
                      />

                      <h2 className="mt-5 text-[25px] font-medium tracking-[-0.03em]">
                        No orders yet.
                      </h2>

                      <p className="mt-3 max-w-sm text-[10px] leading-5 text-black/40">
                        Your Ostren Fit
                        orders will appear
                        here after you make
                        a purchase.
                      </p>

                      <Link
                        href="/shop"
                        className="mt-7 flex h-[44px] items-center justify-center bg-[#111111] px-7 text-[8px] font-semibold tracking-[0.14em] !text-white uppercase transition hover:bg-black/75"
                      >
                        Shop Now
                      </Link>

                    </div>
                  )}


                {/* SEARCH EMPTY */}

                {!loading &&
                  orders.length > 0 &&
                  filteredOrders.length ===
                    0 && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center border-y border-black/10 text-center">

                      <Search
                        size={26}
                        strokeWidth={1.1}
                        className="text-black/25"
                      />

                      <p className="mt-4 text-[11px] font-medium">
                        No matching
                        orders.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                        className="mt-4 text-[8px] font-semibold tracking-[0.12em] uppercase underline underline-offset-4"
                      >
                        Clear Search
                      </button>

                    </div>
                  )}


                {/* ORDERS */}

                {!loading &&
                  filteredOrders.length >
                    0 && (
                    <div className="space-y-4">

                      {filteredOrders.map(
                        (order) => (
                          <article
                            key={
                              order.id
                            }
                            className="border border-black/10 bg-[#F8F5EF]"
                          >

                            {/* TOP */}

                            <div className="flex flex-col gap-5 border-b border-black/10 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">

                              <div className="flex flex-wrap gap-x-8 gap-y-4">

                                <OrderInfo
                                  label="Order"
                                  value={
                                    order.order_number
                                  }
                                />

                                <OrderInfo
                                  label="Placed"
                                  value={
                                    formatDate(
                                      order.created_at
                                    )
                                  }
                                />

                                <OrderInfo
                                  label="Total"
                                  value={
                                    formatMoney(
                                      order.total
                                    )
                                  }
                                />

                              </div>


                              <OrderStatusBadge
                                status={
                                  order.status
                                }
                              />

                            </div>


                            {/* BODY */}

                            <div className="px-5 py-6">

                              <OrderProgress
                                status={
                                  order.status
                                }
                              />


                              <div className="mt-7 flex flex-col gap-5 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                <div className="min-w-0">

                                  <p className="text-[8px] text-black/40">
                                    {order
                                      .items
                                      ?.length ||
                                      0}{" "}
                                    {order
                                      .items
                                      ?.length ===
                                    1
                                      ? "item"
                                      : "items"}
                                    {" · "}
                                    {formatPaymentMethod(
                                      order.payment_method
                                    )}
                                  </p>

                                  <p className="mt-1.5 line-clamp-1 text-[10px] font-medium">
                                    {order
                                      .items
                                      ?.map(
                                        (
                                          item
                                        ) =>
                                          item.product_name
                                      )
                                      .join(
                                        ", "
                                      )}
                                  </p>

                                </div>


                                <button
                                  type="button"
                                  onClick={() =>
                                    viewOrder(
                                      order.id
                                    )
                                  }
                                  disabled={
                                    loadingOrderId ===
                                    order.id
                                  }
                                  className="flex h-[42px] shrink-0 items-center justify-center gap-2 border border-black/15 px-5 text-[7px] font-semibold tracking-[0.13em] uppercase transition hover:bg-black hover:!text-white disabled:opacity-50"
                                >

                                  {loadingOrderId ===
                                  order.id ? (
                                    <Loader2
                                      size={12}
                                      strokeWidth={1.4}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Eye
                                      size={12}
                                      strokeWidth={1.4}
                                    />
                                  )}

                                  View Details

                                </button>

                              </div>

                            </div>

                          </article>
                        )
                      )}

                    </div>
                  )}

              </div>

            </div>

          </div>

        </section>


        <Footer />


        {/* ================================================
            ORDER DETAILS MODAL
        ================================================= */}

        {selectedOrder && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
            onMouseDown={() =>
              setSelectedOrder(
                null
              )
            }
          >

            <div
              className="max-h-[92vh] w-full max-w-[680px] overflow-y-auto bg-[#f5f2ec] shadow-2xl"
              onMouseDown={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-[#f5f2ec] px-6 py-5">

                <div>

                  <p className="text-[7px] font-semibold tracking-[0.18em] text-black/35 uppercase">
                    Order Details
                  </p>

                  <h3 className="mt-1 text-[18px] font-medium">
                    {
                      selectedOrder.order_number
                    }
                  </h3>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedOrder(
                      null
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center transition hover:bg-black hover:text-white"
                  aria-label="Close order details"
                >
                  <X
                    size={15}
                    strokeWidth={1.4}
                  />
                </button>

              </div>


              <div className="p-6">

                {/* STATUS */}

                <div className="border-b border-black/10 pb-6">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-[7px] font-semibold tracking-[0.14em] text-black/30 uppercase">
                        Current Status
                      </p>

                      <p className="mt-1.5 text-[9px] text-black/40">
                        {formatDate(
                          selectedOrder.created_at
                        )}
                      </p>

                    </div>

                    <OrderStatusBadge
                      status={
                        selectedOrder.status
                      }
                    />

                  </div>


                  <div className="mt-6">

                    <OrderProgress
                      status={
                        selectedOrder.status
                      }
                    />

                  </div>

                </div>


                {/* ITEMS */}

                <div className="border-b border-black/10 py-6">

                  <SectionTitle>
                    Order Items
                  </SectionTitle>


                  <div className="mt-5 divide-y divide-black/10">

                    {selectedOrder.items.map(
                      (item) => (
                        <div
                          key={
                            item.id
                          }
                          className="flex items-start justify-between gap-5 py-4 first:pt-0"
                        >

                          <div className="min-w-0">

                            <p className="text-[10px] font-medium">
                              {
                                item.product_name
                              }
                            </p>

                            <p className="mt-1 text-[8px] text-black/40">
                              Quantity:{" "}
                              {
                                item.quantity
                              }

                              {item.sku
                                ? ` · SKU: ${item.sku}`
                                : ""}
                            </p>

                            <p className="mt-1 text-[8px] text-black/35">
                              {formatMoney(
                                item.unit_price
                              )}{" "}
                              each
                            </p>

                          </div>


                          <p className="shrink-0 text-[10px] font-medium">
                            {formatMoney(
                              item.line_total
                            )}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>


                {/* DELIVERY + PAYMENT */}

                <div className="grid gap-7 border-b border-black/10 py-6 sm:grid-cols-2">

                  <div>

                    <SectionTitle>
                      Delivery Address
                    </SectionTitle>


                    <div className="mt-4 flex gap-3">

                      <MapPin
                        size={14}
                        strokeWidth={1.3}
                        className="mt-0.5 shrink-0 text-black/35"
                      />

                      <p className="text-[10px] leading-5 text-black/60">
                        {
                          selectedOrder.full_name
                        }
                        <br />

                        {
                          selectedOrder.address
                        }
                        <br />

                        {
                          selectedOrder.city
                        }
                        ,{" "}
                        {
                          selectedOrder.state
                        }
                        <br />

                        {
                          selectedOrder.pincode
                        }
                        <br />

                        {
                          selectedOrder.phone
                        }
                      </p>

                    </div>

                  </div>


                  <div>

                    <SectionTitle>
                      Payment
                    </SectionTitle>


                    <div className="mt-4 flex gap-3">

                      <WalletCards
                        size={14}
                        strokeWidth={1.3}
                        className="mt-0.5 shrink-0 text-black/35"
                      />

                      <div>

                        <p className="text-[10px] font-medium">
                          {formatPaymentMethod(
                            selectedOrder.payment_method
                          )}
                        </p>

                        <p className="mt-1.5 text-[8px] capitalize text-black/40">
                          Payment{" "}
                          {
                            selectedOrder.payment_status
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* SUMMARY */}

                <div className="py-6">

                  <SectionTitle>
                    Order Summary
                  </SectionTitle>


                  <div className="mt-5 space-y-3">

                    <SummaryRow
                      label="Subtotal"
                      value={
                        formatMoney(
                          selectedOrder.subtotal
                        )
                      }
                    />

                    <SummaryRow
                      label="Shipping"
                      value={
                        selectedOrder.shipping ===
                        0
                          ? "Free"
                          : formatMoney(
                              selectedOrder.shipping
                            )
                      }
                    />

                    <div className="my-4 h-px bg-black/10" />


                    <div className="flex items-center justify-between">

                      <p className="text-[10px] font-medium">
                        Total
                      </p>

                      <p className="text-[18px] font-medium tracking-[-0.02em]">
                        {formatMoney(
                          selectedOrder.total
                        )}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </ProtectedAccount>
  );
}


// ========================================================
// ORDER PROGRESS
// ========================================================

function OrderProgress({
  status,
}: {
  status: OrderStatus;
}) {
  if (
    status === "cancelled"
  ) {
    return (
      <div className="flex items-center gap-3 border border-red-900/15 bg-red-950/[0.03] p-4">

        <XCircle
          size={16}
          strokeWidth={1.3}
          className="shrink-0 text-red-700"
        />

        <div>

          <p className="text-[9px] font-medium text-red-800">
            Order Cancelled
          </p>

          <p className="mt-1 text-[8px] leading-4 text-red-800/60">
            This order is no longer
            being processed.
          </p>

        </div>

      </div>
    );
  }


  const steps = [
    {
      label: "Placed",
      icon: Package,
    },
    {
      label: "Confirmed",
      icon: Check,
    },
    {
      label: "Shipped",
      icon: Truck,
    },
    {
      label: "Delivered",
      icon: PackageCheck,
    },
  ];


  const rank = {
    pending: 0,
    confirmed: 1,
    shipped: 2,
    delivered: 3,
  };


  const currentRank =
    rank[
      status as keyof typeof rank
    ] ?? 0;


  return (
    <div className="grid grid-cols-4">

      {steps.map(
        (step, index) => {
          const Icon =
            step.icon;

          const complete =
            index <=
            currentRank;

          return (
            <div
              key={
                step.label
              }
              className="relative text-center"
            >

              {index !== 0 && (
                <div
                  className={`absolute right-1/2 top-[14px] h-px w-full ${
                    index <=
                    currentRank
                      ? "bg-black"
                      : "bg-black/15"
                  }`}
                />
              )}


              <div
                className={`relative z-[1] mx-auto flex h-7 w-7 items-center justify-center rounded-full border ${
                  complete
                    ? "border-black bg-black text-white"
                    : "border-black/15 bg-[var(--ostren-off-white)] text-black/25"
                }`}
              >
                <Icon
                  size={11}
                  strokeWidth={1.5}
                />
              </div>


              <p
                className={`mt-2 text-[6px] font-semibold tracking-[0.07em] uppercase sm:text-[7px] ${
                  complete
                    ? "text-black"
                    : "text-black/25"
                }`}
              >
                {step.label}
              </p>

            </div>
          );
        }
      )}

    </div>
  );
}


// ========================================================
// STATUS BADGE
// ========================================================

function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const styles:
    Record<
      OrderStatus,
      string
    > = {
      pending:
        "border border-black/15 text-black/55",

      confirmed:
        "bg-[#111111] !text-white",

      shipped:
        "bg-[#111111] !text-white",

      delivered:
        "bg-[#111111] !text-white",

      cancelled:
        "border border-red-800/20 text-red-700",
    };


  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[7px] font-semibold tracking-[0.11em] uppercase ${styles[status]}`}
    >

      {status ===
        "pending" && (
        <Clock3
          size={9}
          strokeWidth={1.5}
        />
      )}

      {status ===
        "shipped" && (
        <Truck
          size={9}
          strokeWidth={1.5}
        />
      )}

      {status ===
        "delivered" && (
        <PackageCheck
          size={9}
          strokeWidth={1.5}
        />
      )}

      {status ===
        "cancelled" && (
        <XCircle
          size={9}
          strokeWidth={1.5}
        />
      )}

      {capitalize(status)}

    </span>
  );
}


// ========================================================
// SMALL COMPONENTS
// ========================================================

function OrderInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[7px] font-semibold tracking-[0.14em] text-black/30 uppercase">
        {label}
      </p>

      <p className="mt-1.5 text-[9px] font-medium">
        {value}
      </p>

    </div>
  );
}


function SectionTitle({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <p className="text-[8px] font-semibold tracking-[0.17em] text-black/35 uppercase">
      {children}
    </p>
  );
}


function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-[9px] text-black/45">
        {label}
      </span>

      <span className="text-[9px] font-medium">
        {value}
      </span>

    </div>
  );
}


// ========================================================
// FORMATTERS
// ========================================================

function formatMoney(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  );
}


function formatPaymentMethod(
  value: string
) {
  if (
    value?.toLowerCase() ===
    "cod"
  ) {
    return "Cash on Delivery";
  }

  return value || "—";
}


function formatDate(
  value?: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}


function capitalize(
  value: string
) {
  if (!value) {
    return "";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}