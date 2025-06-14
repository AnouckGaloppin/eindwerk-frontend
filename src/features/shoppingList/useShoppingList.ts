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

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  if (typeof id === 'object' && id !== null && '$oid' in id) {
    return id.$oid;
  }
  return id;
};

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
    mutationFn: async ({
      productId,
      quantity,
      unit,
    }: {
      productId: string;
      quantity: number;
      unit: string;
    }) => {
      const response = await api.post("/api/shopping-list", {
        product_id: productId,
        quantity,
        unit,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ShoppingListItem>;
    }) => {
      console.log('Updating item:', { id, data });
      const response = await api.put(`/api/shopping-list/${id}`, data);
      console.log('Update response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string | { $oid: string }) => {
      const stringId = getStringId(id);
      console.log('Attempting to delete item with ID:', stringId);
      
      try {
        const response = await api.delete(`/api/shopping-list/${stringId}`);
        if (!response.data) {
          throw new Error('No response data received from delete operation');
        }
        return response.data;
      } catch (error: any) {
        console.error('Delete error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          id: stringId
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete item';
      console.error("Error deleting shopping list item:", errorMessage);
      throw new Error(errorMessage);
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
    mutationFn: async (itemId: string | { $oid: string }) => {
      const stringId = getStringId(itemId);
      const response = await api.delete(`/api/shopping-list/${stringId}`);
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
