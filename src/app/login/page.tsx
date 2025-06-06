"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.ddev.site";
// console.log("API_URL:", API_URL);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/api/login", {
        email,
        password,
      });
      if (response.status >= 200 && response.status < 300) {
        setUser(response.data.user);
        router.push(response.data.redirectTo);
      } else {
        throw new Error(
          response.data.message || `Login failed with status ${response.status}`
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Inloggen</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-2">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white w-full py-2 rounded hover:bg-gradient-to-r hover:from-indigo-600 hover:to-teal-600 transition-colors"
        >
          Inloggen
        </button>
        <p className="mt-4 text-center">
          Nog geen account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Registreer
          </Link>
        </p>
      </form>
    </div>
  );
}
