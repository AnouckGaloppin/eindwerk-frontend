"use client";

import ShoppingList from "@/features/shoppingList/ShoppingList";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function ShoppingListPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-6">Boodschappenlijst</h1>
        <ShoppingList />
        <div className="flex justify-evenly mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Vergelijk totaal
          </button>
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
            Vergelijk per product
          </button>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default ShoppingListPage;
