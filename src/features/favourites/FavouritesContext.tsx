// // src/context/FavoritesContext.tsx

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/productTypes";

interface FavouritesContextType {
  favourites: Product[];
  addFavourite: (product: Product) => void;
  removeFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<Product[]>([]);

  const addFavourite = (product: Product) => {
    setFavourites((prev) => [...prev, product]);
  };

  const removeFavourite = (productId: string) => {
    setFavourites((prev) => prev.filter((p) => p._id !== productId));
  };

  const isFavourite = (productId: string) => {
    return favourites.some((p) => p._id === productId);
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite, isFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavouritesContext() {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error("useFavouritesContext must be used within a FavouritesProvider");
  }
  return context;
}

// // function setError(arg0: any) {
// //   throw new Error("Function not implemented.");
// // }
