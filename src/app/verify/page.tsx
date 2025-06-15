"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import api from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";

export default function Verify() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleClick = async () => {
    setLoading(true);
    try {
      await refreshUser();
      router.push("/");
    } catch (error) {
      console.error("Error verifying user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Please verify your email address
      </h1>
      <p className="text-lg mb-8">
        We sent an email with a verification link. Please click on that link to
        verify your email address.
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Verifying..." : "I already verified"}
      </button>
    </div>
  );
}
