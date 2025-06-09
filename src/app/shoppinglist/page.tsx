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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping List</h1>
        <ShoppingList />
        <PriceComparison productIds={items.map((item) => item.product_id)} />
      </div>
    </QueryClientProvider>
  );
}
