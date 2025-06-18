import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
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

interface ShoppingListResponse {
  message: string;
  items: ShoppingListItem[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
  };
}

export function useShoppingList() {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["shopping-list"],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('per_page', '20');
      
      const response = await api.get(`/api/shopping-list?${params.toString()}`);
      return response.data as ShoppingListResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.has_more ? lastPage.pagination.current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Memoize the flattened array to prevent infinite loops
  const allItems = useMemo(() => {
    return query.data?.pages.flatMap((page: ShoppingListResponse) => page.items) ?? [];
  }, [query.data?.pages]);

  const addItemMutation = useMutation({
    mutationFn: async (data: { productId: string; quantity: number; unit: string }) => {
      const response = await api.post('/api/shopping-list', {
        product_id: data.productId,
        quantity: data.quantity,
        unit: data.unit,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (data: { id: string; data: { quantity: number; unit?: string } }) => {
      const response = await api.put(`/api/shopping-list/${data.id}`, data.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/shopping-list/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });

  return {
    ...query,
    items: allItems,
    data: allItems,
    hasMore: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    addItem: addItemMutation.mutateAsync,
    updateItem: updateItemMutation.mutateAsync,
    deleteItem: deleteItemMutation.mutateAsync,
    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
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
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
    onError: (error: unknown) => {
      if(error instanceof AxiosError) {
      console.error("Error deleting shopping list item:", error);
    }
  }
});
}
