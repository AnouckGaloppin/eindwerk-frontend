"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// @ts-nocheck
export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`);
        if (!response.ok) {
          throw new Error("Gebruiker ophalen mislukt.");
        }
        const user = await response.json();
        setFormData({
          username: user.username,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        toast.error("Gebruiker ophalen mislukt.");
        console.error("Gebruiker ophalen mislukt:", error);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gebruiker bijwerken mislukt.");
      }

      toast.success("Gebruiker bijgewerkt.");
      router.push("/admin/users");
    } catch (error) {
      toast.error("Gebruiker bijwerken mislukt.");
      console.error("Gebruiker bijwerken mislukt:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gebruiker bijwerken</h1>

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Gebruikersnaam
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mailadres
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Rol
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="user">Gebruiker</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Gebruiker bijwerken
          </button>
        </div>
      </form>
    </div>
  );
}
