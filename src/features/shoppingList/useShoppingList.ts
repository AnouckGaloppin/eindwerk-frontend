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

export function useShoppingList() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery<ShoppingListItem[]>({
    queryKey: ["shoppingList"],
    queryFn: async () => {
      console.log('Fetching shopping list');
      const response = await api.get("/api/shopping-list");
      console.log('Raw response from backend:', response.data);
      console.log('Items before processing:', response.data.items);

      const processedItems = response.data.items.map((item: any) => ({
        ...item,
        _id: typeof item._id === 'object' ? item._id.$oid : item._id,
        product_id: typeof item.product_id === 'object' ? item.product_id.$oid : item.product_id,
        quantity: parseFloat(item.quantity)
      }));

      console.log('Processed items:', processedItems);
      return processedItems;
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (input: AddToShoppingListInput) => {
      const response = await api.post("/api/shopping-list", {
        product_id: input.productId,
        quantity: input.quantity,
        unit: input.unit
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      console.error("Error adding to shopping list:", error.response?.data || error);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ShoppingListItem> }) => {
      console.log('Updating item:', { id, data });
      const response = await api.put(`/api/shopping-list/${id}`, data);
      console.log('Update response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      console.error("Error updating shopping list item:", error.response?.data || error);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting item:', id);
      await api.delete(`/api/shopping-list/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      console.error("Error deleting shopping list item:", error.response?.data || error);
    },
  });

  return {
    items,
    isLoading,
    error,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
  };
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await api.delete(`/api/shopping-list/${itemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      console.error("Error deleting shopping list item:", error);
    },
  });
}
