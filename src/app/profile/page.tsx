"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";
import { div } from "framer-motion/client";
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [FAQRCodeImg, setFAQRCodeImg] = useState<string>("");
  const [FACodesList, setFACodesList] = useState<Record<number, string>>({});
  const router = useRouter();

  useEffect(() => {
    refreshUser();
  }, []);

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
      setToast({
        message: response.data.message || "Profiel succesvol bijgewerkt",
        type: "success",
      });
      refreshUser(); // Refresh user data in context
      setPassword("");
    } catch (err: any) {
      console.error("Update error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMessage = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(", ")
        : err.response?.data?.message ||
          "An error occurred while updating the profile";
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
    }
  };

  const handleToggle2FA = async () => {
    try {
      await api.get("/sanctum/csrf-cookie");
      const isEnabling = !user?.two_factor_confirmed_at;
      const endpoint = "/user/two-factor-authentication";
      const response = await api[isEnabling ? "post" : "delete"](endpoint);

      if (response.status === 200 || response.status === 204) {
        if (isEnabling) {
          const response = await api.get("/user/two-factor-qr-code");
          setFAQRCodeImg(response.data.svg);

          const response2 = await api.get("/user/two-factor-recovery-codes");
          setFACodesList(response2.data);

          setQrModal(true);
        }
        refreshUser();
        setToast({
          message: isEnabling
            ? "2FA succesvol ingeschakeld"
            : "2FA succesvol uitgeschakeld",
          type: "success",
        });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Er is een fout opgetreden bij het wijzigen van 2FA";
      // setToast({ message: errorMessage, type: "error" });
      if (errorMessage === "Password confirmation required.") {
        setShowModal(true);
      } else {
        setToast({ message: errorMessage, type: "error" });
      }
    }
  };

  const handleConfirmPassword = async () => {
    try {
      await api.get("/sanctum/csrf-cookie");
      // const isEnabling = !user?.two_factor_confirmed_at;
      // const endpoint = "/user/confirm-password";
      const response = await api.post("user/confirm-password", {
        password: confirmPassword,
      });
      if (response.status === 201) {
        // setToast({
        //   message: isEnabling
        //     ? "2FA succesvol ingeschakeld"
        //     : "2FA succesvol uitgeschakeld",
        //   type: "success",
        // });
        // await refreshUser();
        await api.post("/user/two-factor-authentication");
        setShowModal(false);
        handleToggle2FA();
        setConfirmPassword("");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Ongeldig wachtwoord of andere fout";
      setToast({ message: errorMessage, type: "error" });
    }
  };

  const handleSubmit2FA = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("faConfirmCode");
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/user/confirmed-two-factor-authentication", {
        code: code,
      });
      setQrModal(false);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Er is een fout opgetreden bij het wijzigen van 2FA";
      setToast({ message: errorMessage, type: "error" });
    }
    refreshUser();
  };

  // Toast auto-dismiss effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center pointer-events-none`}
        >
          <div
            className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 pointer-events-auto ${
              toast.type === "success" ? "bg-teal-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Modal for password confirmation */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Wachtwoord bevestigen
            </h3>
            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Huidig wachtwoord
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Voer uw wachtwoord in"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirmPassword("");
                }}
                className="px-4 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Annuleren
              </button>
              <button
                onClick={handleConfirmPassword}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-teal-600 transition"
                disabled={!confirmPassword}
              >
                Bevestigen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Scan this QR code with your authenticator app
            </h3>

            <div dangerouslySetInnerHTML={{ __html: FAQRCodeImg }} />
            <h3 className="text-lg font-bold text-gray-800 mb-2 mt-4">
              Recovery codes:
            </h3>
            <div>
              {Object.entries(FACodesList).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit2FA}>
              <input
                type="number"
                name="faConfirmCode"
                className="border border-black"
              />
              <button className="ml-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-teal-600 transition">
                Confirm 2FA
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Profiel Bewerken
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gebruikersnaam
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nieuw wachtwoord{" "}
              <span className="text-gray-400">(optioneel)</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laat leeg om ongewijzigd te houden"
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-indigo-600 hover:to-teal-600 transition"
          >
            Wijzigingen opslaan
          </button>
        </form>
        <div className="mt-6">
          {/* <label className="block text-sm font-medium text-gray-700 mb-2">
            Twee-factor authenticatie
          </label> */}
          <button
            onClick={handleToggle2FA}
            className={`w-full bg-gradient-to-r ${
              user?.two_factor_confirmed_at
                ? "from-red-500 to-red-600"
                : "from-indigo-500 to-teal-500"
            } text-white font-semibold px-6 py-3 rounded-lg shadow hover:brightness-110 transition`}
          >
            {user?.two_factor_confirmed_at
              ? "2 Factor Authenticatie uitschakelen"
              : "2 Factor Authenticatie inschakelen"}
          </button>
        </div>
      </div>
    </div>
  );
}
