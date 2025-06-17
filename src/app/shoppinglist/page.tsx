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
  const { items } = useShoppingList();

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen flex justify-center bg-gray-100 pt-16 pb-24">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Shopping List</h1>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Shopping List</h2>
              <ShoppingList />
            </div>
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Price Comparison</h2>
              <PriceComparison productIds={items.map((item) => item.product_id)} />
            </div>
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}
