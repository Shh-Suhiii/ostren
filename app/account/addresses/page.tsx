// app/account/addresses/page.tsx

"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Check,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedAccount from "@/components/account/ProtectedAccount";
import AccountSidebar from "@/components/account/AccountSidebar";
import IndiaLocationFields from "@/components/common/IndiaLocationFields";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";


type Address = {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};


type AddressForm = {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};


type AddressesResponse = {
  success: boolean;
  message?: string;
  addresses?: Address[];
};


type AddressResponse = {
  success: boolean;
  message?: string;
  address?: Address;
};


const initialAddress: AddressForm = {
  full_name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};


export default function AddressesPage() {
  const [
    addresses,
    setAddresses,
  ] = useState<Address[]>([]);

  const [
    form,
    setForm,
  ] =
    useState<AddressForm>(
      initialAddress
    );

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    defaultingId,
    setDefaultingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  // ======================================================
  // LOAD ADDRESSES
  // ======================================================

  useEffect(() => {
    loadAddresses();
  }, []);


  async function loadAddresses() {
    const token =
      localStorage.getItem(
        "ostren-access-token"
      );

    if (!token) {
      setLoading(false);
      return;
    }

    setError("");

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
        setError(
          data.message ||
          "Unable to load addresses."
        );

        return;
      }

      setAddresses(
        data.addresses || []
      );
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }


  // ======================================================
  // FORM
  // ======================================================

  function updateField(
    field: keyof AddressForm,
    value: string | boolean
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }


  function openAddForm() {
    setEditingId(null);
    setForm(
      initialAddress
    );

    setError("");
    setSuccess("");
    setShowForm(true);
  }


  function openEditForm(
    address: Address
  ) {
    setEditingId(
      address.id
    );

    setForm({
      full_name:
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
      is_default:
        address.is_default,
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setForm(
      initialAddress
    );
  }


  // ======================================================
  // SAVE / UPDATE
  // ======================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token =
      localStorage.getItem(
        "ostren-access-token"
      );

    if (!token) {
      setError(
        "Please login again."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEditing =
        editingId !== null;

      const endpoint =
        isEditing
          ? `${API_URL}/api/addresses/${editingId}`
          : `${API_URL}/api/addresses`;

      const response =
        await fetch(
          endpoint,
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                form
              ),
          }
        );

      const data:
        AddressResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
          "Unable to save address."
        );

        return;
      }

      await loadAddresses();

      setSuccess(
        isEditing
          ? "Address updated successfully."
          : "Address added successfully."
      );

      setForm(
        initialAddress
      );

      setEditingId(null);
      setShowForm(false);
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setSaving(false);
    }
  }


  // ======================================================
  // DELETE
  // ======================================================

  async function removeAddress(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Delete this address?"
      );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem(
        "ostren-access-token"
      );

    if (!token) {
      setError(
        "Please login again."
      );
      return;
    }

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `${API_URL}/api/addresses/${id}`,
          {
            method:
              "DELETE",

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
          "Unable to delete address."
        );

        return;
      }

      await loadAddresses();

      setSuccess(
        "Address deleted successfully."
      );
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setDeletingId(null);
    }
  }


  // ======================================================
  // SET DEFAULT
  // ======================================================

  async function setDefaultAddress(
    id: number
  ) {
    const token =
      localStorage.getItem(
        "ostren-access-token"
      );

    if (!token) {
      setError(
        "Please login again."
      );
      return;
    }

    setDefaultingId(id);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `${API_URL}/api/addresses/${id}/default`,
          {
            method:
              "PATCH",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data:
        AddressResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
          "Unable to update default address."
        );

        return;
      }

      await loadAddresses();

      setSuccess(
        "Default address updated."
      );
    } catch {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setDefaultingId(null);
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

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-[9px] font-semibold tracking-[0.24em] text-black/35 uppercase">
                  My Account
                </p>

                <h1 className="mt-3 text-[40px] font-medium tracking-[-0.04em] md:text-[54px]">
                  Addresses
                </h1>

                <p className="mt-3 text-[10px] leading-5 text-black/40">
                  Manage your saved
                  delivery addresses.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="flex h-11 w-fit items-center gap-2 bg-[#111111] px-5 text-[8px] font-semibold tracking-[0.14em] !text-white uppercase transition hover:bg-black/75"
              >

                <Plus
                  size={13}
                  strokeWidth={1.5}
                />

                Add Address

              </button>

            </div>


            {/* ACCOUNT GRID */}

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">

              <AccountSidebar />


              <div className="min-w-0">


                {/* ERROR */}

                {error && (
                  <div className="mb-5 border border-red-900/15 bg-red-950/[0.04] px-4 py-3">

                    <p className="text-[10px] leading-5 text-red-800">
                      {error}
                    </p>

                  </div>
                )}


                {/* SUCCESS */}

                {success && (
                  <div className="mb-5 flex items-center gap-2 border border-black/10 bg-[#F8F5EF] px-4 py-3">

                    <Check
                      size={13}
                      strokeWidth={1.5}
                    />

                    <p className="text-[9px]">
                      {success}
                    </p>

                  </div>
                )}


                {/* FORM */}

                {showForm && (
                  <form
                    onSubmit={
                      handleSubmit
                    }
                    className="mb-8 border border-black/10 bg-[#F8F5EF] p-6 md:p-8"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="text-[8px] font-semibold tracking-[0.17em] text-black/35 uppercase">
                          {editingId
                            ? "Edit"
                            : "New"}{" "}
                          Address
                        </p>

                        <h2 className="mt-2 text-[24px] font-medium tracking-[-0.03em]">
                          {editingId
                            ? "Update address"
                            : "Add address"}
                        </h2>

                      </div>


                      <button
                        type="button"
                        onClick={
                          closeForm
                        }
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-black hover:text-white"
                        aria-label="Close form"
                      >
                        <X
                          size={15}
                          strokeWidth={1.4}
                        />
                      </button>

                    </div>


                    <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">

                      <AddressField
                        label="Full Name"
                        value={
                          form.full_name
                        }
                        autoComplete="name"
                        onChange={(
                          value
                        ) =>
                          updateField(
                            "full_name",
                            value
                          )
                        }
                      />

                      <AddressField
                        label="Phone"
                        value={
                          form.phone
                        }
                        type="tel"
                        autoComplete="tel"
                        onChange={(
                          value
                        ) =>
                          updateField(
                            "phone",
                            value
                          )
                        }
                      />

                      <IndiaLocationFields
                        state={form.state}
                        city={form.city}
                        onStateChange={(value) =>
                          updateField(
                            "state",
                            value
                          )
                        }
                        onCityChange={(value) =>
                          updateField(
                            "city",
                            value
                          )
                        }
                      />

                      <AddressField
                        label="Pincode"
                        value={
                          form.pincode
                        }
                        inputMode="numeric"
                        autoComplete="postal-code"
                        onChange={(
                          value
                        ) =>
                          updateField(
                            "pincode",
                            value
                          )
                        }
                      />

                    </div>


                    <div className="mt-5">

                      <label className="mb-2 block text-[8px] font-semibold tracking-[0.15em] text-black/40 uppercase">
                        Full Address
                      </label>

                      <textarea
                        required
                        rows={4}
                        value={
                          form.address
                        }
                        autoComplete="street-address"
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "address",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="House / flat, street, area, landmark"
                        className="w-full resize-none border border-black/10 bg-[var(--ostren-off-white)] px-4 py-4 text-[11px] outline-none transition placeholder:text-black/25 focus:border-black"
                      />

                    </div>


                    <label className="mt-5 flex cursor-pointer items-center gap-3">

                      <input
                        type="checkbox"
                        checked={
                          form.is_default
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "is_default",
                            event
                              .target
                              .checked
                          )
                        }
                        className="h-4 w-4 accent-black"
                      />

                      <span className="text-[9px] text-black/55">
                        Make this my
                        default delivery
                        address
                      </span>

                    </label>


                    <div className="mt-7 flex flex-wrap gap-3">

                      <button
                        type="submit"
                        disabled={
                          saving
                        }
                        className="flex h-11 items-center justify-center gap-2 bg-[#111111] px-6 text-[8px] font-semibold tracking-[0.14em] !text-white uppercase transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {saving && (
                          <Loader2
                            size={12}
                            className="animate-spin"
                          />
                        )}

                        {saving
                          ? "Saving..."
                          : editingId
                            ? "Update Address"
                            : "Save Address"}

                      </button>


                      <button
                        type="button"
                        disabled={
                          saving
                        }
                        onClick={
                          closeForm
                        }
                        className="h-11 border border-black/15 px-6 text-[8px] font-semibold tracking-[0.14em] uppercase transition hover:bg-black hover:!text-white"
                      >
                        Cancel
                      </button>

                    </div>

                  </form>
                )}


                {/* LOADING */}

                {loading && (
                  <div className="flex min-h-[350px] flex-col items-center justify-center border border-black/10 bg-[#F8F5EF]">

                    <Loader2
                      size={24}
                      strokeWidth={1.2}
                      className="animate-spin text-black/30"
                    />

                    <p className="mt-4 text-[8px] font-semibold tracking-[0.16em] text-black/30 uppercase">
                      Loading addresses...
                    </p>

                  </div>
                )}


                {/* EMPTY */}

                {!loading &&
                  addresses.length ===
                  0 && (
                    <div className="flex min-h-[350px] flex-col items-center justify-center border border-black/10 bg-[#F8F5EF] p-8 text-center">

                      <MapPin
                        size={29}
                        strokeWidth={1.3}
                        className="text-black/30"
                      />

                      <h2 className="mt-5 text-[25px] font-medium tracking-[-0.03em]">
                        No addresses yet.
                      </h2>

                      <p className="mt-3 max-w-sm text-[10px] leading-5 text-black/40">
                        Add a delivery
                        address to make
                        checkout faster.
                      </p>

                      <button
                        type="button"
                        onClick={
                          openAddForm
                        }
                        className="mt-7 flex h-11 items-center gap-2 bg-[#111111] px-6 text-[8px] font-semibold tracking-[0.14em] !text-white uppercase"
                      >

                        <Plus
                          size={12}
                        />

                        Add Address

                      </button>

                    </div>
                  )}


                {/* ADDRESS CARDS */}

                {!loading &&
                  addresses.length >
                  0 && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                      {addresses.map(
                        (
                          address
                        ) => (
                          <article
                            key={
                              address.id
                            }
                            className={`relative border bg-[#F8F5EF] p-6 ${address.is_default
                                ? "border-black"
                                : "border-black/10"
                              }`}
                          >

                            {/* TOP */}

                            <div className="flex items-start justify-between gap-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center border border-black/10">

                                  <MapPin
                                    size={15}
                                    strokeWidth={1.4}
                                  />

                                </div>


                                <div>

                                  <p className="text-[12px] font-medium">
                                    {
                                      address.full_name
                                    }
                                  </p>

                                  {address.is_default && (
                                    <div className="mt-1 flex items-center gap-1">

                                      <Star
                                        size={8}
                                        strokeWidth={1.5}
                                        fill="currentColor"
                                      />

                                      <span className="text-[6px] font-semibold tracking-[0.13em] uppercase">
                                        Default
                                      </span>

                                    </div>
                                  )}

                                </div>

                              </div>


                              <div className="flex items-center">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditForm(
                                      address
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-black/40 transition hover:bg-black hover:text-white"
                                  aria-label="Edit address"
                                >
                                  <Pencil
                                    size={13}
                                    strokeWidth={1.4}
                                  />
                                </button>


                                <button
                                  type="button"
                                  disabled={
                                    deletingId ===
                                    address.id
                                  }
                                  onClick={() =>
                                    removeAddress(
                                      address.id
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-black/40 transition hover:bg-red-700 hover:text-white disabled:opacity-40"
                                  aria-label="Delete address"
                                >

                                  {deletingId ===
                                    address.id ? (
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2
                                      size={13}
                                      strokeWidth={1.4}
                                    />
                                  )}

                                </button>

                              </div>

                            </div>


                            {/* ADDRESS */}

                            <p className="mt-5 text-[10px] leading-5 text-black/50">
                              {
                                address.address
                              }
                              <br />

                              {
                                address.city
                              }
                              ,{" "}
                              {
                                address.state
                              }
                              <br />

                              {
                                address.pincode
                              }
                            </p>


                            <p className="mt-3 text-[9px] text-black/40">
                              {
                                address.phone
                              }
                            </p>


                            {/* DEFAULT */}

                            {!address.is_default && (
                              <button
                                type="button"
                                disabled={
                                  defaultingId ===
                                  address.id
                                }
                                onClick={() =>
                                  setDefaultAddress(
                                    address.id
                                  )
                                }
                                className="mt-6 flex h-9 items-center gap-2 border border-black/10 px-4 text-[7px] font-semibold tracking-[0.12em] uppercase transition hover:bg-black hover:!text-white disabled:opacity-40"
                              >

                                {defaultingId ===
                                  address.id ? (
                                  <Loader2
                                    size={11}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Star
                                    size={11}
                                    strokeWidth={1.4}
                                  />
                                )}

                                Set as Default

                              </button>
                            )}

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

      </main>

    </ProtectedAccount>
  );
}


// ========================================================
// INPUT
// ========================================================

type AddressFieldProps = {
  label: string;
  value: string;
  type?: string;
  inputMode?:
  | "text"
  | "numeric"
  | "tel";
  autoComplete?: string;
  onChange:
  (value: string) => void;
};


function AddressField({
  label,
  value,
  type = "text",
  inputMode = "text",
  autoComplete,
  onChange,
}: AddressFieldProps) {
  return (
    <div>

      <label className="mb-2 block text-[8px] font-semibold tracking-[0.15em] text-black/40 uppercase">
        {label}
      </label>

      <input
        required
        type={type}
        inputMode={
          inputMode
        }
        autoComplete={
          autoComplete
        }
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="h-12 w-full border border-black/10 bg-[var(--ostren-off-white)] px-4 text-[11px] outline-none transition focus:border-black"
      />

    </div>
  );
}