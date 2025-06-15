import { useShoppingList } from "./useShoppingList";
// import { useSwipeable } from "react-swipeable";
// import { motion, AnimatePresence } from "framer-motion";
import type { ShoppingListItem as ShoppingListItemType } from "@/types/shoppingTypes";
import { Trash, Plus, Minus } from "lucide-react";
import Image from "next/image";

interface ShoppingListItemProps {
  product: ShoppingListItemType;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

function ShoppingListItem({ product, onDelete, onUpdateQuantity }: ShoppingListItemProps) {
  return (
    <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-2">
      <div className="flex items-center space-x-4">
        {product.product?.img && (
          <div className="relative w-16 h-16">
            <Image
              src={product.product.img}
              alt={product.product.name}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        <div>
          <h3 className="font-medium text-gray-900">{product.product?.name}</h3>
          <p className="text-sm text-gray-500">{product.unit}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(product._id, Math.max(0, product.quantity - 1))}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center">{product.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, product.quantity + 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => onDelete(product._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
}

export default function ShoppingList() {
  const { items, isLoading, error, deleteItem, updateItem } = useShoppingList();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateItem({ id, data: { quantity } });
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping List</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your shopping list is empty</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <ShoppingListItem
              key={item._id}
              product={item}
              onDelete={deleteItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
