"use client";

import { useProducts } from "@/features/products/useProducts";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
import {
  useFavourites,
  useToggleFavourite,
} from "@/features/favourites/useFavourites";
import Categories from "@/components/Categories";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProductList from "@/features/products/ProductList";
import type { Product } from "@/types/productTypes";
import { useState } from "react";

export default function ProductsPage() {
  // const { user } = useAuth();
  const searchParams = useSearchParams();
  // const category = searchParams.get("category") ?? undefined;
  // const search = searchParams.get("search") ?? undefined;
  const [error] = useState<string | null>(null);

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts();
  const {
    items: shoppingList = [],
    isLoading,
    error: shoppingListError,
    addItem,
    updateItem,
  } = useShoppingList();
  const {
    data: favourites = [],
    isLoading,
    error: favError,
  } = useFavourites();
  const toggleFavouriteMutation = useToggleFavourite();

  const handleAddOrUpdate = async (product: Product, quantity: number) => {
    try {
      // Get the product ID, handling both string and object formats
      let productId = product._id;
      if (typeof productId === 'object' && productId !== null) {
        productId = productId.$oid;
      }

      // Check if item exists in shopping list
      const existingItem = shoppingList.find(item => item.product_id === productId);

      if (existingItem) {
        // Update existing item
        await updateItem({
          id: existingItem._id,
          data: {
            quantity: existingItem.quantity + quantity,
            unit: product.unit || 'piece'
          }
        });
      } else {
        // Add new item
        await addItem({
          productId: productId,
          quantity: quantity,
          unit: product.unit || 'piece'
        });
      }
    } catch (error) {
      console.error('Error in handleAddOrUpdate:', error);
    }
  };

  // const handleQuantityChange = (itemId: string, newQuantity: string) => {
  //   const numQuantity = parseFloat(newQuantity);
  //   if (!isNaN(numQuantity) && numQuantity > 0) {
  //     updateItem({
  //       id: itemId,
  //       data: {
  //         quantity: numQuantity
  //       }
  //     });
  //   }
  // };

  // const errorMessage = error || productsError?.message || shoppingListError?.message || favError?.message;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Producten</h1>
        </div>

        <Categories className="mb-8" />

        {isProductsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <ProductList
            products={products}
            shoppingList={shoppingList}
            favourites={favourites}
            onAddOrUpdate={handleAddOrUpdate}
            onToggleFavourite={(productId) =>
              toggleFavouriteMutation.mutate({ product_id: productId })
            }
            onQuantityChange={(itemId, quantity) => {
              updateItem({
                id: itemId,
                data: {
                  quantity: quantity
                }
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
