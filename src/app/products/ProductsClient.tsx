"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Categories from "@/components/Categories";
import ProductList from "@/features/products/ProductList";
import Pagination from "@/components/Pagination";
import type { Product, Category } from "@/types/productTypes";
import { useState } from "react";
import { useProductsPagination } from "@/features/products/useProductsPagination";
import { useFavourites, useToggleFavourite } from "@/features/favourites/useFavourites";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
import { PageLoader } from "@/components/ui/Loader";
import { useQueryClient } from '@tanstack/react-query';

interface ProductsContentProps {
  initialCategories: Category[];
  initialProducts: any; // Using 'any' for now, will refine if necessary
}

function ProductsContent({ initialCategories, initialProducts }: ProductsContentProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const [error] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { 
    products, 
    pagination,
    isLoading: isProductsLoading,
    error: productsError
  } = useProductsPagination({ 
    category, 
    search, 
    page, 
    perPage: 12,
    initialData: page === 1 ? initialProducts : undefined // Only use initialData for page 1
  });

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
            unit: product.unit || 'stuk'
          }
        });
      } else {
        await addItem({
          productId,
          quantity,
          unit: product.unit || 'stuk'
        });
      }
    } catch (error) {
      console.error('Fout bij handleAddOrUpdate:', error);
    }
  };

  const handleRefresh = async () => {
    // Invalidate and refetch products and favourites
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['products', category, search, page, 12] }),
      queryClient.invalidateQueries({ queryKey: ['favourites'] }),
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] })
    ]);
  };

  if (isProductsLoading && (!products || products.length === 0)) {
    return <PageLoader text="Producten laden..." />;
  }

  return (
    <main 
      className="min-h-screen bg-gray-50 mb-12"
      role="main"
      aria-labelledby="producten-titel"
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
          aria-labelledby="categorieën-titel"
        >
          <h2 
            id="categories-title"
            className="sr-only"
          >
            Productcategorieën
          </h2>
          <Categories className="mb-8" initialCategories={initialCategories} />
        </section>

        {error || productsError ? (
          <div 
            className="text-red-500 text-center py-8"
            role="alert"
            aria-live="polite"
          >
            {error || (productsError as Error)?.message || "An error occurred"}
          </div>
        ) : (
          <>
            <section 
              aria-labelledby="producten-lijst-titel"
            >
              <h2 
                id="products-list-title"
                className="sr-only"
              >
                Productenlijst
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
                onRefresh={handleRefresh}
              />
            </section>

            {pagination && pagination.total > 0 && (
              <section 
                aria-label="Paginatie"
                className="mt-8"
              >
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                  totalItems={pagination.total}
                  perPage={pagination.per_page}
                />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

interface ProductsClientProps {
  categories: Category[];
  initialProducts: any;
}

export default function ProductsClient({ categories, initialProducts }: ProductsClientProps) {
  return (
    <Suspense fallback={<PageLoader text="Laden..." />}>
      <ProductsContent initialCategories={categories} initialProducts={initialProducts} />
    </Suspense>
  );
} 