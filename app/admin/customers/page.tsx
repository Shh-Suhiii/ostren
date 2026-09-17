"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Eye,
  Loader2,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";


type Customer = {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  role: string;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};


type CustomersResponse = {
  success: boolean;
  message?: string;
  count?: number;
  customers?: Customer[];
};


type CustomerResponse = {
  success: boolean;
  message?: string;
  customer?: Customer;
};


export default function AdminCustomersPage() {
  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>([]);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] =
    useState<Customer | null>(
      null
    );

  const [
    loadingCustomer,
    setLoadingCustomer,
  ] =
    useState(false);

  const [
    statusCustomer,
    setStatusCustomer,
  ] =
    useState<Customer | null>(
      null
    );

  const [
    updatingStatus,
    setUpdatingStatus,
  ] =
    useState(false);


  // ======================================================
  // LOAD CUSTOMERS
  // ======================================================

  useEffect(() => {
    async function loadCustomers() {
      const token =
        localStorage.getItem(
          "ostren-admin-token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/admin/customers`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data:
          CustomersResponse =
            await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          setError(
            data.message ||
              "Unable to load customers."
          );

          return;
        }

        setCustomers(
          data.customers ||
            []
        );
      } catch {
        setError(
          "Unable to connect to the backend."
        );
      } finally {
        setLoading(
          false
        );
      }
    }

    loadCustomers();
  }, []);


  // ======================================================
  // FILTER
  // ======================================================

  const filteredCustomers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return customers;
      }

      return customers.filter(
        (customer) =>
          customer.full_name
            ?.toLowerCase()
            .includes(query) ||
          customer.email
            ?.toLowerCase()
            .includes(query) ||
          customer.phone
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      customers,
      search,
    ]);


  const activeCount =
    useMemo(
      () =>
        customers.filter(
          (customer) =>
            customer.is_active
        ).length,
      [customers]
    );

  const inactiveCount =
    customers.length -
    activeCount;


  // ======================================================
  // VIEW CUSTOMER
  // ======================================================

  async function viewCustomer(
    customerId: number
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
    setLoadingCustomer(
      true
    );

    try {
      const response =
        await fetch(
          `${API_URL}/api/admin/customers/${customerId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data:
        CustomerResponse =
          await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.customer
      ) {
        setError(
          data.message ||
            "Unable to load customer."
        );

        return;
      }

      setSelectedCustomer(
        data.customer
      );
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setLoadingCustomer(
        false
      );
    }
  }


  // ======================================================
  // UPDATE STATUS
  // ======================================================

  async function updateStatus() {
    if (!statusCustomer) {
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

    const newStatus =
      !statusCustomer.is_active;

    setUpdatingStatus(
      true
    );

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `${API_URL}/api/admin/customers/${statusCustomer.id}/status`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                is_active:
                  newStatus,
              }),
          }
        );

      const data:
        CustomerResponse =
          await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.customer
      ) {
        setError(
          data.message ||
            "Unable to update customer."
        );

        return;
      }

      const updatedCustomer =
        data.customer;

      setCustomers(
        (current) =>
          current.map(
            (customer) =>
              customer.id ===
              updatedCustomer.id
                ? updatedCustomer
                : customer
          )
      );

      setSelectedCustomer(
        (current) =>
          current?.id ===
          updatedCustomer.id
            ? updatedCustomer
            : current
      );

      setSuccess(
        data.message ||
          (
            newStatus
              ? "Customer activated successfully."
              : "Customer deactivated successfully."
          )
      );

      setStatusCustomer(
        null
      );
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setUpdatingStatus(
        false
      );
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
                Customers
              </h1>

            </div>

          </div>

        </header>


        <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">

          {/* INTRO */}

          <div className="flex flex-col gap-5 border-b border-black/10 pb-7 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-[8px] font-semibold tracking-[0.2em] text-black/35 uppercase">
                Customer Accounts
              </p>

              <h2 className="mt-2 text-[30px] font-medium tracking-[-0.04em]">
                All Customers
              </h2>

              <p className="mt-2 text-[10px] text-black/40">
                Manage registered
                Ostren Fit customer
                accounts.
              </p>

            </div>


            <div className="relative w-full md:w-[320px]">

              <Search
                size={15}
                strokeWidth={1.4}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
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
                placeholder="Search name, email or phone..."
                className="h-[46px] w-full border border-black/10 bg-transparent pl-11 pr-4 text-[10px] outline-none transition placeholder:text-black/30 focus:border-black"
              />

            </div>

          </div>


          {/* STATS */}

          {!loading && (
            <div className="grid border-b border-black/10 sm:grid-cols-3">

              <StatItem
                label="Total Customers"
                value={
                  customers.length
                }
              />

              <StatItem
                label="Active"
                value={
                  activeCount
                }
              />

              <StatItem
                label="Inactive"
                value={
                  inactiveCount
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
                  Loading customers...
                </p>

              </div>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            filteredCustomers.length ===
              0 && (
              <div className="flex min-h-[350px] flex-col items-center justify-center border-b border-black/10 text-center">

                <Users
                  size={28}
                  strokeWidth={1.1}
                  className="text-black/25"
                />

                <p className="mt-4 text-[11px] font-medium">
                  No customers found.
                </p>

                <p className="mt-2 text-[9px] text-black/35">
                  Registered customers
                  will appear here.
                </p>

              </div>
            )}


          {/* DESKTOP */}

          {!loading &&
            filteredCustomers.length >
              0 && (
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full border-collapse">

                  <thead>

                    <tr className="border-b border-black/10">

                      <TableHeading>
                        Customer
                      </TableHeading>

                      <TableHeading>
                        Contact
                      </TableHeading>

                      <TableHeading>
                        Status
                      </TableHeading>

                      <TableHeading>
                        Joined
                      </TableHeading>

                      <TableHeading align="right">
                        Actions
                      </TableHeading>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredCustomers.map(
                      (
                        customer
                      ) => (
                        <tr
                          key={
                            customer.id
                          }
                          className="border-b border-black/10 transition hover:bg-white/35"
                        >

                          <td className="py-5 pr-5">

                            <div className="flex items-center gap-4">

                              <CustomerAvatar
                                customer={
                                  customer
                                }
                              />

                              <div className="min-w-0">

                                <p className="max-w-[240px] truncate text-[11px] font-medium">
                                  {customer.full_name ||
                                    "Customer"}
                                </p>

                                <p className="mt-1 text-[7px] font-semibold tracking-[0.13em] text-black/30 uppercase">
                                  #
                                  {String(
                                    customer.id
                                  ).padStart(
                                    4,
                                    "0"
                                  )}
                                </p>

                              </div>

                            </div>

                          </td>


                          <td className="px-3 py-5">

                            <div className="space-y-2">

                              <div className="flex items-center gap-2 text-[9px] text-black/55">

                                <Mail
                                  size={12}
                                  strokeWidth={1.3}
                                  className="shrink-0 text-black/30"
                                />

                                <span className="max-w-[260px] truncate">
                                  {
                                    customer.email
                                  }
                                </span>

                              </div>


                              <div className="flex items-center gap-2 text-[9px] text-black/45">

                                <Phone
                                  size={12}
                                  strokeWidth={1.3}
                                  className="shrink-0 text-black/30"
                                />

                                <span>
                                  {customer.phone ||
                                    "No phone"}
                                </span>

                              </div>

                            </div>

                          </td>


                          <td className="px-3 py-5">

                            <StatusBadge
                              active={
                                customer.is_active
                              }
                            />

                          </td>


                          <td className="px-3 py-5">

                            <p className="text-[9px] text-black/50">
                              {formatDate(
                                customer.created_at
                              )}
                            </p>

                          </td>


                          <td className="py-5 pl-3">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  viewCustomer(
                                    customer.id
                                  )
                                }
                                disabled={
                                  loadingCustomer
                                }
                                className="flex h-9 items-center gap-2 border border-black/10 px-3 text-[7px] font-semibold tracking-[0.12em] uppercase transition hover:bg-black hover:!text-white"
                              >
                                <Eye
                                  size={12}
                                  strokeWidth={1.4}
                                />

                                View
                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  setStatusCustomer(
                                    customer
                                  )
                                }
                                className={
                                  customer.is_active
                                    ? "h-9 border border-black/10 px-3 text-[7px] font-semibold tracking-[0.12em] uppercase transition hover:border-red-700 hover:bg-red-700 hover:!text-white"
                                    : "h-9 bg-[#111111] px-3 text-[7px] font-semibold tracking-[0.12em] !text-white uppercase transition hover:bg-black/75"
                                }
                              >
                                {customer.is_active
                                  ? "Deactivate"
                                  : "Activate"}
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
            filteredCustomers.length >
              0 && (
              <div className="divide-y divide-black/10 md:hidden">

                {filteredCustomers.map(
                  (
                    customer
                  ) => (
                    <article
                      key={
                        customer.id
                      }
                      className="py-5"
                    >

                      <div className="flex items-start gap-4">

                        <CustomerAvatar
                          customer={
                            customer
                          }
                        />


                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <p className="truncate text-[11px] font-medium">
                                {customer.full_name ||
                                  "Customer"}
                              </p>

                              <p className="mt-1 truncate text-[8px] text-black/40">
                                {
                                  customer.email
                                }
                              </p>

                            </div>


                            <StatusBadge
                              active={
                                customer.is_active
                              }
                            />

                          </div>


                          <div className="mt-5 grid grid-cols-2 gap-4">

                            <SmallInfo
                              label="Phone"
                              value={
                                customer.phone ||
                                "—"
                              }
                            />

                            <SmallInfo
                              label="Joined"
                              value={
                                formatDate(
                                  customer.created_at
                                )
                              }
                            />

                          </div>


                          <div className="mt-5 flex gap-2 border-t border-black/10 pt-4">

                            <button
                              type="button"
                              onClick={() =>
                                viewCustomer(
                                  customer.id
                                )
                              }
                              className="flex h-10 flex-1 items-center justify-center gap-2 border border-black/10 text-[7px] font-semibold tracking-[0.12em] uppercase"
                            >
                              <Eye
                                size={12}
                                strokeWidth={1.4}
                              />

                              View
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                setStatusCustomer(
                                  customer
                                )
                              }
                              className={
                                customer.is_active
                                  ? "h-10 flex-1 border border-black/10 text-[7px] font-semibold tracking-[0.12em] uppercase"
                                  : "h-10 flex-1 bg-[#111111] text-[7px] font-semibold tracking-[0.12em] !text-white uppercase"
                              }
                            >
                              {customer.is_active
                                ? "Deactivate"
                                : "Activate"}
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


        {/* ================================================
            CUSTOMER DETAIL MODAL
        ================================================= */}

        {selectedCustomer && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            onMouseDown={() =>
              setSelectedCustomer(
                null
              )
            }
          >

            <div
              className="w-full max-w-[520px] bg-[#f5f2ec] shadow-2xl"
              onMouseDown={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">

                <div>

                  <p className="text-[7px] font-semibold tracking-[0.18em] text-black/35 uppercase">
                    Customer Details
                  </p>

                  <h3 className="mt-1 text-[18px] font-medium">
                    Account
                  </h3>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedCustomer(
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

                <div className="flex items-center gap-4 border-b border-black/10 pb-6">

                  <CustomerAvatar
                    customer={
                      selectedCustomer
                    }
                  />

                  <div className="min-w-0 flex-1">

                    <h4 className="truncate text-[17px] font-medium">
                      {selectedCustomer.full_name ||
                        "Customer"}
                    </h4>

                    <p className="mt-1 text-[9px] text-black/40">
                      Customer #
                      {String(
                        selectedCustomer.id
                      ).padStart(
                        4,
                        "0"
                      )}
                    </p>

                  </div>


                  <StatusBadge
                    active={
                      selectedCustomer.is_active
                    }
                  />

                </div>


                <div className="grid gap-5 py-6 sm:grid-cols-2">

                  <DetailItem
                    label="Email"
                    value={
                      selectedCustomer.email
                    }
                  />

                  <DetailItem
                    label="Phone"
                    value={
                      selectedCustomer.phone ||
                      "Not provided"
                    }
                  />

                  <DetailItem
                    label="Joined"
                    value={
                      formatDate(
                        selectedCustomer.created_at
                      )
                    }
                  />

                  <DetailItem
                    label="Last Updated"
                    value={
                      formatDate(
                        selectedCustomer.updated_at
                      )
                    }
                  />

                  <DetailItem
                    label="Role"
                    value="Customer"
                  />

                  <DetailItem
                    label="Account Status"
                    value={
                      selectedCustomer.is_active
                        ? "Active"
                        : "Inactive"
                    }
                  />

                </div>


                <div className="border-t border-black/10 pt-5">

                  <button
                    type="button"
                    onClick={() => {
                      setStatusCustomer(
                        selectedCustomer
                      );
                    }}
                    className={
                      selectedCustomer.is_active
                        ? "flex h-[46px] w-full items-center justify-center gap-2 border border-black/15 text-[8px] font-semibold tracking-[0.14em] uppercase transition hover:border-red-700 hover:bg-red-700 hover:!text-white"
                        : "flex h-[46px] w-full items-center justify-center gap-2 bg-[#111111] text-[8px] font-semibold tracking-[0.14em] !text-white uppercase transition hover:bg-black/75"
                    }
                  >
                    <ShieldCheck
                      size={13}
                      strokeWidth={1.4}
                    />

                    {selectedCustomer.is_active
                      ? "Deactivate Customer"
                      : "Activate Customer"}
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}


        {/* ================================================
            STATUS CONFIRMATION
        ================================================= */}

        {statusCustomer && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
            onMouseDown={() => {
              if (
                !updatingStatus
              ) {
                setStatusCustomer(
                  null
                );
              }
            }}
          >

            <div
              className="w-full max-w-[420px] bg-[#f5f2ec] p-6 shadow-2xl"
              onMouseDown={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              <p className="text-[7px] font-semibold tracking-[0.18em] text-black/35 uppercase">
                Confirm Action
              </p>


              <h3 className="mt-3 text-[22px] font-medium tracking-[-0.03em]">
                {statusCustomer.is_active
                  ? "Deactivate customer?"
                  : "Activate customer?"}
              </h3>


              <p className="mt-3 text-[10px] leading-5 text-black/45">
                {statusCustomer.is_active
                  ? `${statusCustomer.full_name || "This customer"} will no longer be able to use an active customer account until you reactivate it.`
                  : `${statusCustomer.full_name || "This customer"} will be activated again.`}
              </p>


              <div className="mt-7 flex gap-3">

                <button
                  type="button"
                  disabled={
                    updatingStatus
                  }
                  onClick={() =>
                    setStatusCustomer(
                      null
                    )
                  }
                  className="h-[46px] flex-1 border border-black/10 text-[8px] font-semibold tracking-[0.14em] uppercase transition hover:border-black disabled:opacity-50"
                >
                  Cancel
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
                    statusCustomer.is_active
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
                  ) : statusCustomer.is_active ? (
                    "Deactivate"
                  ) : (
                    "Activate"
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
// COMPONENTS
// ========================================================

function CustomerAvatar({
  customer,
}: {
  customer: Customer;
}) {
  const letter =
    customer.full_name
      ?.trim()
      .charAt(0)
      .toUpperCase() ||
    customer.email
      ?.charAt(0)
      .toUpperCase() ||
    "C";

  return (
    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/40">

      {letter ? (
        <span className="text-[12px] font-medium">
          {letter}
        </span>
      ) : (
        <UserRound
          size={15}
          strokeWidth={1.3}
        />
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
      className={
        active
          ? "inline-flex bg-[#111111] px-2 py-1 text-[7px] font-semibold tracking-[0.12em] !text-white uppercase"
          : "inline-flex border border-black/10 px-2 py-1 text-[7px] font-semibold tracking-[0.12em] text-black/35 uppercase"
      }
    >
      {active
        ? "Active"
        : "Inactive"}
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