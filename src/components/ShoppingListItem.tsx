import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
import { getStringId, formatQuantity } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";

interface Props {
  product: {
    _id: string | { $oid: string };
    product: {
      name: string;
      img?: string;
      price_per_store?: {
        [key: string]: {
          price_per_item: string;
          price_per_unit: string;
        };
      };
    };
    quantity: number;
    unit: string;
  };
  onDelete: (id: string) => void;
}

export default function ShoppingListItem({ product }: Props) {
  const [error] = useState<string | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [quantity, setQuantity] = useState<string>(product.quantity.toString());
  const { updateItem, deleteItem } = useShoppingList();

  const itemId = getStringId(product._id);

  async function handleDeleteFromShoppingList(){
    try {
      await deleteItem(itemId);
      setSwiping(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete from shopping list";
        toast.error(errorMessage);
        setSwiping(false);
      }
    }
  }

  const handleQuantityChange = (newQuantity: string) => {
    const parsedQuantity = parseFloat(newQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0.01) {
      toast.error('Quantity must be at least 0.01');
      return;
    }

    const formattedQuantity = formatQuantity(parsedQuantity);
    setQuantity(formattedQuantity);
    updateItem({
      id: itemId,
      data: {
        quantity: parsedQuantity,
        unit: product.unit
      }
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setSwiping(true);
      handleDeleteFromShoppingList();
    },
    onSwiping: (eventData) => {
      setSwiping(eventData.dir === "Left");
    },
    onSwiped: () => {
      setSwiping(false);
    },
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
      className={`relative bg-white rounded-lg shadow-sm p-4 transition-all duration-300 ease-in-out transform hover:shadow-lg hover:scale-105 ${
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
            onBlur={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                const formattedValue = formatQuantity(value);
                setQuantity(formattedValue);
                handleQuantityChange(formattedValue);
              }
            }}
          />
          <span className="text-gray-500">{product.unit}</span>
          <button
            onClick={handleDeleteFromShoppingList}
            className="p-2 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
