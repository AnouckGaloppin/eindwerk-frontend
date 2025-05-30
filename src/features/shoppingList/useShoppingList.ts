import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/api";
import axios from "axios";
import { ShoppingItem } from "@/types/shoppingTypes";

// export type ShoppingItem = {
//   id: string;
//   name: string;
//   quantity: number;
// };

const API_SHOPPINGLIST_URL = "https://localhost:50776/shopping-list-item";

export const useShoppingList = () => {
  return useQuery<ShoppingItem[], Error>({
    queryKey: ["shoppingList"],
    queryFn: async () => {
      const res = await axios.get(API_SHOPPINGLIST_URL);
      console.log(res.data);
      return res.data;
    },
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: { name: string }) => {
      const res = await axios.post(API_SHOPPINGLIST_URL, newItem);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: ShoppingItem) => {
      const response = await axios.put(`${API_SHOPPINGLIST_URL}/${item.id}`, {
        name: item.name,
        quantity: parseInt(item.quantity),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_SHOPPINGLIST_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
  });
};
