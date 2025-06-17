"use client";

import api from "@/lib/axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Favourite } from "@/types/favouritesTypes";
// import { data } from "framer-motion/client";

// const API_FAVOURITES_URL = `Baseurl/favourites";

// export type Favourite = {
//   id: string;
//   name: string;
// };

export function useFavourites() {
  return useQuery<Favourite[]>({
    queryKey: ["favourites"],
    queryFn: async () => {
      console.log("Fetching favourites");
      const response = await api.get("/api/favourites");
      console.log("Fetched favourites:", response.data);
      return response.data;
    },
  });

  // const productIds = data.map((fav) => fav.productId);
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
