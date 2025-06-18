"use client";

import Favourites from "@/features/favourites/Favourites";
import { useFavourites } from "@/features/favourites/useFavourites";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from 'react-toastify';
import type { Favourite } from "@/types/favouritesTypes";

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  if (typeof id === 'object' && id !== null && '$oid' in id) {
    return id.$oid;
  }
  return id;
};

export default function FavouritesPage() {
  const { refreshUser } = useAuth();
  const { data: favourites = [] } = useFavourites();
  const queryClient = useQueryClient();

  useEffect(() => {
    refreshUser();
  }, []);

  const addAllFavouritesToShoppingList = async () => {
    try {
      const productIds = favourites.map((fav: Favourite) => {
        if (!fav.product) return null;
        return getStringId(fav.product.id);
      }).filter((id): id is string => id !== null);
      
      if (productIds.length === 0) {
        toast.error("No favourites to add to shopping list");
        return;
      }

      const response = await api.post("/api/shopping-list/add-all-favourites", {
        favouriteIds: productIds
      });

      if (response.data.message) {
        // Invalidate the shopping list query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      if(error instanceof AxiosError) {
        console.error("Error adding favourites to shopping list:", error);
        toast.error(
          error.response?.data?.message ||
            "Error adding favourites to shopping list"
        );
      }
    }
  };
  
  return (
    <main className="min-h-screen flex justify-center bg-gray-100 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Favourites</h1>
          {favourites.length > 0 && (
            <button
              onClick={addAllFavouritesToShoppingList}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add all favourites to shopping list
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Favourites</h2> */}
          <Favourites />
        </div>
      </div>
    </main>
  );
}
