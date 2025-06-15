"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Product } from "@/types/productTypes";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
import { useFavourites } from "@/features/favourites/useFavourites";
import { getStringId, formatQuantity } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState<number>(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  // const { data: favourites = [] } = useFavourites();
  // const toggleFavourite = useToggleFavourite();
  const { items: shoppingList = [], addItem, updateItem, deleteItem } = useShoppingList();

  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery<Product>({
    queryKey: ["product", getStringId(productId)],
    queryFn: async () => {
      console.log('Fetching product with ID:', getStringId(productId));
      try {
        const response = await api.get(`/api/products/${getStringId(productId)}`);
        console.log('Product response:', response.data);
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
        console.error('Error fetching product:', {
          id: getStringId(productId),
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method
        });
        throw error;
      }
    }
  },
});


  const existingItem = product ? shoppingList.find(
    (item) => {
      const itemProductId = getStringId(item.product_id);
      const currentProductId = getStringId(product._id);
      console.log('Checking item match:', {
        itemProductId,
        currentProductId,
        matches: itemProductId === currentProductId
      });
      return itemProductId === currentProductId;
    }
  ) : undefined;

  // Add debug logging for quantity and existingItem
  useEffect(() => {
    console.log('Quantity debug:', {
      rawQuantity: quantity,
      formattedQuantity: formatQuantity(quantity),
      isZero: quantity === 0,
      isInputFocused,
      existingItem
    });
  }, [quantity, isInputFocused, existingItem]);

  // Initialize quantity from existing item
  useEffect(() => {
    if (existingItem) {
      // Parse the quantity from the database, ensuring it's a valid number
      const itemQuantity = parseFloat(existingItem.quantity.toString());
      const validQuantity = !isNaN(itemQuantity) ? itemQuantity : 0;
      
      console.log('Initializing quantity from existing item:', {
        existingItemQuantity: existingItem.quantity,
        parsedQuantity: validQuantity
      });
      
      setQuantity(validQuantity);
    } else {
      setQuantity(0);
    }
  }, [existingItem]);

  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/api/categories');
      console.log('Categories API response:', response.data);
      return response.data;
    },
    enabled: !!product?.categories?.length
  });

  // const getCategoryNames = () => {
  //   if (!product?.categories?.length) return 'None';
  //   return product.categories.map(cat => cat.name).join('\n');
  // };

  if (isLoadingProduct) return <div className="p-4 text-center">Loading...</div>;
  if (productError) return <div className="p-4 text-center text-red-500">Error loading product: {productError.message}</div>;
  if (!product) return <div className="p-4 text-center">Product not found</div>;

  // const isFavourite = favourites.some((fav) => getStringId(fav.product._id) === productId);

  // const getLowestPrice = (product: Product): string => {
  //   if (!product.price_per_store || Object.keys(product.price_per_store).length === 0) return "N/A";
  //   const prices = Object.values(product.price_per_store).map(store => parseFloat(store.price_per_item));
  //   const lowestPrice = Math.min(...prices);
  //   return `€${lowestPrice.toFixed(2)}`;
  // };

  // const handleAddToShoppingList = async () => {
  //   if (!product) return;

  //   const actualProductId = getStringId(product._id);
  //   // Get the quantity from the database
  //   const dbQuantity = typeof product.quantity === 'string' 
  //     ? parseFloat(product.quantity)
  //     : (typeof product.quantity === 'number' ? product.quantity : 0);
    
  //   console.log('Adding to shopping list:', {
  //     productId: actualProductId,
  //     dbQuantity,
  //     rawQuantity: product.quantity,
  //     unit: product.unit
  //   });

  //   try {
  //     if (existingItem) {
  //       // Update existing item
  //       console.log('Updating existing item:', existingItem);
  //       await updateItem({
  //         id: getStringId(existingItem._id),
  //         data: {
  //           quantity: dbQuantity || (product.unit === 'piece' ? 1 : 0.1),
  //           unit: product.unit || 'piece'
  //         }
  //       });
  //     } else {
  //       // Add new item
  //       console.log('Adding new item with:', {
  //         productId: actualProductId,
  //         quantity: dbQuantity || (product.unit === 'piece' ? 1 : 0.1),
  //         unit: product.unit || 'piece'
  //       });
  //       await addItem({
  //         productId: actualProductId,
  //         quantity: dbQuantity || (product.unit === 'piece' ? 1 : 0.1),
  //         unit: product.unit || 'piece'
  //       });
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof AxiosError) {
  //     console.error('Error in handleAddToShoppingList:', error);
  //     toast.error(error.response?.data?.message || 'Failed to update shopping list');
  //   }
  // };

  const handleQuantityChange = (value: number) => {
    if (isNaN(value)) {
      setQuantity(0);
      return;
    }
    const newValue = Math.max(0, value);
    setQuantity(newValue);

    // If item exists in shopping list
    if (existingItem) {
      // If quantity is zero, remove the item
      if (newValue === 0) {
        try {
          console.log('Removing item from shopping list:', {
            itemId: getStringId(existingItem._id)
          });
          deleteItem(getStringId(existingItem._id));
        } catch (error: unknown) {
          console.error('Error removing item:', error);
          toast.error('Failed to remove item from shopping list');
        }
      } else {
        // Update quantity if it's not 0
        try {
          console.log('Updating existing item:', {
            itemId: getStringId(existingItem._id),
            newValue,
            existingItem
          });
          updateItem({
            id: getStringId(existingItem._id),
            data: {
              quantity: newValue,
              unit: product?.unit || 'piece'
            }
          });
        } catch (error: unknown) {
          console.error('Error updating quantity:', error);
          toast.error('Failed to update quantity');
        }
      }
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    if (isNaN(quantity)) {
      setQuantity(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    handleQuantityChange(value);
  };

  const handleIncrement = () => {
    const increment = product?.unit === 'piece' ? 1 : 0.1;
    handleQuantityChange(quantity + increment);
  };

  const handleDecrement = () => {
    const decrement = product?.unit === 'piece' ? 1 : 0.1;
    handleQuantityChange(Math.max(0, quantity - decrement));
  };

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
                    {product.categories?.map((cat) => (
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

              {/* Quantity Controls */}
              <div className="flex items-center space-x-4">
                {existingItem && existingItem.quantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDecrement}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    
                    <input
                      type="number"
                      value={formatQuantity(quantity)}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-20 text-center px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                      step={product.unit === 'piece' ? 1 : 0.1}
                    />
                    
                    <button
                      onClick={handleIncrement}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    
                    <span className="text-sm text-gray-500">
                      {product.unit}
                    </span>
                  </div>
                ) : (
                  <button
                    // onClick={handleAddToShoppingList}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to Shopping List</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
