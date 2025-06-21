"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      setToastMessage({
        message: "Login succesvol",
        type: "success"
      });
    } catch (error) {
      setToastMessage({
        message: "Login mislukt. Controleer uw inloggegevens.",
        type: "error"
      });
      console.error("Login mislukt:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toast auto-dismiss effect
  if (toastMessage) {
    setTimeout(() => setToastMessage(null), 2000);
  }

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 pointer-events-auto ${
              toastMessage.type === "success" ? "bg-teal-500" : "bg-red-500"
            }`}
          >
            {toastMessage.message}
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Inloggen
            </h2>
            <p className="text-gray-600">
              Of{" "}
              <Link
                href="/register"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Maak een nieuw account aan
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-mailadres
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Voer uw e-mailadres in"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Voer uw wachtwoord in"
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                Wachtwoord vergeten?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            >
              Inloggen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
