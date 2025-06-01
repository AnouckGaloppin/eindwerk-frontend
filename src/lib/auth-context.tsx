"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "./axios";
import { useRouter } from "next/navigation";
import type { User } from "@/types/userTypes";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data on mount to restore session
  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.get("/api/user");
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setUser(null);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/logout");
      setUser(null);
      setLoading(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/login", { email, password });
      setUser(response.data);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
