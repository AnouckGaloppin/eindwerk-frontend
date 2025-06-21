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
          error = "Gebruikersnaam is verplicht";
        } else if (value.length < 3) {
          error = "Gebruikersnaam moet minimaal 3 tekens lang zijn";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "E-mailadres is verplicht";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Voer een geldig e-mailadres in";
        }
        break;
      case "password":
        if (!value) {
          error = "Wachtwoord is verplicht";
        } else if (value.length < 8) {
          error = "Wachtwoord moet minimaal 8 tekens lang zijn";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = "Wachtwoord moet minimaal één hoofdletter, één kleine letter en één cijfer bevatten";
        }
        break;
      case "password_confirmation":
        if (!value) {
          error = "Wachtwoordbevestiging is verplicht";
        } else if (value !== form.password) {
          error = "Wachtwoorden komen niet overeen";
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
    
    if (!isFormValid()) {
      setError("Vul de fouten hierboven in voordat u verdergaat");
      return;
    }
    
    try {
      await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/register", form);
     
      if (res.status === 200 || res.status === 201) {
        setMessage("Registratie succesvol! Controleer uw e-mailadres.");
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
          setError(err.response?.data?.message || "Registratie mislukt. Probeer het opnieuw.");
        }
      } else {
        setError("Er is een onverwachte fout opgetreden. Probeer het opnieuw.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Registreren</h2>
        {message && (
          <p className="text-green-500 mb-4 text-center">{message}</p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-2">
          <input
            name="username"
            type="text"
            placeholder="Gebruikersnaam"
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
            placeholder="E-mailadres"
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
            placeholder="Wachtwoord"
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
            placeholder="Wachtwoordbevestiging"
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
          Registreren
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Heeft u al een account?
          <Link href="/login" className="text-blue-500 hover:underline">
            Inloggen
          </Link>
        </p>
      </form>
    </div>
  );
};
