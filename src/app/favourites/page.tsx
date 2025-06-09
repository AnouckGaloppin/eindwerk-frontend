"use client";

import Favourites from "@/features/favourites/Favourites";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

const FavouritesPage = () => {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);
  return (
    <div className="p-6 pt-20 pb-24">
      <h1 className="text-2xl font-bold mb-6">Favorieten</h1>
      <Favourites />
    </div>
  );
};
export default FavouritesPage;
