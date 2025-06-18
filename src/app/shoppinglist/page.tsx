"use client";

import ShoppingList from "@/features/shoppingList/ShoppingList";
import PriceComparison from "@/features/comparePrices/comparePrices";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
// import { redirect } from "next/dist/server/api-utils";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const queryClient = new QueryClient();

export default function ShoppingListPage() {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);
  const { items = [] } = useShoppingList();

  // Ensure items is an array and extract product_ids safely
  const productIds = items && Array.isArray(items) 
    ? items.map((item) => item.product_id).filter(Boolean)
    : [];

  return (
    <QueryClientProvider client={queryClient}>
      <main 
        className="min-h-screen flex justify-center bg-gray-100 pt-16 pb-24"
        role="main"
        aria-labelledby="shopping-list-title"
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h1 
            id="shopping-list-title"
            className="text-2xl font-bold mb-6 text-gray-900"
          >
            Shopping List
          </h1>
          <div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
            role="region"
            aria-label="Shopping list and price comparison"
          >
            <section 
              className="lg:col-span-3 bg-white rounded-lg shadow-md p-6"
              aria-labelledby="shopping-list-section-title"
            >
              <h2 
                id="shopping-list-section-title"
                className="sr-only"
              >
                Your Shopping List
              </h2>
              <ShoppingList />
            </section>
            <section 
              className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
              aria-labelledby="price-comparison-title"
            >
              <h2 
                id="price-comparison-title"
                className="text-xl font-semibold mb-4 text-gray-900"
              >
                Price Comparison
              </h2>
              <PriceComparison productIds={productIds} />
            </section>
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}
