"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Product } from "@/types/productTypes";
import { Heart } from "lucide-react";
import { useFavourites, useToggleFavourite } from "@/features/favourites/useFavourites";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
import { useState } from "react";
import { ShoppingListItem } from "@/types/shoppingTypes";

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  return typeof id === 'object' ? id.$oid : id;
};

export default function ProductDetailPage() {
  const { id: slug } = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const { data: favourites = [] } = useFavourites();
  const toggleFavourite = useToggleFavourite();
  const { items, addItem, updateItem } = useShoppingList();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        // Convert slug back to product name
        const productName = (slug as string).replace(/-/g, ' ');
        console.log('Searching for product:', productName);
        
        const response = await api.get(`/api/products/search?q=${encodeURIComponent(productName)}&limit=1`);
        console.log('API Response:', response.data);
        console.log('Product data structure:', JSON.stringify(response.data.products[0], null, 2));
        
        if (!response.data.products || response.data.products.length === 0) {
          console.log('No products found in response');
          throw new Error('Product not found');
        }

        const foundProduct = response.data.products[0];
        console.log('Found product:', foundProduct);
        return foundProduct;
      } catch (err) {
        console.error('Error fetching product:', err);
        throw err;
      }
    },
  });

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading product: {error.message}</div>;
  if (!product) return <div className="p-4 text-center">Product not found</div>;

  const productId = getStringId(product._id);
  const isFavourite = favourites.some((fav) => getStringId(fav.product._id) === productId);
  const existingItem = items.find((item: ShoppingListItem) => getStringId(item.product_id) === productId);

  const getLowestPrice = (product: Product): string => {
    if (!product.price_per_store || typeof product.price_per_store !== 'object') return "0.00";
    
    // Convert price_per_store object to array of prices
    const prices = Object.values(product.price_per_store).map(store => 
      typeof store === 'object' && 'price_per_item' in store 
        ? parseFloat(store.price_per_item) 
        : 0
    ).filter(price => !isNaN(price));
    
    return prices.length ? Math.min(...prices).toFixed(2) : "0.00";
  };

  const handleAddToShoppingList = async () => {
    if (!product) return;

    console.log('Adding to shopping list:', {
      product,
      quantity,
      unit: product.unit
    });

    if (existingItem) {
      // Update existing item
      console.log('Updating existing item:', existingItem);
      await updateItem({
        id: getStringId(existingItem._id),
        data: {
          quantity: Number(existingItem.quantity) + Number(quantity),
          unit: product.unit
        }
      });
    } else {
      // Add new item
      console.log('Adding new item with:', {
        productId,
        quantity: Number(quantity),
        unit: product.unit
      });
      await addItem({
        productId,
        quantity: Number(quantity),
        unit: product.unit
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              {product.img ? (
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <button
                  onClick={() => toggleFavourite.mutate({ product_id: productId })}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavourite ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {product.brand && (
                <p className="text-lg text-gray-600 mb-4">Brand: {product.brand}</p>
              )}

              <div className="mb-4">
                <p className="text-2xl font-bold text-indigo-600">
                  €{getLowestPrice(product)}
                </p>
                <p className="text-sm text-gray-500">
                  {product.quantity} {product.unit}
                </p>
              </div>

              {/* Price Comparison */}
              {product.price_per_store && Object.keys(product.price_per_store).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Prices at different stores:</h2>
                  <div className="space-y-2">
                    {Object.entries(product.price_per_store).map(([store, price]) => (
                      <div key={store} className="flex justify-between items-center">
                        <span className="text-gray-600">{store}</span>
                        <span className="font-medium">€{parseFloat(price.price_per_item).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Shopping List */}
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-4">
                  <label htmlFor="quantity" className="text-gray-600">
                    Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={existingItem ? existingItem.quantity : quantity}
                    onChange={(e) => {
                      const newQuantity = parseFloat(e.target.value);
                      if (isNaN(newQuantity) || newQuantity < 0.01) return;
                      
                      if (existingItem) {
                        updateItem({
                          id: getStringId(existingItem._id),
                          data: {
                            quantity: newQuantity,
                            unit: product.unit || 'piece'
                          }
                        });
                      } else {
                        setQuantity(newQuantity);
                      }
                    }}
                    className="w-20 border border-gray-300 px-2 py-1 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-gray-600">{product.unit}</span>
                </div>

                <button
                  onClick={handleAddToShoppingList}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                >
                  {existingItem ? 'Update Shopping List' : 'Add to Shopping List'}
                </button>
              </div>

              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Categories:</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        key={category}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 