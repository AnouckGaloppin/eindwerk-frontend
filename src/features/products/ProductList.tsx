import React from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/productTypes';
import { ShoppingListItem } from '@/types/shoppingTypes';
import { Favourite } from "@/types/favouritesTypes";
import { useShoppingList } from '@/features/shoppingList/useShoppingList';
import Link from "next/link";
import { formatPrice, formatQuantity } from '@/lib/utils';
import { toast } from 'react-toastify';

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  return typeof id === 'object' ? id.$oid : id;
};

interface ProductListProps {
  products: Product[];
  favourites: Favourite[];
  isLoading?: boolean;
  error?: string | null;
  onToggleFavourite: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  favourites,
  isLoading,
  error,
  onToggleFavourite,
}) => {
  const { items: shoppingListItems, updateItem, addItem, deleteItem } = useShoppingList();

  const getLowestPrice = (product: Product) => {
    if (!product.price_per_store || typeof product.price_per_store !== 'object') return 0;
    
    // Convert price_per_store object to array of prices
    const prices = Object.values(product.price_per_store).map(store => 
      typeof store === 'object' && 'price_per_item' in store 
        ? parseFloat(store.price_per_item) 
        : 0
    ).filter(price => !isNaN(price));
    
    return prices.length ? Math.min(...prices) : 0;
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    console.log('handleQuantityChange called with:', { productId, newQuantity });
    
    // Ensure newQuantity is a valid number
    const parsedQuantity = typeof newQuantity === 'number' && !isNaN(newQuantity) ? newQuantity : 0;
    const formattedQuantity = formatQuantity(parsedQuantity);
    
    console.log('Quantity processing:', {
      productId,
      newQuantity,
      parsedQuantity,
      formattedQuantity
    });

    const shoppingListItem = shoppingListItems.find(item => getStringId(item.product_id) === productId);
    const product = products.find(p => getStringId(p._id) === productId);

    console.log('Found items:', {
      shoppingListItem,
      product
    });

    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    // If quantity is zero, remove the item if it exists
    if (parsedQuantity === 0) {
      if (shoppingListItem) {
        try {
          console.log('Removing item from shopping list:', {
            itemId: getStringId(shoppingListItem._id)
          });
          await deleteItem(getStringId(shoppingListItem._id));
        } catch (error: unknown) {
          console.error('Error removing item:', error);
          toast.error('Failed to remove item from shopping list');
        }
      }
      return;
    }

    try {
      if (shoppingListItem) {
        console.log('Updating existing item:', {
          itemId: getStringId(shoppingListItem._id),
          newQuantity: parsedQuantity
        });
        await updateItem({ 
          id: getStringId(shoppingListItem._id),
          data: {
            quantity: parsedQuantity,
            unit: shoppingListItem.unit
          }
        });
      } else {
        // When adding a new item, use the exact quantity passed in
        console.log('Adding new item with quantity:', {
          productId,
          quantity: parsedQuantity,
          productUnit: product.unit
        });
        
        await addItem({
          productId,
          quantity: parsedQuantity,
          unit: product.unit
        });
      }
    } catch (error) {
      console.error('Error updating shopping list:', error);
    }
  };

  const handleIncrement = (product: Product) => {
    const productId = getStringId(product._id);
    const shoppingListItem = shoppingListItems.find(item => getStringId(item.product_id) === productId);
    const currentQuantity = typeof shoppingListItem?.quantity === 'number' && !isNaN(shoppingListItem.quantity)
      ? shoppingListItem.quantity
      : 0;
    handleQuantityChange(productId, currentQuantity + (product.unit === 'piece' ? 1 : 0.1));
  };

  const handleDecrement = (product: Product) => {
    const productId = getStringId(product._id);
    const shoppingListItem = shoppingListItems.find(item => getStringId(item.product_id) === productId);
    const currentQuantity = typeof shoppingListItem?.quantity === 'number' && !isNaN(shoppingListItem.quantity)
      ? shoppingListItem.quantity
      : 0;
    const decrementAmount = product.unit === 'piece' ? 1 : 0.1;
    handleQuantityChange(productId, Math.max(0, currentQuantity - decrementAmount));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  console.log('ProductList received products:', products);
  console.log('ProductList received shoppingList:', shoppingListItems);
  console.log('ProductList received favourites:', favourites);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Geen producten gevonden</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const productId = getStringId(product._id);
        const isFavourite = favourites.some(fav => getStringId(fav.product._id) === productId);
        const shoppingListItem = shoppingListItems.find(item => getStringId(item.product_id) === productId);
        const quantity = shoppingListItem?.quantity || 0;

        return (
          <Link href={`/products/${productId}`} key={productId}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavourite(productId);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
                >
                  <Heart 
                    className={`w-6 h-6 ${isFavourite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.brand}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {shoppingListItem && shoppingListItem.quantity > 0 ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDecrement(product);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          -
                        </button>
                        
                        <input
                          type="number"
                          value={formatQuantity(quantity)}
                          onChange={(e) => {
                            e.preventDefault();
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(productId, value);
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="w-16 text-center px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                          step={product.unit === 'piece' ? 1 : 0.1}
                        />
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleIncrement(product);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          +
                        </button>
                        
                        <span className="text-sm text-gray-500">
                          {product.unit}
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Use the product's quantity from the database
                          const dbQuantity = typeof product.quantity === 'string' 
                            ? parseFloat(product.quantity)
                            : (typeof product.quantity === 'number' ? product.quantity : 0);
                          console.log('Adding item with database quantity:', {
                            productId,
                            dbQuantity,
                            rawQuantity: product.quantity
                          });
                          handleQuantityChange(productId, dbQuantity || (product.unit === 'piece' ? 1 : 0.1));
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Prijs per {product.unit}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      €{formatPrice(getLowestPrice(product))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductList;
