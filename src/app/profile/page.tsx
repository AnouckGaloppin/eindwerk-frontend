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
      refreshUser(); // Refresh user data in context
      setPassword("");
    } catch (err: any) {
      console.error("Update error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(
        err.response?.data?.message ||
          "An error occurred while updating the profile"
      );
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 pb-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4 text-center">{success}</p>
        )}
        <div className="mb-3">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password (optional)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep unchanged"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
