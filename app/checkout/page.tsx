"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Landmark,
  Loader2,
  MapPin,
  ShoppingBag,
  Smartphone,
  WalletCards,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { useCart } from "@/context/CartContext";
import IndiaLocationFields from "@/components/common/IndiaLocationFields";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

// ========================================================
// TYPES
// ========================================================

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type SavedAddress = {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

type StoredUser = {
  id?: number;
  full_name?: string;
  email?: string;
  phone?: string | null;
};

type AddressesResponse = {
  success: boolean;
  message?: string;
  addresses?: SavedAddress[];
};

type OrderResponse = {
  success: boolean;
  message?: string;

  order?: {
    id: number;
    order_number: string;
    subtotal: number;
    shipping: number;
    total: number;
    status: string;
    payment_method: string;
    payment_status: string;
  };
};

type PostalOffice = {
  Name?: string;
  District?: string;
  Division?: string;
  State?: string;
};

type PostalResponse = {
  Status?: string;
  Message?: string;
  PostOffice?: PostalOffice[] | null;
};

type PaymentMethod =
  | "cod"
  | "upi"
  | "card"
  | "netbanking";

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

// ========================================================
// CHECKOUT PAGE
// ========================================================

export default function CheckoutPage() {
  const {
    cartItems,
    subtotal,
    clearCart,
    cartCount,
  } = useCart();

  // ======================================================
  // HYDRATION
  // ======================================================

  const [mounted, setMounted] =
    useState(false);

  // ======================================================
  // FORM
  // ======================================================

  const [form, setForm] =
    useState<CheckoutForm>(
      initialForm
    );

  // ======================================================
  // SAVED ADDRESSES
  // ======================================================

  const [
    savedAddresses,
    setSavedAddresses,
  ] = useState<SavedAddress[]>(
    []
  );

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState<number | null>(
    null
  );

  const [
    loadingAddresses,
    setLoadingAddresses,
  ] = useState(true);

  // ======================================================
  // PINCODE
  // ======================================================

  const [
    checkingPincode,
    setCheckingPincode,
  ] = useState(false);

  const [
    pincodeMessage,
    setPincodeMessage,
  ] = useState("");

  const [
    pincodeError,
    setPincodeError,
  ] = useState("");

  // ======================================================
  // PAYMENT
  // ======================================================

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>(
    "cod"
  );

  // ======================================================
  // ORDER
  // ======================================================

  const [
    orderPlaced,
    setOrderPlaced,
  ] = useState(false);

  const [
    orderNumber,
    setOrderNumber,
  ] = useState("");

  const [
    confirmedTotal,
    setConfirmedTotal,
  ] = useState<number | null>(
    null
  );

  const [
    confirmedPaymentMethod,
    setConfirmedPaymentMethod,
  ] = useState<PaymentMethod>(
    "cod"
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  // ======================================================
  // TOTALS
  // ======================================================

  const shipping =
    subtotal >= 999 ? 0 : 99;

  const total =
    subtotal + shipping;

  // ======================================================
  // MOUNT
  // ======================================================

  useEffect(() => {
    const frame =
      window.requestAnimationFrame(
        () => {
          setMounted(true);
        }
      );

    return () => {
      window.cancelAnimationFrame(
        frame
      );
    };
  }, []);

  // ======================================================
  // LOAD USER + SAVED ADDRESSES
  // ======================================================

  useEffect(() => {
    if (!mounted) {
      return;
    }

    async function loadCheckoutData() {
      const token =
        localStorage.getItem(
          "ostren-access-token"
        );

      const storedUser =
        localStorage.getItem(
          "ostren-user"
        );

      let user:
        StoredUser | null = null;

      if (storedUser) {
        try {
          user = JSON.parse(
            storedUser
          ) as StoredUser;
        } catch {
          user = null;
        }
      }

      // -----------------------------------------------
      // ACCOUNT PREFILL
      // -----------------------------------------------

      setForm((current) => ({
        ...current,

        fullName:
          user?.full_name ||
          current.fullName,

        email:
          user?.email ||
          current.email,

        phone:
          user?.phone ||
          current.phone,
      }));

      if (!token) {
        setLoadingAddresses(false);
        return;
      }

      // -----------------------------------------------
      // SAVED ADDRESSES
      // -----------------------------------------------

      try {
        const response =
          await fetch(
            `${API_URL}/api/addresses`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data:
          AddressesResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          return;
        }

        const addresses =
          data.addresses || [];

        setSavedAddresses(
          addresses
        );

        if (
          addresses.length === 0
        ) {
          return;
        }

        const defaultAddress =
          addresses.find(
            (address) =>
              address.is_default
          ) || addresses[0];

        setSelectedAddressId(
          defaultAddress.id
        );

        setForm((current) => ({
          ...current,

          fullName:
            defaultAddress.full_name,

          phone:
            defaultAddress.phone,

          address:
            defaultAddress.address,

          city:
            defaultAddress.city,

          state:
            defaultAddress.state,

          pincode:
            defaultAddress.pincode,

          email:
            user?.email ||
            current.email,
        }));

        setPincodeMessage(
          `${defaultAddress.city}, ${defaultAddress.state}`
        );
      } catch {
        // Manual checkout remains available.
      } finally {
        setLoadingAddresses(
          false
        );
      }
    }

    loadCheckoutData();
  }, [mounted]);

  // ======================================================
  // SELECT SAVED ADDRESS
  // ======================================================

  function selectAddress(
    address: SavedAddress
  ) {
    setSelectedAddressId(
      address.id
    );

    setForm((current) => ({
      ...current,

      fullName:
        address.full_name,

      phone:
        address.phone,

      address:
        address.address,

      city:
        address.city,

      state:
        address.state,

      pincode:
        address.pincode,
    }));

    setPincodeError("");

    setPincodeMessage(
      `${address.city}, ${address.state}`
    );

    setError("");
  }

  // ======================================================
  // UPDATE FIELD
  // ======================================================

  function updateField(
    field: keyof CheckoutForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  // ======================================================
  // PINCODE LOOKUP
  // ======================================================

  async function lookupPincode(
    pincode: string
  ) {
    const cleanPincode =
      pincode
        .replace(/\D/g, "")
        .slice(0, 6);

    setPincodeMessage("");
    setPincodeError("");

    if (
      cleanPincode.length !== 6
    ) {
      return;
    }

    setCheckingPincode(true);

    try {
      const response =
        await fetch(
          `https://api.postalpincode.in/pincode/${cleanPincode}`
        );

      if (!response.ok) {
        throw new Error(
          "Pincode lookup failed"
        );
      }

      const data:
        PostalResponse[] =
        await response.json();

      const result =
        data?.[0];

      if (
        result?.Status !==
          "Success" ||
        !result.PostOffice ||
        result.PostOffice.length ===
          0
      ) {
        setPincodeError(
          "We couldn't find this pincode."
        );

        return;
      }

      const postOffice =
        result.PostOffice[0];

      const detectedState =
        postOffice.State?.trim() ||
        "";

      const detectedCity =
        (
          postOffice.District ||
          postOffice.Division ||
          postOffice.Name ||
          ""
        ).trim();

      setForm((current) => ({
        ...current,

        pincode:
          cleanPincode,

        state:
          detectedState,

        city:
          detectedCity,
      }));

      setSelectedAddressId(
        null
      );

      setPincodeMessage(
        detectedCity &&
          detectedState
          ? `${detectedCity}, ${detectedState}`
          : "Pincode verified."
      );
    } catch {
      setPincodeError(
        "Unable to verify pincode right now. You can select your location manually."
      );
    } finally {
      setCheckingPincode(
        false
      );
    }
  }

  // ======================================================
  // PINCODE CHANGE
  // ======================================================

  function handlePincodeChange(
    value: string
  ) {
    const cleanValue =
      value
        .replace(/\D/g, "")
        .slice(0, 6);

    setSelectedAddressId(
      null
    );

    setPincodeMessage("");
    setPincodeError("");

    setForm((current) => ({
      ...current,

      pincode:
        cleanValue,

      city:
        cleanValue.length === 6
          ? current.city
          : "",

      state:
        cleanValue.length === 6
          ? current.state
          : "",
    }));

    if (
      cleanValue.length === 6
    ) {
      lookupPincode(
        cleanValue
      );
    }
  }

  // ======================================================
  // STATE CHANGE
  // ======================================================

  function handleStateChange(
    value: string
  ) {
    setSelectedAddressId(
      null
    );

    setPincodeMessage("");
    setPincodeError("");

    setForm((current) => ({
      ...current,
      state: value,
      city: "",
    }));
  }

  // ======================================================
  // CITY CHANGE
  // ======================================================

  function handleCityChange(
    value: string
  ) {
    setSelectedAddressId(
      null
    );

    setForm((current) => ({
      ...current,
      city: value,
    }));
  }

  // ======================================================
  // PAYMENT CHANGE
  // ======================================================

  function selectPaymentMethod(
    method: PaymentMethod
  ) {
    setPaymentMethod(method);
    setError("");
  }

  // ======================================================
  // PLACE ORDER
  // ======================================================

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      cartItems.length === 0 ||
      submitting
    ) {
      return;
    }

    setError("");

    const token =
      localStorage.getItem(
        "ostren-access-token"
      );

    if (!token) {
      setError(
        "Please log in before placing your order."
      );

      return;
    }

    if (
      form.pincode.trim()
        .length !== 6
    ) {
      setError(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }

    if (
      !form.state.trim() ||
      !form.city.trim()
    ) {
      setError(
        "Please select your state and city."
      );

      return;
    }

    // -----------------------------------------------
    // ONLINE PAYMENT SAFETY
    // -----------------------------------------------
    // Razorpay will be connected in the next step.
    // Until then, never create an unpaid order and
    // display it as successfully paid.
    // -----------------------------------------------

    if (
      paymentMethod !== "cod"
    ) {
      setError(
        "Online payment setup is being connected. Please use Cash on Delivery for now."
      );

      return;
    }

    setSubmitting(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                full_name:
                  form.fullName.trim(),

                email:
                  form.email.trim(),

                phone:
                  form.phone.trim(),

                address:
                  form.address.trim(),

                city:
                  form.city.trim(),

                state:
                  form.state.trim(),

                pincode:
                  form.pincode.trim(),

                payment_method:
                  paymentMethod,

                items:
                  cartItems.map(
                    (item) => ({
                      product_id:
                        item.id,

                      quantity:
                        item.quantity,
                    })
                  ),
              }),
          }
        );

      const data:
        OrderResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to place your order."
        );
      }

      if (!data.order) {
        throw new Error(
          "Order information was not returned."
        );
      }

      setOrderNumber(
        data.order.order_number
      );

      setConfirmedTotal(
        data.order.total
      );

      setConfirmedPaymentMethod(
        paymentMethod
      );

      setOrderPlaced(true);

      clearCart();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to place your order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ======================================================
  // HYDRATION-SAFE INITIAL RENDER
  // ======================================================

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[var(--ostren-off-white)] text-[#111111]">
        <AnnouncementBar />

        <Navbar />

        <section className="flex min-h-[65vh] items-center justify-center px-5">
          <Loader2
            size={22}
            strokeWidth={1.3}
            className="animate-spin text-black/30"
          />
        </section>

        <Footer />
      </main>
    );
  }

  // ======================================================
  // SUCCESS
  // ======================================================

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[var(--ostren-off-white)] text-[#111111]">
        <AnnouncementBar />

        <Navbar />

        <section className="flex min-h-[70vh] items-center justify-center px-5 py-20">
          <div className="max-w-xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">
              <CheckCircle2
                size={34}
                strokeWidth={1.4}
              />
            </div>

            <p className="mt-7 text-[9px] font-semibold tracking-[0.25em] text-black/40 uppercase">
              Order Confirmed
            </p>

            <h1 className="mt-4 text-[38px] font-medium leading-tight tracking-[-0.04em] md:text-[54px]">
              Thank you for your order.
            </h1>

            <p className="mx-auto mt-5 max-w-md text-[11px] leading-6 text-black/45">
              Your Ostren Fit order has
              been placed successfully.
              You can track its progress
              from your account.
            </p>

            <div className="mx-auto mt-8 max-w-sm border border-black/10 bg-[#F8F5EF] p-6">
              <p className="text-[8px] font-semibold tracking-[0.17em] text-black/35 uppercase">
                Order Number
              </p>

              <p className="mt-2 text-[20px] font-medium">
                {orderNumber}
              </p>

              {confirmedTotal !==
                null && (
                <>
                  <div className="my-5 h-px bg-black/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-black/40">
                      Order Total
                    </span>

                    <span className="text-[11px] font-medium">
                      ₹
                      {confirmedTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] text-black/40">
                  Payment
                </span>

                <span className="text-[10px] font-medium">
                  {getPaymentLabel(
                    confirmedPaymentMethod
                  )}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/account/orders"
                className="inline-flex h-13 items-center justify-center bg-black px-7 text-[8px] font-semibold tracking-[0.15em] !text-white uppercase transition-opacity hover:opacity-75"
              >
                View My Orders
              </Link>

              <Link
                href="/shop"
                className="inline-flex h-13 items-center justify-center border border-black/15 px-7 text-[8px] font-semibold tracking-[0.15em] text-black uppercase transition hover:bg-black hover:!text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  // ======================================================
  // EMPTY CART
  // ======================================================

  if (
    cartItems.length === 0
  ) {
    return (
      <main className="min-h-screen bg-[var(--ostren-off-white)] text-[#111111]">
        <AnnouncementBar />

        <Navbar />

        <section className="flex min-h-[65vh] items-center justify-center px-5">
          <div className="max-w-lg text-center">
            <ShoppingBag
              className="mx-auto text-black"
              size={32}
              strokeWidth={1.4}
            />

            <h1 className="mt-6 text-[36px] font-medium tracking-[-0.04em]">
              Nothing to checkout.
            </h1>

            <p className="mt-4 text-[11px] leading-6 text-black/45">
              Your cart is currently
              empty.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex h-13 items-center bg-black px-7 text-[8px] font-semibold tracking-[0.15em] !text-white uppercase"
            >
              Shop Ostren Fit
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  // ======================================================
  // CHECKOUT
  // ======================================================

  return (
    <main className="min-h-screen bg-[var(--ostren-off-white)] text-[#111111]">
      <AnnouncementBar />

      <Navbar />

      <section className="px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14 lg:px-12">
        <div className="mx-auto max-w-[1300px]">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[8px] font-semibold tracking-[0.14em] text-black uppercase transition-opacity hover:opacity-50"
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.5}
            />

            Back to Cart
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
            {/* LEFT */}

            <div>
              <p className="mb-3 text-[9px] font-semibold tracking-[0.23em] text-black/35 uppercase">
                Checkout
              </p>

              <h1 className="text-[40px] font-medium tracking-[-0.04em] md:text-[56px]">
                Delivery details
              </h1>

              <p className="mt-4 max-w-xl text-[11px] leading-6 text-black/45">
                Choose a saved address
                or enter your delivery
                information below.
              </p>

              {/* SAVED ADDRESSES */}

              {loadingAddresses ? (
                <div className="mt-9 flex h-[80px] items-center gap-3 border border-black/10 bg-[#F8F5EF] px-5">
                  <Loader2
                    size={15}
                    className="animate-spin text-black/35"
                  />

                  <span className="text-[8px] font-semibold tracking-[0.12em] text-black/35 uppercase">
                    Loading saved
                    addresses
                  </span>
                </div>
              ) : savedAddresses.length >
                0 ? (
                <div className="mt-9">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[8px] font-semibold tracking-[0.16em] text-black/40 uppercase">
                      Saved Addresses
                    </p>

                    <Link
                      href="/account/addresses"
                      className="text-[7px] font-semibold tracking-[0.12em] text-black/45 uppercase underline underline-offset-4 transition hover:text-black"
                    >
                      Manage Addresses
                    </Link>
                  </div>

                  {/* DESKTOP */}

                  <div className="mt-4 hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2">
                    {savedAddresses.map(
                      (savedAddress) => {
                        const selected =
                          selectedAddressId ===
                          savedAddress.id;

                        return (
                          <button
                            key={
                              savedAddress.id
                            }
                            type="button"
                            onClick={() =>
                              selectAddress(
                                savedAddress
                              )
                            }
                            className={`relative min-h-[145px] border p-5 text-left transition ${
                              selected
                                ? "border-black bg-[#F8F5EF]"
                                : "border-black/10 bg-white/50 hover:border-black/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <MapPin
                                size={15}
                                strokeWidth={
                                  1.4
                                }
                                className={
                                  selected
                                    ? "text-black"
                                    : "text-black/30"
                                }
                              />

                              {selected && (
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                                  <Check
                                    size={
                                      10
                                    }
                                    strokeWidth={
                                      2
                                    }
                                  />
                                </div>
                              )}
                            </div>

                            <p className="mt-4 text-[10px] font-medium">
                              {
                                savedAddress.full_name
                              }
                            </p>

                            <p className="mt-2 line-clamp-2 text-[8px] leading-4 text-black/45">
                              {
                                savedAddress.address
                              }
                              ,{" "}
                              {
                                savedAddress.city
                              }
                              ,{" "}
                              {
                                savedAddress.state
                              }{" "}
                              {
                                savedAddress.pincode
                              }
                            </p>

                            {savedAddress.is_default && (
                              <p className="mt-3 text-[6px] font-semibold tracking-[0.13em] text-black/40 uppercase">
                                Default
                                Address
                              </p>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* MOBILE */}

                  <div className="relative mt-4 sm:hidden">
                    <select
                      value={
                        selectedAddressId ??
                        ""
                      }
                      onChange={(
                        event
                      ) => {
                        const id =
                          Number(
                            event
                              .target
                              .value
                          );

                        const selected =
                          savedAddresses.find(
                            (
                              address
                            ) =>
                              address.id ===
                              id
                          );

                        if (selected) {
                          selectAddress(
                            selected
                          );
                        }
                      }}
                      className="h-13 w-full appearance-none border border-black/15 bg-[#F8F5EF] px-4 pr-11 text-[9px] font-medium outline-none"
                    >
                      {savedAddresses.map(
                        (address) => (
                          <option
                            key={
                              address.id
                            }
                            value={
                              address.id
                            }
                          >
                            {
                              address.full_name
                            }{" "}
                            —{" "}
                            {
                              address.city
                            }
                            {address.is_default
                              ? " (Default)"
                              : ""}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={14}
                      strokeWidth={1.4}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-9 flex flex-col gap-4 border border-black/10 bg-[#F8F5EF] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <MapPin
                      size={16}
                      strokeWidth={1.4}
                      className="mt-0.5 shrink-0 text-black/35"
                    />

                    <div>
                      <p className="text-[9px] font-medium">
                        No saved addresses
                      </p>

                      <p className="mt-1 text-[8px] leading-4 text-black/40">
                        Enter your
                        delivery details
                        manually or save
                        an address for
                        future orders.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/account/addresses"
                    className="shrink-0 text-[7px] font-semibold tracking-[0.12em] uppercase underline underline-offset-4"
                  >
                    Add Address
                  </Link>
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="mt-10"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field
                    label="Full Name"
                    value={
                      form.fullName
                    }
                    autoComplete="name"
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "fullName",
                        value
                      )
                    }
                    required
                  />

                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    autoComplete="email"
                    inputMode="email"
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "email",
                        value
                      )
                    }
                    required
                  />

                  <Field
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    autoComplete="tel"
                    inputMode="tel"
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "phone",
                        value
                      )
                    }
                    required
                  />

                  {/* PINCODE */}

                  <div>
                    <label className="mb-2 block text-[8px] font-semibold tracking-[0.15em] text-black/40 uppercase">
                      Pincode
                    </label>

                    <div className="relative">
                      <input
                        required
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={
                          form.pincode
                        }
                        onChange={(
                          event
                        ) =>
                          handlePincodeChange(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="6-digit pincode"
                        className={`h-12 w-full border bg-[#F8F5EF] px-4 pr-11 text-[11px] text-[#111111] outline-none transition ${
                          pincodeError
                            ? "border-red-300 focus:border-red-500"
                            : "border-black/10 focus:border-black"
                        }`}
                      />

                      {checkingPincode && (
                        <Loader2
                          size={13}
                          className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-black/40"
                        />
                      )}

                      {!checkingPincode &&
                        pincodeMessage && (
                          <Check
                            size={
                              13
                            }
                            strokeWidth={
                              2
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
                          />
                        )}
                    </div>

                    {pincodeMessage && (
                      <p className="mt-2 flex items-center gap-1.5 text-[8px] text-black/45">
                        <Check
                          size={9}
                          strokeWidth={2}
                        />

                        {
                          pincodeMessage
                        }
                      </p>
                    )}

                    {pincodeError && (
                      <p className="mt-2 text-[8px] leading-4 text-red-700">
                        {
                          pincodeError
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* ADDRESS */}

                <div className="mt-5">
                  <label className="mb-2 block text-[8px] font-semibold tracking-[0.15em] text-black/40 uppercase">
                    Address
                  </label>

                  <textarea
                    required
                    value={
                      form.address
                    }
                    autoComplete="street-address"
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "address",
                        event.target
                          .value
                      )
                    }
                    rows={4}
                    placeholder="House / flat, street, area, landmark"
                    className="w-full resize-none border border-black/10 bg-[#F8F5EF] px-4 py-4 text-[11px] text-[#111111] outline-none transition placeholder:text-black/25 focus:border-black"
                  />
                </div>

                {/* STATE + CITY */}

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <IndiaLocationFields
                    state={form.state}
                    city={form.city}
                    onStateChange={
                      handleStateChange
                    }
                    onCityChange={
                      handleCityChange
                    }
                  />
                </div>

                <p className="mt-2 text-[8px] leading-4 text-black/35">
                  State and city are
                  detected automatically
                  from your pincode. You
                  can change them
                  manually if needed.
                </p>

                {/* DELIVERY */}

                <div className="mt-8 border border-black/10 bg-[#F8F5EF] p-5">
                  <div className="flex gap-3">
                    <MapPin
                      size={17}
                      strokeWidth={1.4}
                      className="mt-0.5 shrink-0"
                    />

                    <div>
                      <p className="text-[8px] font-semibold tracking-[0.14em] uppercase">
                        Delivery
                      </p>

                      <p className="mt-2 text-[9px] leading-5 text-black/45">
                        Standard delivery
                        is ₹99. Orders of
                        ₹999 or more
                        receive free
                        shipping.
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAYMENT */}

                <div className="mt-4 border border-black/10 bg-[#F8F5EF] p-5">
                  <div className="flex items-start gap-3">
                    <WalletCards
                      size={17}
                      strokeWidth={1.4}
                      className="mt-0.5 shrink-0"
                    />

                    <div className="w-full">
                      <p className="text-[8px] font-semibold tracking-[0.14em] uppercase">
                        Payment Method
                      </p>

                      <p className="mt-2 text-[8px] leading-5 text-black/40">
                        Choose how you
                        would like to
                        pay.
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <PaymentOption
                          title="UPI"
                          description="Google Pay, PhonePe, Paytm & more"
                          selected={
                            paymentMethod ===
                            "upi"
                          }
                          onClick={() =>
                            selectPaymentMethod(
                              "upi"
                            )
                          }
                          icon={
                            <Smartphone
                              size={16}
                              strokeWidth={
                                1.4
                              }
                            />
                          }
                        />

                        <PaymentOption
                          title="Credit / Debit Card"
                          description="Visa, Mastercard, RuPay & more"
                          selected={
                            paymentMethod ===
                            "card"
                          }
                          onClick={() =>
                            selectPaymentMethod(
                              "card"
                            )
                          }
                          icon={
                            <CreditCard
                              size={16}
                              strokeWidth={
                                1.4
                              }
                            />
                          }
                        />

                        <PaymentOption
                          title="Net Banking"
                          description="Pay securely through your bank"
                          selected={
                            paymentMethod ===
                            "netbanking"
                          }
                          onClick={() =>
                            selectPaymentMethod(
                              "netbanking"
                            )
                          }
                          icon={
                            <Landmark
                              size={16}
                              strokeWidth={
                                1.4
                              }
                            />
                          }
                        />

                        <PaymentOption
                          title="Cash on Delivery"
                          description="Pay when your order is delivered"
                          selected={
                            paymentMethod ===
                            "cod"
                          }
                          onClick={() =>
                            selectPaymentMethod(
                              "cod"
                            )
                          }
                          icon={
                            <ShoppingBag
                              size={16}
                              strokeWidth={
                                1.4
                              }
                            />
                          }
                        />
                      </div>

                      {paymentMethod !==
                        "cod" && (
                        <div className="mt-4 border border-black/10 bg-white/50 px-4 py-3">
                          <p className="text-[8px] leading-5 text-black/45">
                            Online
                            payments will
                            be processed
                            securely
                            through our
                            payment
                            partner.
                            Payment setup
                            is currently
                            being
                            connected.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ERROR */}

                {error && (
                  <div className="mt-5 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">
                    <p className="text-[9px] leading-5 text-red-700">
                      {error}
                    </p>

                    {error
                      .toLowerCase()
                      .includes(
                        "log in"
                      ) && (
                        <Link
                          href="/account/login"
                          className="mt-2 inline-block text-[8px] font-semibold tracking-[0.11em] text-red-700 uppercase underline"
                        >
                          Go to Login
                        </Link>
                      )}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    checkingPincode
                  }
                  className="mt-8 flex h-14 w-full items-center justify-center gap-2 bg-black px-7 text-[9px] font-semibold tracking-[0.16em] !text-white uppercase transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />

                      {paymentMethod ===
                      "cod"
                        ? "Placing Order"
                        : "Processing Payment"}
                    </>
                  ) : paymentMethod ===
                    "cod" ? (
                    "Place Order"
                  ) : (
                    `Pay ₹${total.toLocaleString(
                      "en-IN"
                    )}`
                  )}
                </button>

                <p className="mt-4 text-[8px] leading-5 text-black/35">
                  {paymentMethod ===
                  "cod"
                    ? "By placing your order, you confirm your delivery details. Payment will be collected on delivery."
                    : "You will be redirected to our secure payment partner to complete your payment."}
                </p>
              </form>
            </div>

            {/* ORDER SUMMARY */}

            <aside className="h-fit border border-black/10 bg-[#F8F5EF] p-6 md:p-8 lg:sticky lg:top-32">
              <p className="text-[8px] font-semibold tracking-[0.17em] text-black/35 uppercase">
                Your Order
              </p>

              <h2 className="mt-3 text-[27px] font-medium tracking-[-0.03em]">
                Order summary
              </h2>

              <p className="mt-2 text-[9px] text-black/35">
                {cartCount}{" "}
                {cartCount === 1
                  ? "item"
                  : "items"}
              </p>

              <div className="mt-7 max-h-[360px] space-y-5 overflow-y-auto pr-1">
                {cartItems.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex gap-4"
                    >
                      {/* PRODUCT IMAGE */}

                      <Link
                        href={`/product/${item.id}`}
                        className="block shrink-0"
                      >
                        <div className="relative h-20 w-16 overflow-hidden bg-[#eeebe5]">
                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[6px] font-semibold tracking-[0.12em] text-black/20 uppercase">
                                Ostren Fit
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* PRODUCT INFO */}

                      <div className="flex min-w-0 flex-1 justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.id}`}
                            className="block truncate text-[10px] font-medium text-black transition-opacity hover:opacity-60"
                          >
                            {
                              item.name
                            }
                          </Link>

                          <p className="mt-1 text-[8px] text-black/35">
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </p>

                          <p className="mt-1 text-[8px] text-black/35">
                            ₹
                            {item.price.toLocaleString(
                              "en-IN"
                            )}{" "}
                            each
                          </p>
                        </div>

                        <p className="shrink-0 text-[10px] font-medium">
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="my-7 h-px bg-black/10" />

              <div className="space-y-4">
                <SummaryRow
                  label="Subtotal"
                  value={`₹${subtotal.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <SummaryRow
                  label="Shipping"
                  value={
                    shipping === 0
                      ? "Free"
                      : `₹${shipping}`
                  }
                />
              </div>

              <div className="my-6 h-px bg-black/10" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium">
                  Total
                </span>

                <span className="text-[19px] font-medium">
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              {/* SELECTED PAYMENT */}

              <div className="mt-6 border-t border-black/10 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[8px] text-black/40">
                    Payment
                  </span>

                  <span className="text-right text-[8px] font-medium">
                    {getPaymentLabel(
                      paymentMethod
                    )}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ========================================================
// FIELD
// ========================================================

type FieldProps = {
  label: string;
  value: string;

  onChange: (
    value: string
  ) => void;

  type?: string;
  required?: boolean;

  inputMode?:
    | "text"
    | "numeric"
    | "tel"
    | "email";

  autoComplete?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  inputMode = "text",
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-[8px] font-semibold tracking-[0.15em] text-black/40 uppercase">
        {label}
      </label>

      <input
        type={type}
        required={required}
        inputMode={inputMode}
        autoComplete={
          autoComplete
        }
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-12 w-full border border-black/10 bg-[#F8F5EF] px-4 text-[11px] text-[#111111] outline-none transition focus:border-black"
      />
    </div>
  );
}

// ========================================================
// SUMMARY ROW
// ========================================================

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between text-[9px]">
      <span className="text-black/45">
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}

// ========================================================
// PAYMENT OPTION
// ========================================================

function PaymentOption({
  title,
  description,
  selected,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[82px] items-start gap-3 border p-4 text-left transition ${
        selected
          ? "border-black bg-white"
          : "border-black/10 bg-transparent hover:border-black/30"
      }`}
    >
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center ${
          selected
            ? "bg-black text-white"
            : "bg-black/[0.04] text-black/45"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[9px] font-medium">
            {title}
          </p>

          <div
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
              selected
                ? "border-black bg-black text-white"
                : "border-black/20"
            }`}
          >
            {selected && (
              <Check
                size={9}
                strokeWidth={2}
              />
            )}
          </div>
        </div>

        <p className="mt-1.5 text-[7px] leading-4 text-black/40">
          {description}
        </p>
      </div>
    </button>
  );
}

// ========================================================
// PAYMENT LABEL
// ========================================================

function getPaymentLabel(
  method: PaymentMethod
) {
  switch (method) {
    case "upi":
      return "UPI";

    case "card":
      return "Credit / Debit Card";

    case "netbanking":
      return "Net Banking";

    case "cod":
    default:
      return "Cash on Delivery";
  }
}