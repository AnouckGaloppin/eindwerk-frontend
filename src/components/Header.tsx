"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import SearchBar from "./SearchBar";

const Header = () => {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      setError("");
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed");
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-teal-500 shadow-lg text-white"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500 rounded"
          aria-label="Volovan - Go to homepage"
        >
          🛍️ Volovan
        </Link>
        
        <div className="flex-1 max-w-2xl mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 text-center">
          {error}
        </div>
      )}
    </header>
  );
};

export default Header;
