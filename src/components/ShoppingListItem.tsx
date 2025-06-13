import api from "@/lib/axios";
import type { ShoppingListItem as ShoppingListItemType } from "@/types/shoppingTypes";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSwipeable } from "react-swipeable";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";

type Props = {
  product: ShoppingListItemType;
  onDelete: (id: string) => void;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export default function ShoppingListItem({ product, onDelete }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [quantity, setQuantity] = useState<string>(product.quantity.toString());
  const queryClient = useQueryClient();
  const { updateItem } = useShoppingList();

  const handleDeleteFromShoppingList = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/shopping-list/${product._id}`, {
        headers: getAuthHeaders()
      });
    },
    onSuccess: () => {
      onDelete(product._id);
      setSwiping(false);
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.error || "Failed to delete from shopping list"
      );
      setSwiping(false);
    },
  });

  const handleQuantityChange = (newQuantity: string) => {
    const parsedQuantity = parseFloat(newQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0.01) return;

    setQuantity(newQuantity);
    updateItem({
      id: product._id,
      data: {
        quantity: parsedQuantity,
        unit: product.unit
      }
    });
  };

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

  if (!product.product) {
    console.warn('ShoppingListItem received item without product:', product);
    return null;
  }

  console.log('ShoppingListItem product data:', {
    name: product.product.name,
    img: product.product.img,
    fullProduct: product.product
  });

  return (
    <div
      {...swipeHandlers}
      className={`relative bg-white rounded-lg shadow-sm p-4 transition-transform ${
        swiping ? "translate-x-[-100px]" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {product.product.img && (
          <img
            src={product.product.img}
            alt={product.product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{product.product.name}</h3>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-center"
            min="0.01"
            step="0.01"
          />
          <span className="text-gray-500">{product.unit}</span>
          <button
            onClick={() => handleDeleteFromShoppingList.mutate()}
            className="p-2 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
