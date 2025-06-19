"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Categories from "@/components/Categories";
import Link from "next/link";
import api from "@/lib/axios";

export default function HomePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  // TODO: Re-enable authentication check later
  useEffect(() => {
    refreshUser();
  }, []);

  // TODO: Re-enable loading state later
  // if (!user) {
    // return <div className="p-4 text-center text-gray-900">Loading...</div>;
  // }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] px-4 sm:px-6 pb-8 sm:pb-16 bg-gray-100">
      <section className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
          Welkom {user?.username || 'Gast'}!
        </h1>
        
        <Suspense fallback={<div className="h-44 flex items-center justify-center">Loading categories...</div>}>
          <Categories />
        </Suspense>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md sm:max-w-2xl">
          <Link
            href="/shoppinglist"
            className="bg-teal-500 text-white px-4 py-2 rounded-lg h-16 sm:h-20 flex items-center justify-center w-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out group"
          >
            <span className="text-base sm:text-lg font-semibold tracking-tight group-hover:tracking-wide transition-all">
              Boodschappen
            </span>
          </Link>
          <Link
            href="/favourites"
            className="bg-teal-500 text-white px-4 py-2 rounded-lg h-16 sm:h-20 flex items-center justify-center w-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out group"
          >
            <span className="text-base sm:text-lg font-semibold tracking-tight group-hover:tracking-wide transition-all">
              Favorieten
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
