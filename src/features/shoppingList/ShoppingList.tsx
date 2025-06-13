import { useState } from "react";
import { useShoppingList } from "./useShoppingList";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import type { ShoppingListItem as ShoppingListItemType } from "@/types/shoppingTypes";
import ShoppingListItem from "@/components/ShoppingListItem";

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  onQuantityChange: (item: ShoppingListItemType, newQuantity: string) => void;
  onDelete: (itemId: string) => void;
}

function ShoppingListItemComponent({
  item,
  onQuantityChange,
  onDelete,
}: ShoppingListItemProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>(item.quantity.toString());

  const getItemId = () => {
    return item._id;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center p-4">
        {item.product?.img && (
          <img
            src={item.product.img}
            alt={item.product?.name || "Product image"}
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {item.product?.name || "Unknown Product"}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="number"
              value={editingItem === item._id ? quantity : item.quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuantity(e.target.value);
                onQuantityChange(item, e.target.value);
              }}
              onFocus={() => {
                setEditingItem(item._id);
                setQuantity(item.quantity.toString());
              }}
              onBlur={() => setEditingItem(null)}
              className="w-20 px-2 py-1 border rounded"
              min="0.01"
              step="0.1"
            />
            <span className="text-gray-600">{item.unit}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(getItemId())}
          className="hidden md:block p-2 text-red-500 hover:text-red-700"
          aria-label="Delete item from shopping list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function ShoppingList() {
  const { items, isLoading, error, deleteItem } = useShoppingList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Debug log to see the items structure
  console.log('Shopping list items:', JSON.stringify(items, null, 2));

  // Filter out items without IDs or products
  const validItems = items.filter(item => {
    if (!item._id) {
      console.warn('Skipping item without ID:', item);
      return false;
    }
    if (!item.product) {
      console.warn('Skipping item without product:', item);
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {validItems.map((item: ShoppingListItemType, index: number) => {
        // Debug log for each item
        console.log('Processing item:', {
          id: item._id,
          product: item.product,
          quantity: item.quantity,
          unit: item.unit
        });
        
        return (
          <ShoppingListItem
            key={item._id}
            product={item}
            onDelete={deleteItem}
          />
        );
      })}
    </div>
  );
}
