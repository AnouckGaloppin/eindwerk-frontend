"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/axios";

export default function EditUser() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // if (loading) return <p>Laden...</p>;
  // if (!user || user.role !== "admin") {
  //   return <p className="text-red-500">Alleen toegankelijk voor beheerders</p>;
  // }

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          console.log("Fetching user.... With id:", id);
          setIsLoading(true);
          const response = await api.get(`/api/admin/users/${id}`);
          setForm({
            username: response.data.username,
            email: response.data.email,
            password: "",
            role: response.data.role,
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          // setError();
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();

      // api
      //   .get(`/admin/users/${id}`)
      //   .then((response) => {
      //     setForm({
      //       username: response.data.username,
      //       email: response.data.email,
      //       password: "",
      //       role: response.data.role,
      //     });
      //   })
      //   .catch((error) => console.error("Error fetching user:", error));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.put(`/api/admin/users/${id}`, form);
      setToast({ message: "Gebruiker succesvol bijgewerkt", type: "success" });
      setTimeout(() => router.push("/admin/users"), 1500);
    } catch (error: any) {
      setToast({
        message: "Fout bij het bijwerken van de gebruiker",
        type: "error",
      });
      console.error("Error updating user:", error);
    }
  };

  // Toast auto-dismiss effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (authLoading) return <p className="text-gray-500">Laden...</p>;

  if (!user || user.role !== "admin") {
    return <p className="text-red-500">Alleen toegankelijk voor beheerders</p>;
  }
  if (isLoading)
    return <p className="text-gray-500">Gebruikersgegevens laden...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-24">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center pointer-events-none`}
        >
          <div
            className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 pointer-events-auto ${
              toast.type === "success" ? "bg-teal-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Gebruiker Bewerken{" "}
          <span className="text-base font-normal text-gray-500">(Admin)</span>
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gebruikersnaam
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wachtwoord{" "}
              <span className="text-gray-400">
                (leeg laten om ongewijzigd te houden)
              </span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Leeg laten om ongewijzigd te houden"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-teal-400 transition bg-white"
            >
              <option value="user">Gebruiker</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-600 transition"
            >
              Bijwerken
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
