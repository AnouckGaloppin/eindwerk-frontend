import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ShoppingListItem,
  AddToShoppingListInput,
  UpdateShoppingListItemInput,
} from "@/types/shoppingTypes";
import api from "@/lib/axios";

// export type ShoppingItem = {
//   id: string;
//   name: string;
//   quantity: number;
// };

// TODO: Re-enable authentication later
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   };
// };

export function useShoppingList() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery<ShoppingListItem[], Error>({
    queryKey: ["shoppingList"],
    queryFn: async () => {
      const response = await api.get("/api/shopping-list");
      return Array.isArray(response.data.items) ? response.data.items : [];
    },
  });

  const { mutate: addItem, isPending: isAdding } = useMutation({
    mutationFn: async (input: AddToShoppingListInput) => {
      const response = await api.post("/api/shopping-list", input);
      return response.data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      console.error("Error adding to shopping list:", error);
    },
  });

  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: async ({ itemId, ...input }: UpdateShoppingListItemInput) => {
      const response = await api.put(`/api/shopping-list/${itemId}`, input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      console.error("Error updating shopping list item:", error);
    },
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(`/api/shopping-list/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      console.error("Error deleting shopping list item:", error);
    },
  });

  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    isAdding,
    isUpdating,
    isDeleting,
  };
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(`/api/shopping-list/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      console.error("Error deleting shopping list item:", error);
    },
  });
}
