"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Product, StorePrice } from "@/types/productTypes";
import type { ShoppingListItem } from "@/types/shoppingTypes";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
import { useFavourites, useToggleFavourite } from "@/features/favourites/useFavourites";
import { getStringId } from "@/lib/utils";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { Category } from '@/types/productTypes';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { data: favourites = [] } = useFavourites();
  const toggleFavourite = useToggleFavourite();
  const { data: shoppingList = [], isLoading: isLoadingShoppingList } = useQuery<ShoppingListItem[]>({
    queryKey: ["shoppingList"],
    queryFn: async () => {
      const response = await api.get("/api/shopping-list");
      return response.data.items;
    },
  });

  const { addItem, updateItem } = useShoppingList();

  const existingItem = shoppingList.find(
    (item) => getStringId(item.product_id) === productId
  );

  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      console.log('Fetching product with ID:', productId);
      try {
        const response = await api.get(`/api/products/${productId}`);
        console.log('Product response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Error fetching product:', error.response?.data || error.message);
        throw error;
      }
    },
  });

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/api/categories');
      console.log('Categories API response:', response.data);
      return response.data;
    },
    enabled: !!product?.categories?.length
  });

  const getCategoryNames = () => {
    if (!product?.categories?.length) return 'None';
    return product.categories.map(cat => cat.name).join('\n');
  };

  if (isLoadingProduct) return <div className="p-4 text-center">Loading...</div>;
  if (productError) return <div className="p-4 text-center text-red-500">Error loading product: {productError.message}</div>;
  if (!product) return <div className="p-4 text-center">Product not found</div>;

  const isFavourite = favourites.some((fav) => getStringId(fav.product._id) === productId);

  const getLowestPrice = (product: Product): string => {
    if (!product.price_per_store || Object.keys(product.price_per_store).length === 0) return "N/A";
    const prices = Object.values(product.price_per_store).map(store => parseFloat(store.price_per_item));
    const lowestPrice = Math.min(...prices);
    return `€${lowestPrice.toFixed(2)}`;
  };

  const handleAddToShoppingList = async () => {
    if (!product) return;

    console.log('Adding to shopping list:', {
      productId,
      quantity,
      unit: product.unit
    });

    try {
      if (existingItem) {
        // Update existing item
        console.log('Updating existing item:', existingItem);
        await updateItem({
          id: getStringId(existingItem._id),
          data: {
            quantity: Number(existingItem.quantity) + Number(quantity),
            unit: product.unit || 'piece'
          }
        });
      } else {
        // Add new item
        console.log('Adding new item with:', {
          productId,
          quantity: Number(quantity),
          unit: product.unit || 'piece'
        });
        await addItem({
          productId,
          quantity: Number(quantity),
          unit: product.unit || 'piece'
        });
      }
    } catch (error: any) {
      console.error('Error in handleAddToShoppingList:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (quantity === 0) {
      setQuantity(NaN);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    if (isNaN(quantity)) {
      setQuantity(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? NaN : parseFloat(e.target.value);
    handleQuantityChange(value);
  };

  const handleIncrement = () => {
    const increment = product?.unit === 'piece' ? 1 : 0.1;
    handleQuantityChange(quantity + increment);
  };

  const handleDecrement = () => {
    const decrement = product?.unit === 'piece' ? 1 : 0.1;
    handleQuantityChange(quantity - decrement);
  };

  const isLoading = isLoadingProduct || isCategoriesLoading;
  const error = productError;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="space-y-4">
                <p><span className="font-medium">Brand:</span> {product.brand || 'Unknown'}</p>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Categories:</span>
                  <div className="flex gap-1">
                    {product.categories?.map((cat, index) => (
                      <span key={cat.id} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm whitespace-nowrap">
                        {cat.name}
                      </span>
                    )) || 'None'}
                  </div>
                </div>
                <p><span className="font-medium">Unit:</span> {product.unit || 'piece'}</p>
                <p><span className="font-medium">Price:</span> {Object.entries(product.price_per_store)[0]?.[1].price_per_item || 'N/A'}</p>
                {product.nutriscore && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Nutri-Score:</span>
                    <span className={`inline-block px-3 py-1 rounded-md text-sm font-bold text-white ${
                      product.nutriscore === 'A' ? 'bg-green-800' :
                      product.nutriscore === 'B' ? 'bg-green-500' :
                      product.nutriscore === 'C' ? 'bg-yellow-500' :
                      product.nutriscore === 'D' ? 'bg-orange-500' :
                      product.nutriscore === 'E' ? 'bg-red-500' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {product.nutriscore}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Input */}
              <div className="mt-8">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(Math.max(0, quantity - (product.unit === 'piece' ? 1 : 0.1)))}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={isInputFocused && isNaN(quantity) ? '' : quantity}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    step={product.unit === 'piece' ? 1 : 0.1}
                    min="0"
                    className="w-16 text-center px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + (product.unit === 'piece' ? 1 : 0.1))}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">{product.unit}</span>
                </div>
              </div>

              {/* Add to Shopping List Button */}
              <button
                onClick={handleAddToShoppingList}
                className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add to Shopping List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 