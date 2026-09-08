// app/account/addresses/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedAccount from "@/components/account/ProtectedAccount";
import AccountSidebar from "@/components/account/AccountSidebar";

type Address = {
  id: number;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const initialAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function getStoredAddresses(): Address[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem("ostren-addresses");

    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function AddressesPage() {
  const [addresses, setAddresses] =
    useState<Address[]>(getStoredAddresses);

  const [form, setForm] =
    useState(initialAddress);

  const [showForm, setShowForm] =
    useState(false);

  useEffect(() => {
    localStorage.setItem(
      "ostren-addresses",
      JSON.stringify(addresses)
    );
  }, [addresses]);

  const updateField = (
    field: keyof typeof initialAddress,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setAddresses((current) => [
      ...current,
      {
        id: Date.now(),
        ...form,
      },
    ]);

    setForm(initialAddress);
    setShowForm(false);
  };

  const removeAddress = (id: number) => {
    setAddresses((current) =>
      current.filter((address) => address.id !== id)
    );
  };

  return (
    <ProtectedAccount>
      <main className="min-h-screen bg-[#fafaf8]">
        <AnnouncementBar />
        <Navbar />

        <section className="px-5 py-14 md:px-8 md:py-20 lg:px-12">
          <div className="mx-auto max-w-[1200px]">

            <div className="flex items-end justify-between gap-4">

              <div>
                <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
                  My account
                </p>

                <h1 className="mt-3 font-serif text-4xl text-[#022a46] md:text-6xl">
                  Addresses
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="flex h-11 items-center gap-2 bg-[#063b63] px-5 text-[9px] font-semibold tracking-[0.16em] text-white uppercase"
              >
                <Plus size={14} />
                Add address
              </button>

            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">

              <AccountSidebar />

              <div>

                {showForm && (
                  <form
                    onSubmit={handleSubmit}
                    className="mb-8 bg-white p-6 md:p-8"
                  >
                    <h2 className="font-serif text-3xl text-[#022a46]">
                      Add address
                    </h2>

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                      <AddressField
                        label="Full name"
                        value={form.fullName}
                        onChange={(value) =>
                          updateField("fullName", value)
                        }
                      />

                      <AddressField
                        label="Phone"
                        value={form.phone}
                        onChange={(value) =>
                          updateField("phone", value)
                        }
                      />

                      <AddressField
                        label="City"
                        value={form.city}
                        onChange={(value) =>
                          updateField("city", value)
                        }
                      />

                      <AddressField
                        label="State"
                        value={form.state}
                        onChange={(value) =>
                          updateField("state", value)
                        }
                      />

                      <AddressField
                        label="Pincode"
                        value={form.pincode}
                        onChange={(value) =>
                          updateField("pincode", value)
                        }
                      />
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
                        Address
                      </label>

                      <textarea
                        required
                        rows={4}
                        value={form.address}
                        onChange={(event) =>
                          updateField(
                            "address",
                            event.target.value
                          )
                        }
                        className="w-full resize-none border border-black/10 bg-[#fafaf8] px-4 py-4 text-sm outline-none focus:border-[#063b63]/40"
                      />
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="submit"
                        className="h-12 bg-[#063b63] px-6 text-[9px] font-semibold tracking-[0.16em] text-white uppercase"
                      >
                        Save address
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setShowForm(false)
                        }
                        className="h-12 border border-black/10 px-6 text-[9px] font-semibold tracking-[0.16em] text-black/55 uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <div className="flex min-h-[350px] flex-col items-center justify-center bg-white p-8 text-center">

                    <MapPin
                      size={28}
                      strokeWidth={1.4}
                      className="text-[#063b63]"
                    />

                    <h2 className="mt-5 font-serif text-3xl text-[#022a46]">
                      No addresses yet.
                    </h2>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-black/45">
                      Add a delivery address to make checkout faster.
                    </p>

                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="relative border border-black/10 bg-white p-6"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            removeAddress(address.id)
                          }
                          className="absolute right-4 top-4 text-black/30 hover:text-red-500"
                        >
                          <Trash2
                            size={16}
                            strokeWidth={1.5}
                          />
                        </button>

                        <MapPin
                          size={18}
                          strokeWidth={1.5}
                          className="text-[#063b63]"
                        />

                        <h3 className="mt-4 font-serif text-xl text-[#022a46]">
                          {address.fullName}
                        </h3>

                        <p className="mt-3 pr-8 text-xs leading-6 text-black/50">
                          {address.address}
                          <br />
                          {address.city}, {address.state}
                          <br />
                          {address.pincode}
                        </p>

                        <p className="mt-3 text-xs text-black/45">
                          {address.phone}
                        </p>

                      </div>
                    ))}

                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

        <Footer />
      </main>
    </ProtectedAccount>
  );
}

type AddressFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function AddressField({
  label,
  value,
  onChange,
}: AddressFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
        {label}
      </label>

      <input
        required
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full border border-black/10 bg-[#fafaf8] px-4 text-sm outline-none focus:border-[#063b63]/40"
      />
    </div>
  );
}