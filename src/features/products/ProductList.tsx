import React from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/productTypes';
import { ShoppingListItem } from '@/types/shoppingTypes';
import { Favourite } from "@/types/favouritesTypes";
import { useShoppingList } from '@/features/shoppingList/useShoppingList';
import Link from "next/link";
import { formatPrice, formatQuantity } from '@/lib/utils';

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  return typeof id === 'object' ? id.$oid : id;
};

interface ProductListProps {
  products: Product[];
  shoppingList: ShoppingListItem[];
  favourites: Favourite[];
  isLoading?: boolean;
  error?: string | null;
  onAddOrUpdate: (product: Product, quantity: number) => void;
  onToggleFavourite: (productId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  shoppingList,
  favourites,
  isLoading,
  error,
  onAddOrUpdate,
  onToggleFavourite,
  onQuantityChange,
}) => {
  const { items: shoppingListItems, updateItem, addItem } = useShoppingList();

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

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const formattedQuantity = parseFloat(formatQuantity(newQuantity));
    const shoppingListItem = shoppingListItems.find(item => getStringId(item.product_id) === productId);
    if (shoppingListItem) {
      updateItem({ 
        id: shoppingListItem._id,
        data: {
          quantity: formattedQuantity,
          unit: shoppingListItem.unit
        }
      });
    } else {
      const product = products.find(p => getStringId(p._id) === productId);
      if (product) {
        addItem({
          productId,
          quantity: formattedQuantity,
          unit: product.unit
        });
      }
    }
  };

  const handleIncrement = (product: Product) => {
    const productId = getStringId(product._id);
    const shoppingListItem = shoppingList.find(item => getStringId(item.product._id) === productId);
    handleQuantityChange(productId, (shoppingListItem?.quantity || 0) + 0.1);
  };

  const handleDecrement = (product: Product) => {
    const productId = getStringId(product._id);
    const shoppingListItem = shoppingList.find(item => getStringId(item.product._id) === productId);
    handleQuantityChange(productId, Math.max(0, (shoppingListItem?.quantity || 0) - 0.1));
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: Product) => {
        console.log('Rendering product:', product);
        console.log('Product _id:', product._id);
        
        if (!product._id) {
          console.error('Product missing _id:', product);
          return null;
        }

        const productId = getStringId(product._id);
        const shoppingListItem = shoppingListItems.find(item => getStringId(item.product_id) === productId);
        const isFavourite = favourites.some(fav => getStringId(fav.product._id) === productId);
        
        const price = product.price_per_store?.colruyt?.price_per_item;
        console.log('Product price:', price);
        
        return (
          <Link href={`/products/${productId}`} key={productId}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuantityChange(productId, Math.max(0, (shoppingListItem?.quantity || 0) - (product.unit === 'piece' ? 1 : 0.1)));
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      -
                    </button>
                    
                    <span className="mx-2">{formatQuantity(shoppingListItem?.quantity || 0)}</span>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuantityChange(productId, (shoppingListItem?.quantity || 0) + (product.unit === 'piece' ? 1 : 0.1));
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      +
                    </button>
                    
                    <span className="text-sm text-gray-500">
                      {product.unit}
                    </span>
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
