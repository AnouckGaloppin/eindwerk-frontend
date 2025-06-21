"use client";

// import { useState, useEffect } from "react";
import { useFavourites, useToggleFavourite } from "./useFavourites";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
// import { useSwipeable } from "react-swipeable";
// import { Heart } from "lucide-react";
import type { Favourite } from "@/types/favouritesTypes";
import { FavouriteItem } from "@/components/FavouriteItem";
// import axios from "axios";
// import { button } from "framer-motion/client";
// import api from "@/lib/axios";
// import { useQueryClient } from "@tanstack/react-query";
// import { li } from "framer-motion/client";
// import { AxiosError } from "axios";
// import Image from "next/image";
// import { toast } from 'react-toastify';
import { CardLoader, InfiniteScrollLoader } from "@/components/ui/Loader";

// const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  if (typeof id === 'object' && id !== null && '$oid' in id) {
    return id.$oid;
  }
  return id;
};

export default function Favourites() {
  const { 
    data: favourites = [], 
    isLoading, 
    error,
    fetchNextPage,
    hasMore,
    isFetchingNextPage
  } = useFavourites();
  
  // const addFavourite = useAddFavourite();
  const toggleFavourite = useToggleFavourite();
  // const queryClient = useQueryClient();
  // const [isMobile, setIsMobile] = useState<boolean>(false);

  const { loadingRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore,
    isLoading: isFetchingNextPage,
  });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setIsMobile(window.innerWidth < 768);
  //   }
  // }, []);

  if (isLoading) return <CardLoader text="Loading favourites..." />;
  if (error)
    return (
      <div className="p-4 text-red-500 dark:text-red-400">
        Error loading favourites: {error.message}
      </div>
    );

  return (
    <div className="p-4">
      {/* Lijst met favorieten */}
      <div className="space-y-2">
        <ul className="space-y-2 p-4">
          {!favourites || favourites.length === 0 ? (
            <li className="text-gray-900 dark:text-white">Je hebt nog geen favorieten. Voeg producten toe.</li>
          ) : (
            favourites.map((fav: Favourite) => (
              <FavouriteItem
                key={getStringId(fav.id)}
                favourite={fav}
                toggleFavourite={toggleFavourite}
              />
            ))
          )}
        </ul>
        
        {/* Infinite scroll loading indicator */}
        {hasMore && (
          <div ref={loadingRef}>
            <InfiniteScrollLoader text="Meer favorieten laden..." />
          </div>
        )}
        
        {/* No more favourites message */}
        {!hasMore && favourites.length > 0 && (
          <div className="flex justify-center py-4">
            <span className="text-gray-500 text-sm">Geen favorieten meer te laden</span>
          </div>
        )}
      </div>
    </div>
  );
}

