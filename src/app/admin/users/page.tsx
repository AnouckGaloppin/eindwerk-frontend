"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/axios";
import type { User } from "@/types/userTypes";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";

export default function AdminUsers() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  // const { user, loading: authLoading } = useAuth();

  //tijdelijk probeersel
  useEffect(() => {
    const init = async () => {
      await api.get("/sanctum/csrf-cookie");
      fetchUsers();
    };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await api.put(`/api/admin/users/${editingUserId}`, formData);
        alert("Gebruiker bijgewerkt");
      } else {
        await api.post("/api/admin/users", formData);
        alert("Gebruiker aangemaakt");
      }
      const response = await api.get("/api/admin/users");
      setUsers(response.data);
      setFormData({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
      });
      setEditingUserId(null);
    } catch (error: any) {
      setError(
        "Failed to save user: " + error.response?.data?.message || error.message
      );
      // console.error("Error creating user:", error);
      // alert(error.response?.data?.error || "Fout bij het aanmaken van de gebruiker");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      password_confirmation: "",
      role: user.role,
    });
  };

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
    const user = users.find((u) => u.id === id);
    setUserToDelete(user || null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.delete(`/api/admin/users/${userToDelete.id}`);
      setToast({ message: "Gebruiker verwijderd", type: "success" });
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      setToast({ message: "Fout bij verwijderen gebruiker", type: "error" });
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Toast auto-dismiss effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) return <p>Laden...</p>;
  if (!user || user.role !== "admin") {
    return <p className="text-red-500">Alleen toegankelijk voor beheerders</p>;
  }

  return (
    <div className="container mx-auto p-4 pt-20 pb-24">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center pointer-events-none`}> 
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 pointer-events-auto ${toast.type === "success" ? "bg-teal-500" : "bg-red-500"}`}
            onAnimationEnd={() => setToast(null)}
          >
            {toast.message}
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="text-xl font-bold mb-2 text-gray-800">Weet je het zeker?</div>
            <div className="mb-6 text-gray-600">Weet je zeker dat je <span className="font-semibold">{userToDelete.username}</span> wilt verwijderen?</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition"
              >
                Verwijderen
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Gebruikersbeheer <span className="text-base font-normal text-gray-500">(Admin)</span></h1>
        <Link
          href="/admin/users/create"
          className="bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
        >
          + Nieuwe Gebruiker
        </Link>
      </div>
      <div className="hidden md:block">
        <div className="bg-white rounded-xl shadow-2xl p-4 overflow-x-auto border border-gray-100">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-1/4 max-w-xs" />
              <col className="w-1/4 max-w-xs" />
              <col className="w-1/6 max-w-[120px]" />
              <col className="w-1/6 max-w-[120px]" />
            </colgroup>
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-sm font-semibold text-gray-700">Gebruikersnaam</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Email</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Rol</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Acties</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="p-3 align-middle truncate">{user.username}</td>
                  <td className="p-3 align-middle truncate">{user.email}</td>
                  <td className="p-3 align-middle">
                    <span className={`inline-block w-20 text-center px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'}`}>{user.role}</span>
                  </td>
                  <td className="p-3 align-middle flex gap-2">
                    <Link
                      href={`/admin/users/edit/${user.id}`}
                      className="inline-flex items-center justify-center bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-full p-2 transition"
                      title="Bewerken"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-2 transition"
                      title="Verwijderen"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center text-gray-500 py-12 flex flex-col items-center">
              <span className="text-4xl mb-2">😕</span>
              <div className="font-medium mb-1">Geen gebruikers gevonden.</div>
              <div className="text-sm text-gray-400">Voeg een nieuwe gebruiker toe om te beginnen!</div>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 py-12 flex flex-col items-center bg-white rounded-xl shadow-2xl border border-gray-100">
            <span className="text-4xl mb-2">😕</span>
            <div className="font-medium mb-1">Geen gebruikers gevonden.</div>
            <div className="text-sm text-gray-400">Voeg een nieuwe gebruiker toe om te beginnen!</div>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.email} className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-800">{user.username}</div>
                <span className={`inline-block w-20 text-center px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'}`}>{user.role}</span>
              </div>
              <div className="text-gray-600 text-sm break-all">{user.email}</div>
              <div className="flex gap-2 mt-2">
                <Link
                  href={`/admin/users/edit/${user.id}`}
                  className="inline-flex items-center justify-center bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-full p-2 transition"
                  title="Bewerken"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="inline-flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-2 transition"
                  title="Verwijderen"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
