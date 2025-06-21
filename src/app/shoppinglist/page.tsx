"use client";

import ShoppingList from "@/features/shoppingList/ShoppingList";
import PriceComparison from "@/features/comparePrices/comparePrices";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
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
        aria-labelledby="winkelmandje-titel"
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h1 
            id="winkelmandje-titel"
            className="text-2xl font-bold mb-6 text-gray-900"
          >
            Winkelmandje
          </h1>
          <div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
            role="region"
            aria-label="Winkelmandje en prijsvergelijking"
          >
            <section 
              className="lg:col-span-3 bg-white rounded-lg shadow-md p-6"
              aria-labelledby="winkelmandje-sectie-titel"
            >
              <h2 
                id="winkelmandje-sectie-titel"
                className="sr-only"
              >
                Uw winkelmandje
              </h2>
              <ShoppingList />
            </section>
            <section 
              className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
              aria-labelledby="prijsvergelijking-titel"
            >
              <h2 
                id="prijsvergelijking-titel"
                className="text-xl font-semibold mb-4 text-gray-900"
              >
                Prijsvergelijking
              </h2>
              <PriceComparison productIds={productIds} />
            </section>
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}
