import React from 'react';
import { Heart, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/productTypes';
import { ShoppingListItem } from '@/types/shoppingTypes';
import { Favourite } from "@/types/favouritesTypes";
import { useShoppingList } from '@/features/shoppingList/useShoppingList';
import Link from "next/link";
import { formatPrice, formatQuantity, generateSlug } from '@/lib/utils';
import { toast } from 'react-toastify';
import { useFavourites } from "../favourites/useFavourites";
import { useToggleFavourite } from "../favourites/useFavourites";
import { useAuth } from "@/lib/auth-context";
import { CardLoader } from "@/components/ui/Loader";

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  return typeof id === 'object' ? id.$oid : id;
};

interface ProductListProps {
  products: Product[];
  shoppingList: ShoppingListItem[];
  favourites: Favourite[];
  onAddOrUpdate: (product: Product, quantity: number) => void;
  onToggleFavourite: (productId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh: () => Promise<any>;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  favourites,
  isLoading,
  error,
  onToggleFavourite,
  onRefresh,
}) => {
  const { items: shoppingListItems, updateItem, addItem, deleteItem } = useShoppingList();
  const { user } = useAuth();
  const { data: favouritesFromAPI = [] } = useFavourites();
  const toggleFavourite = useToggleFavourite();

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
    try {
      const existingItem = shoppingListItems.find(item => {
        if (!item.product_id) return false;
        return getStringId(item.product_id) === productId;
      });

      if (existingItem) {
        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or negative
          await deleteItem(getStringId(existingItem._id));
        } else {
          // Update existing item
          await updateItem({
            id: getStringId(existingItem._id),
            data: { quantity: newQuantity }
          });
        }
      } else if (newQuantity > 0) {
        // Add new item
        const product = products.find(p => getStringId(p._id) === productId);
        if (product) {
          await addItem({
            productId,
            quantity: newQuantity,
            unit: product.unit || 'piece'
          });
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Fout bij updaten hoeveelheid');
    }
  };

  const handleIncrement = (product: Product) => {
    const productId = getStringId(product._id);
    const currentItem = shoppingListItems.find(item => {
      if (!item.product_id) return false;
      return getStringId(item.product_id) === productId;
    });
    
    const currentQuantity = currentItem?.quantity || 0;
    const incrementAmount = product.unit === 'piece' ? 1 : 0.1;
    handleQuantityChange(productId, currentQuantity + incrementAmount);
  };

  const handleDecrement = (product: Product) => {
    const productId = getStringId(product._id);
    const currentItem = shoppingListItems.find(item => {
      if (!item.product_id) return false;
      return getStringId(item.product_id) === productId;
    });
    
    const currentQuantity = currentItem?.quantity || 0;
    const decrementAmount = product.unit === 'piece' ? 1 : 0.1;
    handleQuantityChange(productId, Math.max(0, currentQuantity - decrementAmount));
  };

  if (isLoading) {
    return <CardLoader text="Producten laden..." />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Check if products is empty array
  if (Array.isArray(products) && products.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 text-xl font-medium">Geen producten gevonden</p>
        <p className="text-gray-400 mt-2">Probeer een andere categorie of pas je zoekopdracht aan</p>
      </div>
    );
  }

  const productList = (
    <div className="space-y-6">
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="grid"
        aria-label="Producten grid"
      >
        {products.map((product) => {
          const productId = getStringId(product._id);
          const isFavourite = favouritesFromAPI.some(fav => {
            if (!fav.product_id) return false;
            return getStringId(fav.product_id) === productId;
          });
          
          const shoppingListItem = shoppingListItems.find(item => {
            if (!item.product_id) return false;
            return getStringId(item.product_id) === productId;
          });
          const quantity = shoppingListItem?.quantity || 0;
          const lowestPrice = getLowestPrice(product);

          return (
            <article 
              key={productId}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow focus-within:shadow-md"
              role="gridcell"
              aria-label={`Product: ${product.name} by ${product.brand}`}
            >
              <Link
                href={`/products/${generateSlug(product.name)}`}
                className="block focus:outline-none"
                aria-label={`Bekijk details voor ${product.name}`}
              >
                <div className="relative">
                  {product.img && (
                    <img
                      src={product.img}
                      alt={`${product.name} product afbeelding`}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavourite.mutate({ product_id: productId });
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`${isFavourite ? 'Verwijder van' : 'Voeg toe aan'} ${product.name} favorieten`}
                    aria-pressed={isFavourite}
                  >
                    <Heart 
                      className={`w-6 h-6 ${isFavourite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 break-words leading-tight">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {shoppingListItem && shoppingListItem.quantity > 0 ? (
                        <div 
                          className="flex items-center space-x-2"
                          role="group"
                          aria-label={`Hoeveelheid controls voor ${product.name}`}
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDecrement(product);
                            }}
                            className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            aria-label={`Verlaag hoeveelheid van ${product.name}`}
                          >
                            <span aria-hidden="true">-</span>
                          </button>
                          
                          <label htmlFor={`quantity-${productId}`} className="sr-only">
                            Hoeveelheid voor {product.name}
                          </label>
                          <input
                            id={`quantity-${productId}`}
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
                            aria-label={`Huidige hoeveelheid: ${formatQuantity(quantity)} ${product.unit}`}
                          />
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleIncrement(product);
                            }}
                            className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            aria-label={`Verhoog hoeveelheid van ${product.name}`}
                          >
                            <span aria-hidden="true">+</span>
                          </button>
                          
                          <span className="text-sm text-gray-500" aria-label="Meeteenheid">
                            {product.unit}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Use the product's quantity from the database
                            const dbQuantity = typeof product.quantity === 'string' 
                              ? parseFloat(product.quantity)
                              : (typeof product.quantity === 'number' ? product.quantity : 0);
                            console.log('Voeg item toe met database hoeveelheid:', {
                              productId,
                              dbQuantity,
                              rawQuantity: product.quantity
                            });
                            handleQuantityChange(productId, dbQuantity || (product.unit === 'stuks' ? 1 : 0.1));
                          }}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                          aria-label={`Voeg ${product.name} toe aan winkelmandje`}
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                          <ShoppingCart/>
                        </button>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-indigo-600">
                        €{formatPrice(lowestPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      {isLoading && products.length === 0 ? (
        <CardLoader text="Producten laden..." />
      ) : (
        productList
      )}
    </div>
  );
};

export default ProductList;
