"use client";

import Favourites from "@/features/favourites/Favourites";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

export default function FavouritesPage() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Favorieten</h1>
        </div>
        <Favourites />
      </div>
    </div>
  );
}
