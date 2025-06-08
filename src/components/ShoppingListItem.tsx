import api from "@/lib/axios";
import type { ShoppingListItem } from "@/types/shoppingTypes";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSwipeable } from "react-swipeable";

type Props = {
  product: ShoppingListItem;
  onDelete: (productId: string) => void;
};

export default function ShoppingListItem({ product, onDelete }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [swiping, setSwiping] = useState(false);
  const queryClient = useQueryClient();

  const updateQuantity = useMutation({
    mutationFn: async (quantity: number) => {
      const response = await api.put(`/api/shopping-list/${product.id}`, {
        quantity,
      });
      return response.data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || "Failed to update quantity");
    },
  });

  const handleDeleteFromShoppingList = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/shopping-list/${product.id}`);
    },
    onSuccess: () => {
      onDelete(product.id);
      setSwiping(false);
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.error || "Failed to delete from shopping list"
      );
      setSwiping(false);
    },
  });

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setSwiping(true);
      handleDeleteFromShoppingList.mutate();
    },
    onSwiping: (eventData) => {
      setSwiping(eventData.dir === "Left");
    },
    onSwiped: () => {
      if (!handleDeleteFromShoppingList.isPending) {
        setSwiping(false);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      className="relative flex items-center justify-between p-4 border-b"
      {...swipeHandlers}
    >
      <div className="flex flex-col w-full">
        <span className="text-lg font-medium">{product.product.name}</span>
        <div className="flex items-center gap-2 mt-1">
          <label
            htmlFor={`quantity=${product.id}`}
            className="text-sm text-gray-600"
          >
            Quantity:
          </label>
          <input
            id={`quantity=${product.id}`}
            type="number"
            min={0.01}
            step={0.1}
            value={product.quantity}
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateQuantity.mutate(parseFloat(e.target.value))
            }
            className="w-16 border rounded px-2 py-1 text-sm"
            disabled={
              updateQuantity.isPending || handleDeleteFromShoppingList.isPending
            }
          />
          <span className="text-sm text-gray-600">{product.unit}</span>
        </div>
        {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
      </div>

      <button
        onClick={() => handleDeleteFromShoppingList.mutate()}
        className="text-red-500 hover:text-red-700 cursor-pointer p-2"
        aria-label="Delete item from shopping list"
        disabled={handleDeleteFromShoppingList.isPending}
      >
        <Trash2 className="w-5 h-5" />
      </button>
      {swiping && (
        <div className="absolute inset-0 bg-red-100 flex items-center justify-center">
          <span className="text-red-500">Delete</span>
        </div>
      )}
    </div>
  );
}
