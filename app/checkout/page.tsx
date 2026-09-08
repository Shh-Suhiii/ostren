"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart, cartCount } = useCart();

  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const updateField = (
    field: keyof CheckoutForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    const generatedOrder =
      "OST-" + Date.now().toString().slice(-8);

    setOrderNumber(generatedOrder);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#fafaf8]">
        <AnnouncementBar />
        <Navbar />

        <section className="flex min-h-[70vh] items-center justify-center px-5 py-20">

          <div className="max-w-xl text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f4f9] text-[#063b63]">
              <CheckCircle2
                size={34}
                strokeWidth={1.4}
              />
            </div>

            <p className="mt-7 text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
              Order confirmed
            </p>

            <h1 className="mt-4 font-serif text-4xl tracking-[-0.02em] text-[#022a46] md:text-6xl">
              Thank you for your order.
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/50">
              Your ostren order has been placed successfully.
              We’ll use the details provided during checkout for
              delivery updates.
            </p>

            <div className="mx-auto mt-8 max-w-sm border border-black/10 bg-white p-6">

              <p className="text-[9px] font-semibold tracking-[0.18em] text-black/40 uppercase">
                Order number
              </p>

              <p className="mt-2 font-serif text-2xl text-[#022a46]">
                {orderNumber}
              </p>

            </div>

            <Link
              href="/shop"
              className="mt-8 inline-flex h-14 items-center justify-center bg-[#063b63] px-8 text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#022a46]"
            >
              Continue shopping
            </Link>

          </div>

        </section>

        <Footer />
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#fafaf8]">
        <AnnouncementBar />
        <Navbar />

        <section className="flex min-h-[65vh] items-center justify-center px-5">

          <div className="max-w-lg text-center">

            <ShoppingBag
              className="mx-auto text-[#063b63]"
              size={32}
              strokeWidth={1.4}
            />

            <h1 className="mt-6 font-serif text-4xl text-[#022a46]">
              Nothing to checkout.
            </h1>

            <p className="mt-4 text-sm leading-7 text-black/50">
              Your cart is currently empty.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex h-13 items-center bg-[#063b63] px-7 text-[10px] font-semibold tracking-[0.18em] text-white uppercase"
            >
              Shop ostren
            </Link>

          </div>

        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf8]">

      <AnnouncementBar />
      <Navbar />

      <section className="px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14 lg:px-12">

        <div className="mx-auto max-w-[1300px]">

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[9px] font-semibold tracking-[0.16em] text-[#063b63] uppercase transition-opacity hover:opacity-50"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
            />

            Back to cart
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">

            {/* Checkout Form */}
            <div>

              <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-[#0877b5] uppercase">
                Checkout
              </p>

              <h1 className="font-serif text-4xl tracking-[-0.02em] text-[#022a46] md:text-6xl">
                Delivery details
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-black/50">
                Enter your contact and delivery information to place
                your ostren order.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10"
              >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <Field
                    label="Full name"
                    value={form.fullName}
                    onChange={(value) =>
                      updateField("fullName", value)
                    }
                    required
                  />

                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(value) =>
                      updateField("email", value)
                    }
                    required
                  />

                  <Field
                    label="Phone number"
                    type="tel"
                    value={form.phone}
                    onChange={(value) =>
                      updateField("phone", value)
                    }
                    required
                  />

                  <Field
                    label="Pincode"
                    value={form.pincode}
                    onChange={(value) =>
                      updateField("pincode", value)
                    }
                    required
                  />

                </div>

                <div className="mt-5">

                  <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
                    Address
                  </label>

                  <textarea
                    required
                    value={form.address}
                    onChange={(event) =>
                      updateField(
                        "address",
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="House / flat, street, landmark"
                    className="w-full resize-none border border-black/10 bg-white px-4 py-4 text-sm text-[#15191d] outline-none transition-colors placeholder:text-black/30 focus:border-[#063b63]/40"
                  />

                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                  <Field
                    label="City"
                    value={form.city}
                    onChange={(value) =>
                      updateField("city", value)
                    }
                    required
                  />

                  <Field
                    label="State"
                    value={form.state}
                    onChange={(value) =>
                      updateField("state", value)
                    }
                    required
                  />

                </div>

                <div className="mt-8 rounded-none border border-[#063b63]/10 bg-[#e9f4f9]/50 p-5">

                  <div className="flex gap-3">

                    <MapPin
                      size={18}
                      strokeWidth={1.5}
                      className="mt-0.5 shrink-0 text-[#063b63]"
                    />

                    <div>

                      <p className="text-[10px] font-semibold tracking-[0.14em] text-[#063b63] uppercase">
                        Delivery
                      </p>

                      <p className="mt-2 text-xs leading-6 text-black/50">
                        Standard delivery charges are ₹99.
                        Orders above ₹999 receive free shipping.
                      </p>

                    </div>

                  </div>

                </div>

                <button
                  type="submit"
                  className="mt-8 flex h-14 w-full items-center justify-center bg-[#063b63] px-7 text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#022a46] md:w-auto"
                >
                  Place order
                </button>

                <p className="mt-4 text-[9px] leading-5 text-black/35">
                  Payment integration is not enabled in this Phase 1
                  checkout. This button currently creates a temporary
                  order confirmation flow.
                </p>

              </form>

            </div>

            {/* Summary */}
            <aside className="h-fit bg-white p-6 md:p-8 lg:sticky lg:top-32">

              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#0877b5] uppercase">
                Your order
              </p>

              <h2 className="mt-3 font-serif text-3xl text-[#022a46]">
                Order summary
              </h2>

              <p className="mt-2 text-xs text-black/40">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>

              <div className="mt-7 max-h-[360px] space-y-5 overflow-y-auto pr-1">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4"
                  >

                    <div
                      className={`h-20 w-16 shrink-0 ${item.className} flex items-center justify-center`}
                    >
                      <span className="font-serif text-lg text-[#063b63]/20">
                        O
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 justify-between gap-3">

                      <div>

                        <p className="truncate text-xs font-medium text-[#022a46]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-[10px] text-black/40">
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <p className="shrink-0 text-xs text-[#022a46]">
                        ₹
                        {(
                          item.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              <div className="my-7 h-px bg-black/10" />

              <div className="space-y-4 text-sm">

                <div className="flex justify-between text-black/55">
                  <span>Subtotal</span>

                  <span>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-black/55">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping}`}
                  </span>
                </div>

              </div>

              <div className="my-6 h-px bg-black/10" />

              <div className="flex items-center justify-between">

                <span className="text-sm font-medium text-[#022a46]">
                  Total
                </span>

                <span className="text-xl font-medium text-[#022a46]">
                  ₹{total.toLocaleString("en-IN")}
                </span>

              </div>

            </aside>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: FieldProps) {
  return (
    <div>

      <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full border border-black/10 bg-white px-4 text-sm text-[#15191d] outline-none transition-colors focus:border-[#063b63]/40"
      />

    </div>
  );
}