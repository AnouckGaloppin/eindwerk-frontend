import { ShoppingListItem } from "@/types/productTypes";

interface ShoppingListItemProps {
  item: ShoppingListItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
}

export default function ShoppingListItem({ item, onUpdateQuantity, onDelete }: ShoppingListItemProps) {
  return (
    <div className="border p-4 rounded-lg">
      <h3 className="text-lg font-semibold">{item.product.name}</h3>
      <p className="text-gray-600">Quantity: {item.quantity}</p>
      <p className="text-gray-600">Price: €{item.product.price}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          -
        </button>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          +
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
} 