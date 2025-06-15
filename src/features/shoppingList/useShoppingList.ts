import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ShoppingListItem,
  // AddToShoppingListInput,
  // UpdateShoppingListItemInput,
} from "@/types/shoppingTypes";
import api from "@/lib/axios";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";
import { Product } from "@/types/productTypes";

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

      const processedItems = response.data.items.map((item: ShoppingListItem) => ({
        ...item,
        _id: item._id,
        product_id: item.product_id,
        quantity: item.quantity,
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
      const requestData = {
        product_id: productId,
        quantity,
        unit,
      };
      console.log('Adding item to shopping list - Request data:', requestData);
      
      try {
        const response = await api.post("/api/shopping-list", requestData);
        console.log('Add item response:', response.data);
        return response.data;
      } catch (error: unknown) {
        if(error instanceof AxiosError) {
        console.error('Add item error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          requestData,
          errorResponse: error.response,
          errorConfig: error.config
        });
        throw error;
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList"] });
      const previousItems = queryClient.getQueryData<ShoppingListItem[]>(["shoppingList"]);

      // Optimistically update to the new value
      queryClient.setQueryData<ShoppingListItem[]>(["shoppingList"], (old) => {
        if (!old) return [];
        const tempItem: ShoppingListItem = {
          _id: 'temp-id',
          product_id: newItem.productId,
          product: { name: 'Loading...' } as Product,
          quantity: newItem.quantity,
          unit: newItem.unit,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return [...old, tempItem];
      });

      return { previousItems };
    },
    onError: (err: unknown, newItem, context) => {
      if(err instanceof AxiosError) {
      if (context?.previousItems) {
        queryClient.setQueryData(["shoppingList"], context.previousItems);
      }
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add item';
      console.error("Error adding shopping list item:", errorMessage);
      toast.error(errorMessage);
    }
  },
    onSettled: () => {
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
      try {
        const response = await api.put(`/api/shopping-list/${id}`, data);
        console.log('Update response:', response.data);
        return response.data;
      } catch (error: unknown) {
        if(error instanceof AxiosError) {
        console.error('Update error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          itemId: id,
          updateData: data
        });
        throw error;
      } else {
        throw new Error('Unknown error occurred');
      }
    }
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["shoppingList"] });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<ShoppingListItem[]>(["shoppingList"]);

      // Optimistically update to the new value
      queryClient.setQueryData<ShoppingListItem[]>(["shoppingList"], (old) => {
        if (!old) return [];
        return old.map(item => {
          if (getStringId(item._id) === getStringId(id)) {
            return { ...item, ...data };
          }
          return item;
        });
      });

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onError: (err: unknown, newItem, context) => {
      if(err instanceof AxiosError) {
      if (context?.previousItems) {
        queryClient.setQueryData(["shoppingList"], context.previousItems);
      }
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update item';
      console.error("Error updating shopping list item:", errorMessage);
      toast.error(errorMessage);
    }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    }
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
      } catch (error: unknown) {
        if(error instanceof AxiosError) {
        console.error('Delete error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          id: stringId
        });
        throw error;
      } else {
        throw new Error('Unknown error occurred');
      }
    }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList"] });
      const previousItems = queryClient.getQueryData<ShoppingListItem[]>(["shoppingList"]);

      // Optimistically update to the new value
      queryClient.setQueryData<ShoppingListItem[]>(["shoppingList"], (old) => {
        if (!old) return [];
        return old.filter(item => item._id !== id);
      });

      return { previousItems };
    },
    onError: (err: unknown, id, context) => {
      if(err instanceof AxiosError) {
      if (context?.previousItems) {
        queryClient.setQueryData(["shoppingList"], context.previousItems);
      }
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete item';
      console.error("Error deleting shopping list item:", errorMessage);
      toast.error(errorMessage);
    }
  },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    }
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
    onError: (error: unknown) => {
      if(error instanceof AxiosError) {
      console.error("Error deleting shopping list item:", error);
    }
  }
});
}
