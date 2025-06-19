import type { ShoppingListItem as ShoppingListItemType } from "@/types/productTypes";

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
}

export default function ShoppingListItem({ item, onUpdateQuantity, onDelete }: ShoppingListItemProps) {
  const product = item.product;
  if (!product) {
    return <div>Loading product details...</div>;
  }

  const handleQuantityChange = (increase: boolean) => {
    const newQuantity = increase 
      ? item.quantity + product.quantity
      : Math.max(0, item.quantity - product.quantity);
    onUpdateQuantity(item._id, newQuantity);
  };

  return (
    <div className="border p-4 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">Quantity: {item.quantity}</p>
      {product.price_per_store && Object.entries(product.price_per_store)[0] && (
        <p className="text-gray-600">
          Price: €{Object.entries(product.price_per_store)[0][1].price_per_item}
        </p>
      )}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => handleQuantityChange(false)}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          -
        </button>
        <button
          onClick={() => handleQuantityChange(true)}
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