"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Categories from "@/components/Categories";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 pt-20 pb-24">
      <section className="flex flex-col flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-center">Welkom</h1>
        {/* Home content */}
        <Categories />

        <div className="flex flex-grow justify-center items-center mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
            <Link
              href="/shoppinglist"
              className="bg-teal-500 border text-white px-4 py-2 rounded-lg h-20 flex items-center justify-center w-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out group"
            >
              <span className="text-lg font-semibold tracking-tight group-hover:tracking-wide transition-all">
                Boodschappen
              </span>
            </Link>
            <Link
              href="/favourites"
              className="bg-teal-500 text-white px-4 py-2 rounded-lg h-20 flex items-center justify-center w-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out group"
            >
              <span className="text-lg font-semibold tracking-tight group-hover:tracking-wide transition-all">
                Favorieten
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
