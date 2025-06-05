"use client";

import Link from "next/link";
import { Settings, LogOut, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setError("");
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-teal-500 shadow-lg px-6 py-3 flex items-center justify-between text-white">
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition"
      >
        🛍️ Volovan
      </Link>
      <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search for product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-transparent shadow-md transition-all duration-300 ease-in-out transform group-focus-within:scale-[1.02] group-focus-within:shadow-lg group-focus-within:ring-2 group-focus-within:ring-white focus:outline-none"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 transition-colors duration-300 group-hover:text-indigo-600"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
      <div className="flex items-center gap-4">
        {error && <span className="text-sm text-yellow-200">{error}</span>}
      </div>
      <button className="hover:bg-white hover:text-indigo-600 p-2 rounded-full transition">
        <Settings className="w-6 h-6" />
      </button>
      {user && (
        <button
          onClick={handleLogout}
          className="hover:bg-white hover:text-red-600 p-2 rounded-full transition"
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      )}
    </header>
  );
};
export default Header;
