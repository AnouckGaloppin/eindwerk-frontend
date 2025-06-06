"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/axios";

export default function CreateUser() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/admin/users", form);
      console.log("Posting to:", api.defaults.baseURL + "/admin/users");
      router.push("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);
      // setError(
      //   error.response?.data?.error || "Fout bij het aanmaken van de gebruiker"
      // );
    }
  };

  if (loading) return <p>Laden...</p>;
  if (!user || user.role !== "admin") {
    return <p className="text-red-500">Alleen toegankelijk voor beheerders</p>;
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await api.get("/sanctum/csrf-cookie");
  //     await api.post("/admin/users", form);
  //     router.push("/admin/users");
  //   } catch (error: any) {
  //     console.error("Error creating user:", error);
  //     alert(
  //       error.response?.data?.error || "Fout bij het aanmaken van de gebruiker"
  //     );
  //   }
  // };

  return (
    <div className="container mx-auto p-4 pt-20 pb-24">
      <h1 className="text-2xl font-bold mb-4">Nieuwe Gebruiker (Admin)</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Gebruikersnaam</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Wachtwoord</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Rol</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="user">Gebruiker</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Aanmaken
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}
