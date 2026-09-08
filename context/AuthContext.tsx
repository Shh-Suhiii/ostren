"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
 
export type User = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  is_active: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  authReady: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateLocalUser: (user: User) => void;
};

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [authReady, setAuthReady] =
    useState(false);

  const initializedRef = useRef(false);

  const clearAuth = () => {
    localStorage.removeItem(
      "ostren-access-token"
    );

    localStorage.removeItem(
      "ostren-user"
    );

    setUser(null);
  };

  const refreshUser = async () => {
    const token =
      localStorage.getItem(
        "ostren-access-token"
      );

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        clearAuth();
        return;
      }

      const data = await response.json();

      setUser(data.user);

      localStorage.setItem(
        "ostren-user",
        JSON.stringify(data.user)
      );
    } catch {
      clearAuth();
    }
  };

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const hydrateAuth = async () => {
      const token =
        localStorage.getItem(
          "ostren-access-token"
        );

      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const storedUser =
          localStorage.getItem(
            "ostren-user"
          );

        if (storedUser) {
          setUser(
            JSON.parse(storedUser)
          );
        }
      } catch {
        localStorage.removeItem(
          "ostren-user"
        );
      }

      await refreshUser();

      setAuthReady(true);
    };

    void hydrateAuth();
  }, []);

  const logout = () => {
    clearAuth();
  };

  const updateLocalUser = (
    nextUser: User
  ) => {
    setUser(nextUser);

    localStorage.setItem(
      "ostren-user",
      JSON.stringify(nextUser)
    );
  };

  const isLoggedIn = useMemo(
    () => Boolean(user),
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        authReady,
        logout,
        refreshUser,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}