import ShoppingList from "@/features/shoppingList/ShoppingList";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-6">Boodschappenlijst</h1>
        <ShoppingList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
