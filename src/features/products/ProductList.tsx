import { useEffect, useState } from "react";
import {
  useProducts,
  // ShoppingItem,
} from "./useProducts";
import {
  useFavourites,
  useAddFavourite,
  useDeleteFavourite,
  //   Favourite,
} from "@/features/favourites/useFavourites";
import { Heart, HeartOff, Trash } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import type { Favourite } from "@/types/favouritesTypes";

export default function ShoppingList() {
  const { data, isLoading, error } = useProducts();
  //   const addItem = useAddItem();
  //   const deleteItem = useDeleteItem();
  //   const updateItem = useUpdateItem();

  const { data: favourites } = useFavourites();
  const addFavourite = useAddFavourite();
  const deleteFavourite = useDeleteFavourite();

  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      addItem.mutate({ name: newItem });
      setNewItem("");
    }
  };

  if (isLoading) return <p>Laden...Boopyy</p>;
  if (error) return <p>Fout bij ophalen: {error.message}</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="mb-4 flex gap-2"
        aria-label="Voeg nieuw product toe aan je winkelmandje."
      >
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Nieuw item"
          aria-label="Nieuw item invoer"
          className="border rounded p-2 w-full"
        />
        <button
          type="submit"
          disabled={addItem.isPending}
          className={`p-2 rounded text-white ${
            addItem.isPending ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          }`}
          aria-label="Item toevoegen"
        >
          {addItem.isPending ? "Toevoegen..." : "Toevoegen"}
        </button>
      </form>

      {/* List of items */}
      <ul className="space-y-2">
        {data?.map((item) => {
          const isFavourite = favourites?.some(
            (f: Favourite) => f.name === item.name
          );

          const swipeHandlers = useSwipeable({
            onSwipedLeft: () => deleteItem.mutate(item.id),
            preventScrollOnSwipe: true,
            trackMouse: true,
          });

          const listItemProps = isMobile ? swipeHandlers : {};

          return (
            <li
              key={item.id}
              className="border p-3 rounded flex justify-between items-center text-sm"
              {...listItemProps}
            >
              {editingId === item.id ? (
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
                  {/* {!isMobile && ( */}
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => {
                        if (isFavourite) {
                          const fav = favourites.find(
                            (f: Favourite) => f.name === item.name
                          );
                          if (fav) {
                            deleteFavourite.mutate(fav.id);
                          } else {
                            addFavourite.mutate({ name: item.name });
                          }
                        }
                      }}
                      className="text-pink-600"
                      aria-label={
                        isFavourite
                          ? "Verwijder uit favoriet"
                          : "Voeg toe aan favorieten"
                      }
                    >
                      {isFavourite ? (
                        <HeartOff className="w-4 h-4" />
                      ) : (
                        <Heart className="w-4 h-4" />
                      )}
                    </button>

                    {/* Favourite button */}
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditedName(item.name);
                      }}
                      className="text-yellow-600"
                      aria-label="Wijzig item"
                    >
                      Wijzig
                    </button>

                    {/* Alleen desktop: Trash-knop */}
                    {!isMobile && (
                      <button
                        onClick={() => deleteItem.mutate(item.id)}
                        className="text-red-600"
                        aria-label="Verwijder item"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* )} */}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
//           <li
//             key={item.id}
//             className="border p-3 rounded flex justify-between items-center text-sm"
//           >
//             {editingId === item.id ? (
//               <div className="flex items-center w-full gap-2">
//                 <input
//                   value={editedName}
//                   onChange={(e) => setEditedName(e.target.value)}
//                   className="border rounded p-1 flex-grow"
//                 />
//                 <button
//                   onClick={() => {
//                     updateItem.mutate({ ...item, name: editedName });
//                     setEditingId(null);
//                   }}
//                   className="text-green-600 ml-2"
//                 >
//                   Opslaan
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <span className="break-words max-w-[60%]">{item.name}</span>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => {
//                       setEditingId(item.id);
//                       setEditedName(item.name);
//                     }}
//                     className="text-yellow-600"
//                   >
//                     Wijzig
//                   </button>
//                   <button
//                     onClick={() => deleteItem.mutate(item.id)}
//                     className="text-red-600"
//                   >
//                     <Trash />
//                   </button>
//                 </div>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
