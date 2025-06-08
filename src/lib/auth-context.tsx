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

// TODO: Remove this mock user when re-enabling authentication
const mockUser: User = {
  id: "1",
  username: "test_user",
  email: "test@example.com",
  role: "user"
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser); // Set default user for testing
  const [loading, setLoading] = useState(false); // Set loading to false by default
  const router = useRouter();

  // TODO: Re-enable user fetching later
  // useEffect(() => {
  //   refreshUser();
  // }, []);

  const refreshUser = async () => {
    try {
      // TODO: Re-enable CSRF and user fetching later
      // await api.get("/sanctum/csrf-cookie");
      // const response = await api.get("/api/user");
      // console.log("Fetched data:", response.data);
      // setUser(response.data);
      setUser(mockUser); // Use mock user for testing
      setLoading(false);
    } catch (err) {
      setUser(mockUser); // Use mock user even on error
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // TODO: Re-enable logout functionality later
      // await api.get("/sanctum/csrf-cookie");
      // await api.post("/api/logout");
      setUser(mockUser); // Keep mock user for testing
      setLoading(false);
      // router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Re-enable login functionality later
      // const response = await api.post("/api/login", { email, password });
      // setUser(response.data);
      setUser(mockUser); // Use mock user for testing
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
