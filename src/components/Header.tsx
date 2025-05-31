// "use client";

import Link from "next/link";
import { Settings } from "lucide-react";

const Header = () => {
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
    </header>
  );
};
export default Header;
