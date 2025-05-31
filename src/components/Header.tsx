"use client";

import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className=" p-2 bg-gray-500 shadow-md flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Logo
      </Link>
      <input
        type="text"
        placeholder="Search for product..."
        className="border p-2 rounded-md w-full max-w-md ml-4"
      />
      <button className="cursor-pointer p-2">
        <Settings className="w-6 h-6" />
      </button>
      {user && (
        <button
          onClick={handleLogout}
          className="cursor-pointer p-2 text-white hover:text-gray-200"
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      )}
    </header>
  );
};
export default Header;
