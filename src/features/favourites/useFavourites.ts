import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Favourite } from "@/types/favouritesTypes";

const API_FAVOURITES_URL = "http://localhost:50776/api/favourites";

// export type Favourite = {
//   id: string;
//   name: string;
// };

export const useFavourites = () => {
  return useQuery({
    queryKey: ["favourites"],
    queryFn: async () => {
      const res = await axios.get(API_FAVOURITES_URL);
      return res.data;
    },
  });
};

export const useAddFavourite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: { name: string }) => {
      const res = await axios.post(API_FAVOURITES_URL, newItem);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });
};

export const useDeleteFavourite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_FAVOURITES_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });
};
