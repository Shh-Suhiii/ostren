"use client";

import { FormEvent, useState } from "react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedAccount from "@/components/account/ProtectedAccount";
import AccountSidebar from "@/components/account/AccountSidebar";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(
    () => user?.full_name ?? ""
  );

  const [email, setEmail] = useState(
    () => user?.email ?? ""
  );

  const [phone, setPhone] = useState(
    () => user?.phone ?? ""
  );

  const [saved, setSaved] = useState(false);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // updateProfile({
    //   fullName,
    //   email,
    //   phone,
    // });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1500);
  };

  return (
    <ProtectedAccount>
      <main className="min-h-screen bg-[#fafaf8]">

        <AnnouncementBar />
        <Navbar />

        <section className="px-5 py-14 md:px-8 md:py-20 lg:px-12">

          <div className="mx-auto max-w-[1200px]">

            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0877b5] uppercase">
              My account
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#022a46] md:text-6xl">
              Profile
            </h1>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">

              <AccountSidebar />

              <div className="bg-white p-6 md:p-8">

                <h2 className="font-serif text-3xl text-[#022a46]">
                  Personal information
                </h2>

                <p className="mt-2 text-sm leading-6 text-black/45">
                  Update your ostren account details.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >

                  <Field
                    label="Full name"
                    value={fullName}
                    onChange={setFullName}
                  />

                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                  />

                  <Field
                    label="Phone number"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                  />

                  <button
                    type="submit"
                    className="h-13 bg-[#063b63] px-7 text-[10px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#022a46]"
                  >
                    {saved ? "Saved" : "Save changes"}
                  </button>

                </form>

              </div>

            </div>

          </div>

        </section>

        <Footer />

      </main>
    </ProtectedAccount>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
}: FieldProps) {
  return (
    <div>

      <label className="mb-2 block text-[9px] font-semibold tracking-[0.15em] text-black/45 uppercase">
        {label}
      </label>

      <input
        type={type}
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