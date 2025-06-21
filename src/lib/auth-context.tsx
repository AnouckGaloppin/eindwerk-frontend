"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "./axios";
import { useRouter } from "next/navigation";
import type { User } from "@/types/userTypes";
import { AxiosError } from "axios";

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await api.get("/sanctum/csrf-cookie");
        const response = await api.get("/api/user");
        console.log("Initial user fetch:", response.data);
        if (response.data) {
          setUser(response.data);
          // Store the token if it's in the response
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
        }
      } catch (error) {
        console.error("Initial auth error:", error);
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const refreshUser = async () => {
    try {
      setLoading(true);
      await api.get("/sanctum/csrf-cookie");
      const response = await api.get("/api/user");
      console.log("Refreshed user data:", response.data);
      if (response.data) {
        setUser(response.data);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (err: unknown) {
      if(err instanceof AxiosError) {
        console.error("Error refreshing user:", err);
        setUser(null);
        localStorage.removeItem('token');
        if (err.response?.status === 403) {
          router.push("/verify");
        } else {
          router.push("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/logout");
      setUser(null);
      localStorage.removeItem('token');
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/login", { email, password });
      console.log("Login response:", response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      const userResponse = await api.get("/api/user");
      console.log("User data after login:", userResponse.data);
      setUser(userResponse.data);
      
      // Redirect based on user role
      if (userResponse.data.role === "admin") {
        router.push("/admin/users");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth moet worden gebruikt binnen een AuthProvider");
  }
  return context;
};
