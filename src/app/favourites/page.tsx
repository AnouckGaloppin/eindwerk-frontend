"use client";

import Favourites from "@/features/favourites/Favourites";
import { useFavourites } from "@/features/favourites/useFavourites";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
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
  const { addToast } = useToast();

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
        addToast("No favourites to add to shopping list", "error");
        return;
      }

      const response = await api.post("/api/shopping-list/add-all-favourites", {
        favouriteIds: productIds
      });

      if (response.data.message) {
        // Invalidate the shopping list query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
        addToast(response.data.message, "success");
      }
    } catch (error: unknown) {
      if(error instanceof AxiosError) {
        console.error("Error adding favourites to shopping list:", error);
        addToast(
          error.response?.data?.message ||
            "Error adding favourites to shopping list",
          "error"
        );
      }
    }
  };
  
  return (
    <main 
      className="min-h-screen flex justify-center bg-gray-100 pt-16 pb-24"
      role="main"
      aria-labelledby="favourites-title"
    >
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 
            id="favourites-title"
            className="text-2xl font-bold text-gray-900"
          >
            Favourites
          </h1>
          {favourites.length > 0 && (
            <button
              onClick={addAllFavouritesToShoppingList}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 md:w-auto sm:w-auto max-sm:w-48 max-sm:text-sm max-sm:whitespace-normal text-center"
              aria-label={`Add all ${favourites.length} favourite items to shopping list`}
            >
              Add all favourites to my shopping list
            </button>
          )}
        </div>
        <section 
          className="bg-white rounded-lg shadow-md p-6"
          aria-labelledby="favourites-list-title"
        >
          <h2 
            id="favourites-list-title"
            className="sr-only"
          >
            Your Favourites
          </h2>
          <Favourites />
        </section>
      </div>
    </main>
  );
}
