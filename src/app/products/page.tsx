"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Categories from "@/components/Categories";
import ProductList from "@/features/products/ProductList";
import type { Product } from "@/types/productTypes";
import { useState } from "react";
import { useProducts } from "@/features/products/useProducts";
import { useFavourites, useToggleFavourite } from "@/features/favourites/useFavourites";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const [error] = useState<string | null>(null);

  const { data: products = [], isLoading: isProductsLoading } = useProducts({ category, search });
  const { data: favourites = [] } = useFavourites();
  const { items: shoppingList = [], addItem, updateItem } = useShoppingList();
  const toggleFavouriteMutation = useToggleFavourite();

  const handleAddOrUpdate = async (product: Product, quantity: number) => {
    try {
      const productId = typeof product._id === 'object' ? product._id.$oid : product._id;
      const existingItem = shoppingList.find(item => item.product_id === productId);

      if (existingItem) {
        await updateItem({
          id: existingItem._id,
          data: {
            quantity: existingItem.quantity + quantity,
            unit: product.unit || 'piece'
          }
        });
      } else {
        await addItem({
          productId,
          quantity,
          unit: product.unit || 'piece'
        });
      }
    } catch (error) {
      console.error('Error in handleAddOrUpdate:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Producten</h1>
        </div>

        <Categories className="mb-8" />

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <ProductList
            products={products}
            shoppingList={shoppingList}
            favourites={favourites}
            onAddOrUpdate={handleAddOrUpdate}
            onToggleFavourite={(productId) => toggleFavouriteMutation.mutate({ product_id: productId })}
            onQuantityChange={(itemId, quantity) => {
              updateItem({
                id: itemId,
                data: { quantity }
              });
            }}
            isLoading={isProductsLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
