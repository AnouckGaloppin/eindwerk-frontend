import api from "@/lib/axios";
import { ShoppingItem } from "@/types/shoppingTypes";
import { div, span } from "framer-motion/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  product: ShoppingItem;
  onDelete: (productId: string) => void;
};

export default function ShoppingListItem({ product, onDelete }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [swiping, setSwiping] = useState(false);

  const handleDeleteFromShoppingList = async (p0: string) => {
    setDeleting(true);
    setError(null);
    try {
      await api.delete(`/shopping-list/${product.id || product._id}`);
      onDelete(product.id || product._id);
    } catch (error: any) {
      console.error("Error deleting from shopping list:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(
        error.response?.data?.message || "Failed to delete from shopping list"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-lg font-medium">{product.name}</span>
      {swiping && (
        <div className="absolute inset-0 bg-red-100 flex items-center justify-center">
          <span className="text-red-500">Delete</span>
        </div>
      )}
      <button
        onClick={() => handleDeleteFromShoppingList(product.id || product._id)}
        className="text-red-500 hover:text-red-700 cursor-pointer p-2"
        aria-label="Delete item from shopping list"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </div>
  );
}
