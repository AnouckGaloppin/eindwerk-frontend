import ShoppingList from "@/features/shoppingList/ShoppingList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white text-gray-900 transition-colors">
        <Header />
        <div className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Boodschappenlijst</h1>
            </div>
            <ShoppingList />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
