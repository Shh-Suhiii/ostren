"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Loader2,
  MapPin,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";


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


const statusOptions: {
  label: string;
  value: "all" | OrderStatus;
}[] = [
  {
    label: "All Orders",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Confirmed",
    value: "confirmed",
  },
  {
    label: "Shipped",
    value: "shipped",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];


export default function AdminOrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<
      "all" | OrderStatus
    >("all");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    selectedOrder,
    setSelectedOrder,
  ] =
    useState<Order | null>(
      null
    );

  const [
    loadingOrder,
    setLoadingOrder,
  ] = useState(false);

  const [
    statusOrder,
    setStatusOrder,
  ] =
    useState<Order | null>(
      null
    );

  const [
    nextStatus,
    setNextStatus,
  ] =
    useState<OrderStatus | "">(
      ""
    );

  const [
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);


  // ======================================================
  // LOAD ORDERS
  // ======================================================

  useEffect(() => {
    async function loadOrders() {
      const token =
        localStorage.getItem(
          "ostren-admin-token"
        );

      if (!token) {
        setError(
          "Admin session expired. Please login again."
        );

        setLoading(false);

        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/admin/orders`,
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
              "Unable to load orders."
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
  // FILTER ORDERS
  // ======================================================

  const filteredOrders =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const matchesStatus =
            statusFilter === "all" ||
            order.status ===
              statusFilter;

          const matchesSearch =
            !query ||
            order.order_number
              ?.toLowerCase()
              .includes(query) ||
            order.full_name
              ?.toLowerCase()
              .includes(query) ||
            order.email
              ?.toLowerCase()
              .includes(query) ||
            order.phone
              ?.toLowerCase()
              .includes(query);

          return (
            matchesStatus &&
            matchesSearch
          );
        }
      );
    }, [
      orders,
      search,
      statusFilter,
    ]);


  // ======================================================
  // COUNTS
  // ======================================================

  const pendingCount =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
            "pending"
        ).length,
      [orders]
    );

  const activeCount =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
              "confirmed" ||
            order.status ===
              "shipped"
        ).length,
      [orders]
    );

  const deliveredCount =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
            "delivered"
        ).length,
      [orders]
    );


  // ======================================================
  // VIEW ORDER
  // ======================================================

  async function viewOrder(
    orderId: number
  ) {
    const token =
      localStorage.getItem(
        "ostren-admin-token"
      );

    if (!token) {
      setError(
        "Admin session expired. Please login again."
      );

      return;
    }

    setError("");
    setLoadingOrder(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/admin/orders/${orderId}`,
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
            "Unable to load order."
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
      setLoadingOrder(false);
    }
  }


  // ======================================================
  // OPEN STATUS CONFIRMATION
  // ======================================================

  function openStatusUpdate(
    order: Order,
    status: OrderStatus
  ) {
    if (
      order.status ===
        "delivered" ||
      order.status ===
        "cancelled"
    ) {
      return;
    }

    if (
      order.status === status
    ) {
      return;
    }

    setStatusOrder(order);
    setNextStatus(status);
  }


  // ======================================================
  // UPDATE STATUS
  // ======================================================

  async function updateStatus() {
    if (
      !statusOrder ||
      !nextStatus
    ) {
      return;
    }

    const token =
      localStorage.getItem(
        "ostren-admin-token"
      );

    if (!token) {
      setError(
        "Admin session expired. Please login again."
      );

      return;
    }

    setUpdatingStatus(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `${API_URL}/api/admin/orders/${statusOrder.id}/status`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                status:
                  nextStatus,
              }),
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
            "Unable to update order status."
        );

        return;
      }

      const updatedOrder =
        data.order;

      setOrders(
        (current) =>
          current.map(
            (order) =>
              order.id ===
              updatedOrder.id
                ? updatedOrder
                : order
          )
      );

      setSelectedOrder(
        (current) =>
          current?.id ===
          updatedOrder.id
            ? updatedOrder
            : current
      );

      setSuccess(
        data.message ||
          "Order status updated successfully."
      );

      setStatusOrder(null);
      setNextStatus("");
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setUpdatingStatus(false);
    }
  }


  // ======================================================
  // PAGE
  // ======================================================

  return (
    <AdminShell>

      <main className="min-h-screen">

        {/* HEADER */}

        <header className="border-b border-black/10">

          <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center px-5 md:px-8 lg:px-10">

            <div>

              <p className="text-[7px] font-semibold tracking-[0.23em] text-black/35 uppercase">
                Management
              </p>

              <h1 className="mt-1.5 text-[23px] font-medium tracking-[-0.03em]">
                Orders
              </h1>

            </div>

          </div>

        </header>


        <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">

          {/* INTRO */}

          <div className="flex flex-col gap-5 border-b border-black/10 pb-7 xl:flex-row xl:items-end xl:justify-between">

            <div>

              <p className="text-[8px] font-semibold tracking-[0.2em] text-black/35 uppercase">
                Store Orders
              </p>

              <h2 className="mt-2 text-[30px] font-medium tracking-[-0.04em]">
                All Orders
              </h2>

              <p className="mt-2 text-[10px] text-black/40">
                Review purchases,
                delivery details and
                manage fulfilment.
              </p>

            </div>


            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">

              {/* SEARCH */}

              <div className="relative w-full sm:w-[300px]">

                <Search
                  size={15}
                  strokeWidth={1.4}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search order or customer..."
                  className="h-[46px] w-full border border-black/10 bg-transparent pl-11 pr-4 text-[10px] outline-none transition placeholder:text-black/30 focus:border-black"
                />

              </div>


              {/* FILTER */}

              <div className="relative w-full sm:w-[170px]">

                <select
                  value={
                    statusFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setStatusFilter(
                      event.target
                        .value as
                        | "all"
                        | OrderStatus
                    )
                  }
                  className="h-[46px] w-full appearance-none border border-black/10 bg-transparent px-4 pr-10 text-[9px] font-medium outline-none focus:border-black"
                >
                  {statusOptions.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={13}
                  strokeWidth={1.4}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
                />

              </div>

            </div>

          </div>


          {/* STATS */}

          {!loading && (
            <div className="grid border-b border-black/10 sm:grid-cols-4">

              <StatItem
                label="Total Orders"
                value={
                  orders.length
                }
              />

              <StatItem
                label="Pending"
                value={
                  pendingCount
                }
              />

              <StatItem
                label="In Progress"
                value={
                  activeCount
                }
              />

              <StatItem
                label="Delivered"
                value={
                  deliveredCount
                }
              />

            </div>
          )}


          {/* ERROR */}

          {error && (
            <div className="mt-6 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

              <p className="text-[10px] leading-5 text-red-800">
                {error}
              </p>

            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="mt-6 flex items-center gap-3 border border-black/10 bg-white/40 px-4 py-3">

              <Check
                size={14}
                strokeWidth={1.4}
              />

              <p className="text-[10px]">
                {success}
              </p>

            </div>
          )}


          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[400px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-5 w-5 animate-spin rounded-full border border-black/15 border-t-black" />

                <p className="mt-4 text-[8px] font-semibold tracking-[0.18em] text-black/30 uppercase">
                  Loading orders...
                </p>

              </div>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            filteredOrders.length ===
              0 && (
              <div className="flex min-h-[350px] flex-col items-center justify-center border-b border-black/10 text-center">

                <ShoppingBag
                  size={28}
                  strokeWidth={1.1}
                  className="text-black/25"
                />

                <p className="mt-4 text-[11px] font-medium">
                  No orders found.
                </p>

                <p className="mt-2 text-[9px] text-black/35">
                  Customer orders will
                  appear here.
                </p>

              </div>
            )}


          {/* DESKTOP TABLE */}

          {!loading &&
            filteredOrders.length >
              0 && (
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full border-collapse">

                  <thead>

                    <tr className="border-b border-black/10">

                      <TableHeading>
                        Order
                      </TableHeading>

                      <TableHeading>
                        Customer
                      </TableHeading>

                      <TableHeading>
                        Amount
                      </TableHeading>

                      <TableHeading>
                        Payment
                      </TableHeading>

                      <TableHeading>
                        Status
                      </TableHeading>

                      <TableHeading>
                        Date
                      </TableHeading>

                      <TableHeading align="right">
                        Actions
                      </TableHeading>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredOrders.map(
                      (order) => (
                        <tr
                          key={
                            order.id
                          }
                          className="border-b border-black/10 transition hover:bg-white/35"
                        >

                          {/* ORDER */}

                          <td className="py-5 pr-5">

                            <p className="text-[10px] font-semibold">
                              {
                                order.order_number
                              }
                            </p>

                            <p className="mt-1 text-[7px] tracking-[0.12em] text-black/30 uppercase">
                              {order.items
                                ?.length ||
                                0}{" "}
                              {order.items
                                ?.length ===
                              1
                                ? "Item"
                                : "Items"}
                            </p>

                          </td>


                          {/* CUSTOMER */}

                          <td className="px-3 py-5">

                            <p className="max-w-[180px] truncate text-[10px] font-medium">
                              {
                                order.full_name
                              }
                            </p>

                            <p className="mt-1 max-w-[200px] truncate text-[8px] text-black/40">
                              {
                                order.email
                              }
                            </p>

                          </td>


                          {/* TOTAL */}

                          <td className="px-3 py-5">

                            <p className="text-[10px] font-medium">
                              {formatMoney(
                                order.total
                              )}
                            </p>

                          </td>


                          {/* PAYMENT */}

                          <td className="px-3 py-5">

                            <p className="text-[8px] font-medium uppercase">
                              {formatPaymentMethod(
                                order.payment_method
                              )}
                            </p>

                            <p className="mt-1 text-[7px] tracking-[0.1em] text-black/35 uppercase">
                              {
                                order.payment_status
                              }
                            </p>

                          </td>


                          {/* STATUS */}

                          <td className="px-3 py-5">

                            <OrderStatusBadge
                              status={
                                order.status
                              }
                            />

                          </td>


                          {/* DATE */}

                          <td className="px-3 py-5">

                            <p className="text-[9px] text-black/50">
                              {formatDate(
                                order.created_at
                              )}
                            </p>

                          </td>


                          {/* ACTION */}

                          <td className="py-5 pl-3">

                            <div className="flex justify-end">

                              <button
                                type="button"
                                onClick={() =>
                                  viewOrder(
                                    order.id
                                  )
                                }
                                disabled={
                                  loadingOrder
                                }
                                className="flex h-9 items-center gap-2 border border-black/10 px-3 text-[7px] font-semibold tracking-[0.12em] uppercase transition hover:bg-black hover:!text-white"
                              >
                                <Eye
                                  size={12}
                                  strokeWidth={1.4}
                                />

                                View
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


          {/* MOBILE */}

          {!loading &&
            filteredOrders.length >
              0 && (
              <div className="divide-y divide-black/10 md:hidden">

                {filteredOrders.map(
                  (order) => (
                    <article
                      key={
                        order.id
                      }
                      className="py-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <p className="text-[10px] font-semibold">
                            {
                              order.order_number
                            }
                          </p>

                          <p className="mt-1 truncate text-[9px] text-black/45">
                            {
                              order.full_name
                            }
                          </p>

                        </div>

                        <OrderStatusBadge
                          status={
                            order.status
                          }
                        />

                      </div>


                      <div className="mt-5 grid grid-cols-2 gap-4">

                        <SmallInfo
                          label="Amount"
                          value={
                            formatMoney(
                              order.total
                            )
                          }
                        />

                        <SmallInfo
                          label="Payment"
                          value={
                            formatPaymentMethod(
                              order.payment_method
                            )
                          }
                        />

                        <SmallInfo
                          label="Items"
                          value={`${order.items?.length || 0}`}
                        />

                        <SmallInfo
                          label="Date"
                          value={
                            formatDate(
                              order.created_at
                            )
                          }
                        />

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          viewOrder(
                            order.id
                          )
                        }
                        className="mt-5 flex h-10 w-full items-center justify-center gap-2 border border-black/10 text-[7px] font-semibold tracking-[0.12em] uppercase"
                      >
                        <Eye
                          size={12}
                          strokeWidth={1.4}
                        />

                        View Order
                      </button>

                    </article>
                  )
                )}

              </div>
            )}

        </section>


        {/* =================================================
            ORDER DETAIL MODAL
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
              className="max-h-[92vh] w-full max-w-[720px] overflow-y-auto bg-[#f5f2ec] shadow-2xl"
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
                >
                  <X
                    size={15}
                    strokeWidth={1.4}
                  />
                </button>

              </div>


              <div className="p-6">

                {/* TOP STATUS */}

                <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-[7px] font-semibold tracking-[0.14em] text-black/30 uppercase">
                      Placed
                    </p>

                    <p className="mt-1.5 text-[10px]">
                      {formatDateTime(
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


                {/* CUSTOMER + DELIVERY */}

                <div className="grid gap-7 border-b border-black/10 py-6 sm:grid-cols-2">

                  <div>

                    <SectionTitle>
                      Customer
                    </SectionTitle>

                    <div className="mt-4 space-y-3">

                      <DetailItem
                        label="Name"
                        value={
                          selectedOrder.full_name
                        }
                      />

                      <DetailItem
                        label="Email"
                        value={
                          selectedOrder.email
                        }
                      />

                      <DetailItem
                        label="Phone"
                        value={
                          selectedOrder.phone
                        }
                      />

                    </div>

                  </div>


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

                      <p className="text-[10px] leading-5 text-black/65">
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
                      </p>

                    </div>

                  </div>

                </div>


                {/* ITEMS */}

                <div className="border-b border-black/10 py-6">

                  <div className="flex items-center justify-between">

                    <SectionTitle>
                      Order Items
                    </SectionTitle>

                    <span className="text-[8px] text-black/35">
                      {selectedOrder.items
                        ?.length ||
                        0}{" "}
                      items
                    </span>

                  </div>


                  <div className="mt-5 divide-y divide-black/10">

                    {selectedOrder.items?.map(
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
                              Qty:{" "}
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


                {/* TOTALS */}

                <div className="border-b border-black/10 py-6">

                  <SectionTitle>
                    Payment Summary
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

                      <span className="text-[10px] font-medium">
                        Total
                      </span>

                      <span className="text-[17px] font-medium">
                        {formatMoney(
                          selectedOrder.total
                        )}
                      </span>

                    </div>

                  </div>


                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    <div className="border border-black/10 p-4">

                      <div className="flex items-center gap-2">

                        <WalletCards
                          size={14}
                          strokeWidth={1.3}
                        />

                        <p className="text-[7px] font-semibold tracking-[0.14em] text-black/35 uppercase">
                          Payment Method
                        </p>

                      </div>

                      <p className="mt-3 text-[10px] font-medium">
                        {formatPaymentMethod(
                          selectedOrder.payment_method
                        )}
                      </p>

                    </div>


                    <div className="border border-black/10 p-4">

                      <p className="text-[7px] font-semibold tracking-[0.14em] text-black/35 uppercase">
                        Payment Status
                      </p>

                      <p className="mt-3 text-[10px] font-medium capitalize">
                        {
                          selectedOrder.payment_status
                        }
                      </p>

                    </div>

                  </div>

                </div>


                {/* STATUS MANAGEMENT */}

                <div className="pt-6">

                  <SectionTitle>
                    Fulfilment
                  </SectionTitle>

                  {selectedOrder.status ===
                    "delivered" && (
                    <div className="mt-4 flex gap-3 border border-black/10 bg-white/40 p-4">

                      <PackageCheck
                        size={16}
                        strokeWidth={1.3}
                      />

                      <p className="text-[9px] leading-5 text-black/55">
                        This order has
                        been delivered and
                        is complete.
                      </p>

                    </div>
                  )}


                  {selectedOrder.status ===
                    "cancelled" && (
                    <div className="mt-4 flex gap-3 border border-red-900/15 bg-red-950/[0.04] p-4">

                      <XCircle
                        size={16}
                        strokeWidth={1.3}
                        className="text-red-700"
                      />

                      <p className="text-[9px] leading-5 text-red-800">
                        This order was
                        cancelled. Product
                        stock has been
                        restored.
                      </p>

                    </div>
                  )}


                  {selectedOrder.status !==
                    "delivered" &&
                    selectedOrder.status !==
                      "cancelled" && (
                      <div className="mt-5">

                        <p className="mb-3 text-[8px] text-black/40">
                          Update order
                          status
                        </p>

                        <div className="grid gap-2 sm:grid-cols-2">

                          {getAvailableStatuses(
                            selectedOrder.status
                          ).map(
                            (
                              option
                            ) => (
                              <button
                                key={
                                  option.value
                                }
                                type="button"
                                onClick={() =>
                                  openStatusUpdate(
                                    selectedOrder,
                                    option.value
                                  )
                                }
                                className={
                                  option.value ===
                                  "cancelled"
                                    ? "flex h-[44px] items-center justify-center gap-2 border border-red-900/15 text-[7px] font-semibold tracking-[0.12em] text-red-700 uppercase transition hover:bg-red-700 hover:!text-white"
                                    : "flex h-[44px] items-center justify-center gap-2 bg-[#111111] text-[7px] font-semibold tracking-[0.12em] !text-white uppercase transition hover:bg-black/75"
                                }
                              >
                                {
                                  option.icon
                                }

                                {
                                  option.label
                                }
                              </button>
                            )
                          )}

                        </div>

                      </div>
                    )}

                </div>

              </div>

            </div>

          </div>
        )}


        {/* =================================================
            STATUS CONFIRMATION
        ================================================= */}

        {statusOrder &&
          nextStatus && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4"
              onMouseDown={() => {
                if (
                  !updatingStatus
                ) {
                  setStatusOrder(
                    null
                  );

                  setNextStatus(
                    ""
                  );
                }
              }}
            >

              <div
                className="w-full max-w-[430px] bg-[#f5f2ec] p-6 shadow-2xl"
                onMouseDown={(
                  event
                ) =>
                  event.stopPropagation()
                }
              >

                <p className="text-[7px] font-semibold tracking-[0.18em] text-black/35 uppercase">
                  Confirm Status
                </p>


                <h3 className="mt-3 text-[22px] font-medium tracking-[-0.03em]">
                  {nextStatus ===
                  "cancelled"
                    ? "Cancel this order?"
                    : `Mark as ${capitalize(nextStatus)}?`}
                </h3>


                <p className="mt-3 text-[10px] leading-5 text-black/45">
                  {nextStatus ===
                  "cancelled"
                    ? "This action will cancel the order and restore its product stock. Cancelled orders cannot be reopened."
                    : `Order ${statusOrder.order_number} will be updated to ${capitalize(nextStatus)}.`}
                </p>


                <div className="mt-7 flex gap-3">

                  <button
                    type="button"
                    disabled={
                      updatingStatus
                    }
                    onClick={() => {
                      setStatusOrder(
                        null
                      );

                      setNextStatus(
                        ""
                      );
                    }}
                    className="h-[46px] flex-1 border border-black/10 text-[8px] font-semibold tracking-[0.14em] uppercase transition hover:border-black disabled:opacity-50"
                  >
                    Back
                  </button>


                  <button
                    type="button"
                    disabled={
                      updatingStatus
                    }
                    onClick={
                      updateStatus
                    }
                    className={
                      nextStatus ===
                      "cancelled"
                        ? "flex h-[46px] flex-1 items-center justify-center gap-2 bg-red-700 text-[8px] font-semibold tracking-[0.14em] !text-white uppercase transition hover:bg-red-800 disabled:opacity-50"
                        : "flex h-[46px] flex-1 items-center justify-center gap-2 bg-[#111111] text-[8px] font-semibold tracking-[0.14em] !text-white uppercase transition hover:bg-black/75 disabled:opacity-50"
                    }
                  >

                    {updatingStatus ? (
                      <>
                        <Loader2
                          size={13}
                          strokeWidth={1.4}
                          className="animate-spin"
                        />

                        Updating...
                      </>
                    ) : nextStatus ===
                      "cancelled" ? (
                      "Cancel Order"
                    ) : (
                      "Confirm"
                    )}

                  </button>

                </div>

              </div>

            </div>
          )}

      </main>

    </AdminShell>
  );
}


// ========================================================
// STATUS OPTIONS
// ========================================================

function getAvailableStatuses(
  status: OrderStatus
) {
  if (status === "pending") {
    return [
      {
        label:
          "Confirm Order",
        value:
          "confirmed" as OrderStatus,
        icon: (
          <Check
            size={13}
            strokeWidth={1.4}
          />
        ),
      },
      {
        label:
          "Cancel Order",
        value:
          "cancelled" as OrderStatus,
        icon: (
          <XCircle
            size={13}
            strokeWidth={1.4}
          />
        ),
      },
    ];
  }

  if (
    status === "confirmed"
  ) {
    return [
      {
        label:
          "Mark Shipped",
        value:
          "shipped" as OrderStatus,
        icon: (
          <Truck
            size={13}
            strokeWidth={1.4}
          />
        ),
      },
      {
        label:
          "Cancel Order",
        value:
          "cancelled" as OrderStatus,
        icon: (
          <XCircle
            size={13}
            strokeWidth={1.4}
          />
        ),
      },
    ];
  }

  if (
    status === "shipped"
  ) {
    return [
      {
        label:
          "Mark Delivered",
        value:
          "delivered" as OrderStatus,
        icon: (
          <PackageCheck
            size={13}
            strokeWidth={1.4}
          />
        ),
      },
    ];
  }

  return [];
}


// ========================================================
// COMPONENTS
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
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-[7px] font-semibold tracking-[0.11em] uppercase ${styles[status]}`}
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


function StatItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border-black/10 px-0 py-5 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">

      <p className="text-[7px] font-semibold tracking-[0.16em] text-black/35 uppercase">
        {label}
      </p>

      <p className="mt-2 text-[21px] font-medium tracking-[-0.03em]">
        {value}
      </p>

    </div>
  );
}


function TableHeading({
  children,
  align = "left",
}: {
  children:
    React.ReactNode;
  align?:
    | "left"
    | "right";
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


function DetailItem({
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

      <p className="mt-1.5 break-words text-[10px]">
        {value || "—"}
      </p>

    </div>
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

      <p className="mt-1 truncate text-[9px]">
        {value}
      </p>

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

  return (
    value || "—"
  );
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


function formatDateTime(
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
      hour: "2-digit",
      minute: "2-digit",
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