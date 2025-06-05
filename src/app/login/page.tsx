"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.ddev.site";
console.log("API_URL:", API_URL);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  // const [testMessage, setTestMessage] = useState("");

  // const handleTestBackend = async () => {
  //   setError("");
  //   setTestMessage("");
  //   try {
  //     console.log("Testing backend at:", `${API_URL}/test`);
  //     const response = await api.get("/api/test");
  //     console.log("Test response:", response.data);
  //     setTestMessage(response.data.message || "Test successful");
  //   } catch (err: any) {
  //     console.error("Test error:", {
  //       message: err.message,
  //       response: err.response?.data,
  //     });
  //     setError(
  //       err.response?.data?.message ||
  //         err.message ||
  //         "Failed to connect to backend"
  //     );
  //   }
  // };

  // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend.ddev.site";
  // console.log("API_URL:", API_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // console.log("Submitting !");
    try {
      console.log(
        "Fetching CSRF token from:",
        `${API_URL}/sanctum/csrf-cookie`
      );

      await api.get("/sanctum/csrf-cookie");
      console.log("Cookies after CSRF:", document.cookie);
      console.log("Submitting to:", `${API_URL}/api/login`);
      const response = await api.post("/api/login", {
        email,
        password,
      });
      console.log("Login response:", response.data, "Status:", response.status);
      if (response.status >= 200 && response.status < 300) {
        setUser(response.data.user);
        router.push("/");
      } else {
        throw new Error(
          response.data.message || `Login failed with status ${response.status}`
        );
      }

      // await api.get(`${API_URL}/sanctum/csrf-cookie`).then(() => {
      //   // Now log in
      //   axios
      //     .post(`${API_URL}/login`, {
      //       email,
      //       password,
      //     })
      //     .then((response) => {
      //       console.log(response);

      //       if (response.status >= 200 && response.status < 300) {
      //         router.push("/");
      //       } else {
      //         throw new Error(
      //           response.data.message ||
      //             `Login failed with status ${response.status}`
      //         );
      //       }
      //     });
      // });

      // const csrf_cookie = await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
      //   withCredentials: true,
      // });
      // console.log("CSRF token fetched");

      // const csrfResponse = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
      //   method: "GET",
      //   credentials: "include",
      // });
      // console.log("CSRF response status:", csrfResponse.status);
      // console.log("CSRF response headers:", [
      //   ...csrfResponse.headers.entries(),
      // ]);
      // if (!csrfResponse.ok) {
      //   throw new Error(
      //     `CSRF request failed with status ${csrfResponse.status}`
      //   );
      // }
      // console.log("Trying to post login request to:", `${API_URL}/login`);
      // const response = await axios.post(`${API_URL}/login`, {
      //   email,
      //   password,
      // });

      // console.log("Trying to post login request to:", `${API_URL}/login`);
      // // await api.get("/sanctum/csrf-cookie");
      // console.log(document.cookie);
      // const response = await api.post("/login", {
      //   email,
      //   password,
      // });
      // console.log("Login response status:", response.status);
      // console.log("Login response headers:", [...response.headers.entries()]);
      // // if (!response.ok) {
      // //   const data = await response.json();
      // //   throw new Error(
      // //     data.message || `Login failed with status ${response.status}`
      // //   );
      // // }

      // if (response.status >= 200 && response.status < 300) {
      //   router.push("/");
      // } else {
      //   throw new Error(
      //     response.data.message || `Login failed with status ${response.status}`
      //   );
      // }
    } catch (err: any) {
      console.error("Error details:", {
        message: err.message,
        // name: err.name,
        // stack: err.stack,
        // cause: err.cause,
        // response: err.response?.data,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Inloggen</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-2">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white w-full py-2 rounded hover:bg-gradient-to-r hover:from-indigo-600 hover:to-teal-600 transition-colors"
        >
          Inloggen
        </button>

        {/* <button
          type="button"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          onClick={handleTestBackend}
        >
          Test Backend
        </button> */}

        <p className="mt-4 text-center text-sm text-gray-600">
          Nog geen account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Registreer
          </Link>
        </p>
      </form>
    </div>
  );
}
