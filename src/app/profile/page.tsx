"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.ddev.site";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/api/edit-profile", {
        username,
        email,
        password: password || undefined,
      });
      setSuccess(response.data.message || "Profile updated successfully");
      setToast({ message: response.data.message || "Profiel succesvol bijgewerkt", type: "success" });
      refreshUser(); // Refresh user data in context
      setPassword("");
    } catch (err: any) {
      console.error("Update error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || "An error occurred while updating the profile";
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
    }
  };

  // Toast auto-dismiss effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 pb-24">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center pointer-events-none`}>
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 pointer-events-auto ${toast.type === "success" ? "bg-teal-500" : "bg-red-500"}`}
          >
            {toast.message}
          </div>
        </div>
      )}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profiel Bewerken</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Gebruikersnaam</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Nieuw wachtwoord <span className='text-gray-400'>(optioneel)</span></label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laat leeg om ongewijzigd te houden"
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-600 transition"
          >
            Wijzigingen opslaan
          </button>
        </form>
      </div>
    </div>
  );
}
