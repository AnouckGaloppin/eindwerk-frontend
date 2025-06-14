"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFACode, set2FACode] = useState("");
  const [twoFARecoveryCode, set2FARecoveryCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const router = useRouter();
  const { refreshUser, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/login", {
        email,
        password,
      });

      if (response.status === 200) {
        if (response.data.two_factor) {
          setShow2FA(true);
          setMessage("Please enter your 2-factor authentication code");
        } else {
          await refreshUser();
          setMessage("Login successful");
          
          // Get the latest user data after refresh
          const userResponse = await api.get("/api/user");
          const userData = userResponse.data;
          
          if (userData?.role === "admin") {
            router.push("/admin/users");
          } else {
            router.push("/");
          }
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred"
      );
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("two-factor-challenge", {
        code: twoFACode,
      });

      if (response.status === 204) {
        refreshUser();
        setMessage("Login successful using 2FA code");
        router.push("/");
      }
    } catch (err: any) {
      setError("Invalid 2FA code");
    }
  };

  const handle2FARecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("two-factor-challenge", {
        recovery_code: twoFARecoveryCode,
      });

      if (response.status === 204) {
        refreshUser();
        setMessage("Login successful using recovery code");
        router.push("/");
      }
    } catch (err: any) {
      setError("Invalid recovery code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {message && (
          <p className="text-green-500 mb-4 text-center">{message}</p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {!show2FA ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              {/* <label className="block text-sm font-medium text-gray-700">
                Email
              </label> */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              {/* <label className="block text-sm font-medium text-gray-700">
                Password
              </label> */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white w-full py-2 rounded-md hover:from-indigo-600 hover:to-teal-600 transition-colors duration-200"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  2FA Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 2FA code"
                  value={twoFACode}
                  onChange={(e) => set2FACode(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white w-full py-2 rounded-md hover:from-indigo-600 hover:to-teal-600 transition-colors duration-200"
              >
                Verify 2FA Code
              </button>
            </form>

            <form onSubmit={handle2FARecoverySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recovery Code
                </label>
                <input
                  type="text"
                  placeholder="Enter recovery code"
                  value={twoFARecoveryCode}
                  onChange={(e) => set2FARecoveryCode(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white w-full py-2 rounded-md hover:from-indigo-600 hover:to-teal-600 transition-colors duration-200"
              >
                Use Recovery Code
              </button>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
