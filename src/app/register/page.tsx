"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { AxiosError } from "axios";

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
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const validateField = (name: string, value: string) => {
    let error = "";
    
    switch (name) {
      case "username":
        if (!value.trim()) {
          error = "Username is required";
        } else if (value.length < 3) {
          error = "Username must be at least 3 characters long";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        break;
      case "password_confirmation":
        if (!value) {
          error = "Password confirmation is required";
        } else if (value !== form.password) {
          error = "Passwords do not match";
        }
        break;
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setForm({ ...form, [name]: value });
    setError("");
    setMessage("");
    
    // Validate the field and update field-specific error
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const isFormValid = () => {
    const errors = {
      username: validateField("username", form.username),
      email: validateField("email", form.email),
      password: validateField("password", form.password),
      password_confirmation: validateField("password_confirmation", form.password_confirmation),
    };
    
    setFieldErrors(errors);
    
    return !Object.values(errors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    // Validate all fields before submission
    if (!isFormValid()) {
      setError("Please fix the errors above before submitting");
      return;
    }
    
    try {
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
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errors = err.response?.data?.errors;
        if (errors) {
          // Handle validation errors from backend
          const errorMessages = Object.values(errors).flat();
          setError(errorMessages.join(", "));
        } else {
          setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
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
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              fieldErrors.username ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {fieldErrors.username && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
          )}
        </div>
        <div className="mb-2">
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              fieldErrors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>
        <div className="mb-2">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              fieldErrors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>
        
        <div className="mb-4">
          <input
            name="password_confirmation"
            type="password"
            placeholder="Confirm password"
            value={form.password_confirmation}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              fieldErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {fieldErrors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.password_confirmation}</p>
          )}
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
};
