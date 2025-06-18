"use client";

import api from "@/lib/axios";
import { useInfiniteQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { Favourite } from "@/types/favouritesTypes";
// import { data } from "framer-motion/client";

// const API_FAVOURITES_URL = `Baseurl/favourites";

// export type Favourite = {
//   id: string;
//   name: string;
// };

interface FavouritesResponse {
  data: Favourite[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
  };
}

export function useFavourites() {
  const query = useInfiniteQuery({
    queryKey: ["favourites"],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('per_page', '20');
      
      const response = await api.get(`/api/favourites?${params.toString()}`);
      return response.data as FavouritesResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.has_more ? lastPage.pagination.current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Memoize the flattened array to prevent infinite loops
  const allFavourites = useMemo(() => {
    return query.data?.pages.flatMap((page: FavouritesResponse) => page.data) ?? [];
  }, [query.data?.pages]);

  return {
    ...query,
    data: allFavourites,
    favourites: allFavourites,
    hasMore: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

export const useToggleFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product_id }: { product_id: string }) => {
      console.log("Toggling favourite for product:", product_id);
      const res = await api.post("/api/favourites/toggle", {
        product_id,
      });
      console.log("Toggled favourite for product:", res.data);
      return res.data;
    },
    onSuccess: () => {
      console.log("Invalidating favourites");
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });
};

// export const useDeleteFavourite = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: string) => {
//       await api.delete(`/favourites/${id}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["favourites"] });
//     },
//   });
// };

// export const useAddFavourite = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (newItem: { name: string }) => {
//       const res = await api.post("/favourites", newItem);
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["favourites"] });
//     },
//   });
// };
