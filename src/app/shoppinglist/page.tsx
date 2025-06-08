"use client";

import ShoppingList from '@/features/shoppingList/ShoppingList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function ShoppingListPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping List</h1>
        <ShoppingList />
      </div>
    </QueryClientProvider>
  );
}
