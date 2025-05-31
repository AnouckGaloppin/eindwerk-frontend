"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "./axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
    } catch (err) {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/logout");
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshUser }}>
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
