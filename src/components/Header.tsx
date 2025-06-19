"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import SearchBar from "./SearchBar";
import Image from "next/image";

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
      className="sticky top-0 z-40 bg-gradient-to-r from-indigo-500 to-teal-500 shadow-lg text-white"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-500 rounded shrink-0"
            aria-label="Volovan - Go to homepage"
          >
            🛍️ Volovan
          </Link>

          {/* Search Bar Section */}
          <div className="flex-1 mx-8">
            <SearchBar className="w-full" />
          </div>

          {/* Navigation Section */}
          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 transition flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-white hover:text-gray-200 transition"
              >
                Login
              </Link>
            )}
          </div>
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
