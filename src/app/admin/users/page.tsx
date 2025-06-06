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
    if (confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) {
      try {
        await api.get("/sanctum/csrf-cookie");
        await api.delete(`/api/admin/users/${id}`);
        alert("Gebruiker verwijderd");
        fetchUsers();
        // const response = await api.get("/api/admin/users");
        // setUsers(response.data);
      } catch (error: any) {
        setError(
          "Failed to delete user: " + error.response?.data?.message ||
            error.message
        );
      }
    }
  };

  if (loading) return <p>Laden...</p>;
  if (!user || user.role !== "admin") {
    return <p className="text-red-500">Alleen toegankelijk voor beheerders</p>;
  }

  return (
    <div className="container mx-auto p-4 pt-20 pb-24">
      <h1 className="text-2xl font-bold mb-4">Gebruikersbeheer (Admin)</h1>
      <Link
        href="/admin/users/create"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Nieuwe Gebruiker
      </Link>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {/* <th>iD</th> */}
            <th className="border p-2">Gebruikersnaam</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Acties</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              {/* <td>{user.id}</td> */}
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2 flex">
                <Link
                  href={`/admin/users/edit/${user.id}`}
                  className="text-blue-500 mr-2"
                >
                  <Pencil />
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500"
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
