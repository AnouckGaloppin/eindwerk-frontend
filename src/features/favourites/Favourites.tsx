"use client";

// import { useState, useEffect } from "react";
import { useFavourites, useToggleFavourite } from "./useFavourites";
// import { useSwipeable } from "react-swipeable";
// import { Heart } from "lucide-react";
import type { Favourite } from "@/types/favouritesTypes";
import { FavouriteItem } from "@/components/FavouriteItem";
// import axios from "axios";
// import { button } from "framer-motion/client";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
// import { li } from "framer-motion/client";
import { AxiosError } from "axios";
// import Image from "next/image";
import { toast } from 'react-toastify';

// const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  if (typeof id === 'object' && id !== null && '$oid' in id) {
    return id.$oid;
  }
  return id;
};

export default function Favourites() {
  const { data: favourites = [], isLoading, error } = useFavourites();
  // const addFavourite = useAddFavourite();
  const toggleFavourite = useToggleFavourite();
  const queryClient = useQueryClient();
  // const [isMobile, setIsMobile] = useState<boolean>(false);

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
        queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
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

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setIsMobile(window.innerWidth < 768);
  //   }
  // }, []);

  if (isLoading) return <div className="p-4 text-gray-900 dark:text-white">Loading...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500 dark:text-red-400">
        Error loading favourites: {error.message}
      </div>
    );

  // const isFavourite = favourites.some(
  //   (fav) => fav.product?.id === product.id || fav.product?._id === product.id
  // );

  // // const [newFavourite, setNewFavourite] = useState({ name: "" });
  // const [isMobile, setIsMobile] = useState(false);
  // // const [favourites, setFavourites] = useState<Favourite[]>([]);
  // // const { favourites } = useFavourites();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setIsMobile(window.innerWidth < 768);
  //   }
  // }, []);

  // const handleAddFavourite = () => {
  //   if (newFavourite.name.trim() !== "") {
  //     addFavourite.mutate(newFavourite);
  //     setNewFavourite({ name: "" });
  //   }
  // };

  // if (isLoading) return <div className="p-4">Loading...</div>;
  // if (error)
  //   return (
  //     <div className="p-4 text-red-500">
  //       Error loading favourites: {error.message}
  //     </div>
  //   );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Input om favoriet toe te voegen */}
        <h1 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Favorieten</h1>
        {favourites.length > 0 && (
          <button
            onClick={addAllFavouritesToShoppingList}
            className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition"
          >
            Voeg alle favorieten toe aan boodschappenlijst
          </button>
        )}
      </div>
      {/* <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Voeg een favoriet toe"
          value={newFavourite.name}
          onChange={(e) => setNewFavourite({ name: e.target.value })}
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={handleAddFavourite}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Voeg toe
        </button>
      </div> */}

      {/* Lijst met favorieten */}
      <ul className="space-y-2 p-4">
        {!favourites || favourites.length === 0 ? (
          <li className="text-gray-900 dark:text-white">You do not have favourites yet. Please add products.</li>
        ) : (
          favourites.map((fav: Favourite) => (
            <FavouriteItem
              key={getStringId(fav.id)}
              favourite={fav}
              toggleFavourite={toggleFavourite}
              // onDelete={(id) => deleteFavourite.mutate(id)}
            />
          ))
        )}
      </ul>
    </div>
  );
}
//   ))}
//   <li
//     key={favourite.id}
//     className="border p-3 rounded flex justify-between items-center text-sm"
//     {...(isMobile ? swipeHandlers : {})}
//   >
//     <span>{favourite.name}</span>

//     {!isMobile && (
//       <button
//         onClick={() => deleteFavourite.mutate(favourite.id)}
//         className="text-red-600"
//         aria-label="Verwijder favoriet"
//       >
//         <Trash className="w-4 h-4" />
//       </button>
//     )}
//   </li>
// </ul>

{
  /* List of items */
}
{
  /* <ul className="space-y-2"> */
}
{
  /* {data?.map((item) => ( */
}
{
  /* <li */
}
{
  /* key={item.id} */
}
{
  /* className="border p-3 rounded flex justify-between items-center text-sm" */
}
{
  /* > */
}
{
  /* {editingId === item.id ? (
              <div className="flex items-center w-full gap-2">
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border rounded p-1 flex-grow"
                />
                <button
                  onClick={() => {
                    updateItem.mutate({ ...item, name: editedName });
                    setEditingId(null);
                  }}
                  className="text-green-600 ml-2"
                >
                  Opslaan
                </button>
              </div>
            ) : (
              <>
                <span className="break-words max-w-[60%]">{item.name}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditedName(item.name);
                    }}
                    className="text-yellow-600"
                  >
                    Wijzig
                  </button>
                  <button
                    onClick={() => deleteItem.mutate(item.id)}
                    className="text-red-600"
                  >
                    <Trash />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul> */
}
// </div>
// );
// }

