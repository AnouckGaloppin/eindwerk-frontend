"use client";

import { useState, useEffect } from "react";
import {
  useFavourites,
  useAddFavourite,
  useDeleteFavourite,
  // Favourite,
} from "./useFavourites";
import { useSwipeable } from "react-swipeable";
import { Heart } from "lucide-react";
import type { Favourite } from "@/types/favouritesTypes";

// const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

export default function Favourites() {
  const { data: favourites, isLoading, error } = useFavourites();
  const addFavourite = useAddFavourite();
  const deleteFavourite = useDeleteFavourite();

  const [newFavourite, setNewFavourite] = useState({ name: "" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const handleAddFavourite = () => {
    if (newFavourite.name.trim() !== "") {
      addFavourite.mutate(newFavourite);
      setNewFavourite({ name: "" });
    }
  };

  return (
    <div className="p-4">
      {/* Input om favoriet toe te voegen */}
      <div className="flex gap-2 mb-4">
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
      </div>

      {/* Lijst met favorieten */}
      <ul className="space-y-2 border-red-400 border p-4">
        {favourites?.map((favourite: Favourite) => {
          const swipeHandlers = useSwipeable({
            onSwipedLeft: () => deleteFavourite.mutate(favourite.id),
            preventScrollOnSwipe: true,
            trackTouch: true,
          });
          return (
            <li
              key={favourite.id}
              className="border p-3 rounded flex justify-between items-center text-sm"
              {...(isMobile ? swipeHandlers : {})}
            >
              <span>{favourite.name}</span>

              {!isMobile && (
                <button
                  onClick={() => deleteFavourite.mutate(favourite.id)}
                  className="text-red-600"
                  aria-label="Verwijder favoriet"
                >
                  <Heart className="w-4 h-4" />
                </button>
              )}
            </li>
          );
        })}
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
