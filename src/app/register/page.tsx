"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { p } from "framer-motion/client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      // console.log(
      //   "Fetching CSRF token from:",
      //   `${API_URL}/sanctum/csrf-cookie`
      // );
      // console.log("Getting csrf cookie register");
      await api.get("/sanctum/csrf-cookie");
      // console.log("Got csrf cookie register");
      // console.log("CSRF response:", csrfResponse.status, csrfResponse.ok);
      // console.log("Sending register:", form);
      const res = await api.post("/register", form);
      // console.log("Register response: ", res);
      // setMessage(res.data.message);
      // if (!csrfResponse.ok) {
      //   throw new Error(
      //     `CSRF request failed with status ${csrfResponse.status}`
      //   );
      // }

      // console.log("Sending register request to:", `${API_URL}/api/register`);
      // const response = await fetch(`${API_URL}/api/register`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     name,
      //     email,
      //     password,
      //     password_confirmation: passwordConfirmation,
      //   }),
      // });

      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(
      //     data.message || `Registratie mislukt (status ${response.status})`
      //   );
      // }

      // console.log("Registration successful");
      // go to login page
      if (res.status === 200 || res.status === 201) {
        setMessage("Registration successful! Please verify your email.");
        router.push("/verify");
      }
      // useRouter().push("/login");
    } catch (err: any) {
      // console.log(err);
      const errors = err.response?.data?.errors;
      setMessage(
        errors
          ? Object.values(errors).flat().join(", ")
          : err.response?.data?.message || "Unknown error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        {message && (
          <p className="text-green-500 mb-4 text-center">{message}</p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-2">
          <input
            name="username"
            type="text"
            placeholder="Username"
            // value={form.Username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            // value={email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <input
            name="password"
            type="password"
            placeholder="Password"
            // value={password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            name="password_confirmation"
            type="password"
            placeholder="Confirm password"
            // value={passwordConfirmation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white w-full py-2 rounded hover:bg-gradient-to-r hover:from-indigo-600 hover:to-teal-600 transition-colors">
          Register
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
