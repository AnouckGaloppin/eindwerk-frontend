"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/axios";
import type { User } from "@/types/userTypes";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";
import { AxiosError } from "axios";

export default function AdminUsers() {
  // const { user, setUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      await api.get("/sanctum/csrf-cookie");
      fetchUsers();
    };

    console.log("User in useEffect admin/users: ", user);

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    init();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/admin/users");
      setUsers(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/login");
  //     return;
  //   }
  //   if (user.role !== "admin") {
  //     router.push("/");
  //     return;
  //   }

  //   fetchUsers();
  // }, [user, router]);

  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     if (editingUserId) {
  //       await api.put(`/api/admin/users/${editingUserId}`, formData);
  //       alert("Gebruiker bijgewerkt");
  //     } else {
  //       await api.post("/api/admin/users", formData);
  //       alert("Gebruiker aangemaakt");
  //     }
  //     const response = await api.get("/api/admin/users");
  //     setUsers(response.data);
  //     setFormData({
  //       username: "",
  //       email: "",
  //       password: "",
  //       password_confirmation: "",
  //       role: "user",
  //     });
  //     setEditingUserId(null);
  //   } catch (error: any) {
  //     setError(
  //       "Failed to save user: " + error.response?.data?.message || error.message
  //     );
  //     // console.error("Error creating user:", error);
  //     // alert(error.response?.data?.error || "Fout bij het aanmaken van de gebruiker");
  //   }
  // };

  // const handleEdit = (user: User) => {
  //   setEditingUserId(user.id);
  //   setFormData({
  //     username: user.username,
  //     email: user.email,
  //     password: "",
  //     password_confirmation: "",
  //     role: user.role,
  //   });
  // };

  // useEffect(() => {
  //   if (!user || user.role !== "admin") return;
  //   api
  //     .get("/admin/users")
  //     .then((response) => {
  //       setUsers(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching users:", error);
  //       setLoading(false);
  //     });
  // }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) {
      try {
        await api.get("/sanctum/csrf-cookie");
        await api.delete(`/api/admin/users/${id}`);
        alert("Gebruiker verwijderd");
        fetchUsers();
        // const response = await api.get("/api/admin/users");
        // setUsers(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data);
        }
      }
    }
  };

  if (loading) return <p>Laden...</p>;
  if (!user || user.role !== "admin") {
    return <p className="text-red-500">Alleen toegankelijk voor beheerders</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 pb-24">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Gebruikersbeheer <span className="text-base font-normal text-gray-500">(Admin)</span>
        </h1>
        <div className="flex justify-end mb-4">
          <Link
            href="/admin/users/create"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition font-semibold"
          >
            Nieuwe Gebruiker
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b p-3 text-left font-semibold text-gray-700">Gebruikersnaam</th>
                <th className="border-b p-3 text-left font-semibold text-gray-700">Email</th>
                <th className="border-b p-3 text-left font-semibold text-gray-700">Rol</th>
                <th className="border-b p-3 text-left font-semibold text-gray-700">Acties</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="even:bg-gray-50 hover:bg-indigo-50 transition">
                  <td className="p-3 align-middle">{user.username}</td>
                  <td className="p-3 align-middle">{user.email}</td>
                  <td className="p-3 align-middle capitalize">{user.role}</td>
                  <td className="p-3 align-middle flex gap-2">
                    <Link
                      href={`/admin/users/edit/${user.id}`}
                      className="inline-flex items-center justify-center bg-blue-100 text-blue-600 rounded-full p-2 hover:bg-blue-200 transition"
                      title="Bewerken"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center justify-center bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition"
                      title="Verwijderen"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
