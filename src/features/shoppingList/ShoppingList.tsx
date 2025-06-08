import { useState } from "react";
import { useShoppingList } from "./useShoppingList";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import type { ShoppingListItem } from "@/types/shoppingTypes";
import { useDeleteItem } from "./useShoppingList";

interface ShoppingListItemProps {
  item: ShoppingListItem;
  onQuantityChange: (item: ShoppingListItem, newQuantity: string) => void;
  onDelete: (itemId: string) => void;
}

function ShoppingListItemComponent({
  item,
  onQuantityChange,
  onDelete,
}: ShoppingListItemProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [swiping, setSwiping] = useState(false);

  // Debug log for item structure
  console.log("Shopping list item:", item);

  const getItemId = () => String(item.id);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      onDelete(getItemId());
      setSwiping(false);
    },
    onSwiping: (event) => {
      if (event.dir === "Left") setSwiping(true);
    },
    onSwipedRight: () => setSwiping(false),
    onTap: () => setSwiping(false),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="relative bg-white rounded-lg shadow-md overflow-hidden"
      {...swipeHandlers}
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
              value={editingItem === item.id ? quantity : item.quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onQuantityChange(item, e.target.value)
              }
              onFocus={() => {
                setEditingItem(item.id);
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
      {swiping && (
        <div className="absolute inset-y-0 right-0 flex items-center bg-red-500 text-white px-4 md:hidden">
          <span>Delete</span>
        </div>
      )}
    </motion.div>
  );
}

export default function ShoppingList() {
  const { items, isLoading, error, updateItem } = useShoppingList();
  const deleteItem = useDeleteItem();

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading shopping list: {error.message}
      </div>
    );
  }

  const handleQuantityChange = (
    item: ShoppingListItem,
    newQuantity: string
  ) => {
    if (newQuantity === "") return;

    const numQuantity = parseFloat(newQuantity);
    if (!isNaN(numQuantity) && numQuantity > 0) {
      updateItem({
        itemId: item.id,
        quantity: numQuantity,
      });
    }
  };

  // Debug log to check items
  console.log("Shopping list items:", items);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {items.map((item, index) => {
          // Create a unique key using both _id and index
          const uniqueKey = `${item.id}-${index}`;
          return (
            <ShoppingListItemComponent
              key={uniqueKey}
              item={item}
              onQuantityChange={handleQuantityChange}
              onDelete={(id) => deleteItem.mutate(id)}
            />
          );
        })}
      </AnimatePresence>
      {items.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Your shopping list is empty
        </div>
      )}
    </div>
  );
}
