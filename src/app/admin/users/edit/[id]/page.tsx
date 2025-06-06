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
      router.push("/admin/users");
    } catch (error: any) {
      console.error("Error updating user:", error);
      alert(
        error.response?.data?.error || "Fout bij het bijwerken van de gebruiker"
      );
    }
  };

  if (authLoading) return <p className="text-gray-500">Laden...</p>;

  if (!user || user.role !== "admin") {
    return <p className="text-red-500">Alleen toegankelijk voor beheerders</p>;
  }
  if (isLoading)
    return <p className="text-gray-500">Gebruikersgegevens laden...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 pt-20 pb-24">
      <h1 className="text-2xl font-bold mb-4">Gebruiker Bewerken (Admin)</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Gebruikersnaam</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Wachtwoord (leeg laten om ongewijzigd te houden)
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Rol</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border p-2 w-full"
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
            Bijwerken
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
