"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export default function ProtectedAccount({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem(
          "ostren-access-token"
        );

      const user =
        localStorage.getItem(
          "ostren-user"
        );

      if (token && user) {
        setAuthenticated(true);
        setCheckingAuth(false);
        return;
      }

      setAuthenticated(false);
      setCheckingAuth(false);

      router.replace(
        "/account/login"
      );
    };

    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--ostren-off-white)]">
        <p className="text-[9px] font-medium tracking-[0.2em] text-black/35 uppercase">
          Loading account...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}