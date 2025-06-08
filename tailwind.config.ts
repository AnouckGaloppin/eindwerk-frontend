/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-amber-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-orange-400",
    "bg-green-700",
    "bg-amber-700",
    "bg-purple-500",
    "bg-pink-500",
    "bg-amber-200",
    "bg-green-600",
    "bg-gray-500",
    "bg-blue-300",
    "bg-amber-100",
    "bg-yellow-300",
    "bg-fuchsia-600",
    "bg-rose-500",
    "bg-green-900",
    "bg-red-400",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
