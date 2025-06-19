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
import { PageLoader } from "@/components/ui/Loader";
import { useQueryClient } from '@tanstack/react-query';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const [error] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { 
    data: products = [], 
    isLoading: isProductsLoading,
    hasMore, 
    isFetchingNextPage, 
    fetchNextPage 
  } = useProducts({ category, search });

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

  const handleRefresh = async () => {
    // Invalidate and refetch products and favourites
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['products', { category, search }] }),
      queryClient.invalidateQueries({ queryKey: ['favourites'] }),
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] })
    ]);
  };

  if (isProductsLoading && (!products || products.length === 0)) {
    return <PageLoader text="Loading products..." />;
  }

  return (
    <main 
      className="min-h-screen bg-gray-50 mb-12"
      role="main"
      aria-labelledby="products-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 
            id="products-title"
            className="text-3xl font-bold text-gray-900"
          >
            Producten
          </h1>
        </div>

        <section 
          className="mb-8"
          aria-labelledby="categories-title"
        >
          <h2 
            id="categories-title"
            className="sr-only"
          >
            Product Categories
          </h2>
          <Categories className="mb-8" />
        </section>

        {error ? (
          <div 
            className="text-red-500 text-center py-8"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        ) : (
          <section 
            aria-labelledby="products-list-title"
          >
            <h2 
              id="products-list-title"
              className="sr-only"
            >
              Products List
            </h2>
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
              onLoadMore={fetchNextPage}
              hasMore={hasMore}
              isFetchingNextPage={isFetchingNextPage}
              onRefresh={handleRefresh}
            />
          </section>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader text="Loading..." />}>
      <ProductsContent />
    </Suspense>
  );
}
