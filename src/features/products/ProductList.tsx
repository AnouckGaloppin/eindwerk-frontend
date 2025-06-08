import { Heart } from "lucide-react";
import type { Product, StorePrice } from "@/types/productTypes";
import type { ShoppingListItem } from "@/types/shoppingTypes";

type ProductListProps = {
  products: Product[];
  shoppingList: ShoppingListItem[];
  favourites: { product: { id: string } }[];
  isLoading?: boolean;
  error?: string | null;
  onAddOrUpdate: (product: Product) => void;
  onQuantityChange: (itemId: string, newQuantity: string) => void;
  onToggleFavourite: (productId: string) => void;
};

export default function ProductList({
  products,
  shoppingList,
  favourites,
  isLoading,
  error,
  onAddOrUpdate,
  onQuantityChange,
  onToggleFavourite,
}: ProductListProps) {
  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  const getLowestPrice = (product: Product): string => {
    const prices = Object.values(product.price_per_store || {})
      .map((store: StorePrice) => parseFloat(store.price_per_item))
      .filter((price) => !isNaN(price));
    return prices.length ? Math.min(...prices).toFixed(2) : "0.00";
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: Product) => {
            const productId = String(product.id);
            const shoppingListItem = shoppingList.find(
              (item: any) => item.product_id === productId
            );
            const isFavourite = favourites.some(
              (fav) => fav.product.id === productId
            );

            return (
              <div
                key={productId}
                className="border p-4 rounded shadow hover:shadow-lg transition-shadow"
              >
                {product.img && (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  Quantity: {product.quantity} {product.unit}
                </p>
                <p className="text-lg font-bold mt-2">
                  €{getLowestPrice(product)}
                </p>

                {!shoppingListItem ? (
                  <button
                    onClick={() => onAddOrUpdate(product)}
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  >
                    Add to Shopping List
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`quantity-${productId}`}
                        className="text-sm text-gray-600"
                      >
                        Quantity:
                      </label>
                      <input
                        id={`quantity-${productId}`}
                        type="number"
                        min={0.01}
                        step={0.1}
                        value={shoppingListItem.quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onQuantityChange(shoppingListItem._id, e.target.value)
                        }
                        className="w-16 border px-2 py-1 rounded"
                      />
                      <span className="text-sm text-gray-600">
                        {shoppingListItem.unit}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onToggleFavourite(productId)}
                  aria-label={
                    isFavourite ? "Remove from favourites" : "Add to favourites"
                  }
                  className="mt-2"
                >
                  {isFavourite ? (
                    <Heart className="fill-red-500 text-red-500 w-6 h-6" />
                  ) : (
                    <Heart className="w-6 h-6" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
