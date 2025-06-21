"use client";

import { useState, useEffect, useMemo } from "react";
import { compareShoppingList } from "./compare"; // Importeer vanuit de feature-map
import type { PriceComparison, StorePrice } from "@/types/productTypes";
import { useShoppingList } from "../shoppingList/useShoppingList";
import Loader from "@/components/ui/Loader";
import { formatPrice } from "@/lib/utils";

interface ShoppingListItem {
  _id: string;
  product_id: string;
  quantity: number;
}

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  return typeof id === 'object' ? id.$oid : id;
};

export default function PriceComparison({
  productIds,
}: {
  productIds: string[];
}) {
  const [comparisonData, setComparisonData] = useState<PriceComparison[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { items: shoppingListItems = [] } = useShoppingList();
  const [totalComparisonResult, setTotalComparisonResult] = useState<null | { cheapestStore: string, totals: Record<string, number>, missingCounts: Record<string, number>, missingProducts: Record<string, string[]> }>(null);
  const [comparisonMode, setComparisonMode] = useState<'perProduct' | 'total' | null>(null);

  // Create a stable productIds string for useEffect dependency
  const productIdsString = useMemo(() => productIds.join(','), [productIds]);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    setShowResults(true);
    setComparisonMode('perProduct');
    const data = await compareShoppingList(productIds);
    if (data && data.results) {
      setComparisonData(data.results);
    } else {
      setError("Kon prijsvergelijking niet ophalen");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (productIds.length === 0) {
      setShowResults(false);
    }
  }, [productIds]);

  useEffect(() => {
    // Reset comparison data and results when productIds change
    setComparisonData([]);
    setTotalComparisonResult(null);
    setShowResults(false);
    setComparisonMode(null);
  }, [productIdsString]); // Use the stable productIds string

  const calculateTotalPrice = (price: string, productId: string) => {
    const item = shoppingListItems.find((item: ShoppingListItem) => getStringId(item.product_id) === productId);
    if (!item) return price;
    const quantity = item.quantity;
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) return price;
    const totalPrice = priceNum * quantity;
    return totalPrice.toFixed(2);
  };

  // New: Compare total shopping list
  const handleCompareTotal = async () => {
    setComparisonMode('total');
    if (!comparisonData || comparisonData.length === 0) {
      setLoading(true);
      setError(null);
      setShowResults(false);
      const data = await compareShoppingList(productIds);
      setLoading(false);
      if (data && data.results) {
        setComparisonData(data.results);
        doTotalComparison(data.results);
      } else {
        setError("Kon prijsvergelijking niet ophalen");
      }
      return;
    }
    doTotalComparison(comparisonData);
  };

  // Helper to do the total comparison
  const doTotalComparison = (data: PriceComparison[]) => {
    const totals: Record<string, number> = {};
    const missingCounts: Record<string, number> = {};
    const missingProducts: Record<string, string[]> = {};
    
    // Ensure shoppingListItems is an array
    const safeShoppingListItems = Array.isArray(shoppingListItems) ? shoppingListItems : [];
    
    // Get all unique product IDs and names in the shopping list
    const allProductIds = safeShoppingListItems.map((i: ShoppingListItem) => getStringId(i.product_id));
    const allProductNames: Record<string, string> = {};
    safeShoppingListItems.forEach((i: ShoppingListItem) => {
      // Type guard for product
      let name: string | undefined = undefined;
      if ('product' in i && i.product && typeof i.product === 'object' && 'name' in i.product) {
        name = (i.product as any).name;
      }
      allProductNames[getStringId(i.product_id)] = name || i.product_id;
    });
    // Also add names from PriceComparison if not present
    data.forEach((item) => {
      if (!allProductNames[getStringId(item.product_id)]) {
        allProductNames[getStringId(item.product_id)] = item.product_name || getStringId(item.product_id);
      }
    });
    // For each shop, track which products are present
    const productsPerShop: Record<string, Set<string>> = {};
    data.forEach((item) => {
      if (Array.isArray(item.all_prices)) {
        item.all_prices.forEach((price: any) => {
          const store = price.store;
          const shoppingItem = safeShoppingListItems.find((i: ShoppingListItem) => getStringId(i.product_id) === item.product_id);
          const quantity = shoppingItem ? shoppingItem.quantity : 1;
          const priceNum = parseFloat(price.price_per_item);
          if (!isNaN(priceNum)) {
            if (!totals[store]) totals[store] = 0;
            totals[store] += priceNum * quantity;
            if (!productsPerShop[store]) productsPerShop[store] = new Set();
            productsPerShop[store].add(getStringId(item.product_id));
          }
        });
      } else {
        Object.entries(item.all_prices).forEach(([store, price]: [string, any]) => {
          const shoppingItem = safeShoppingListItems.find((i: ShoppingListItem) => getStringId(i.product_id) === item.product_id);
          const quantity = shoppingItem ? shoppingItem.quantity : 1;
          const priceNum = parseFloat(price.price_per_item);
          if (!isNaN(priceNum)) {
            if (!totals[store]) totals[store] = 0;
            totals[store] += priceNum * quantity;
            if (!productsPerShop[store]) productsPerShop[store] = new Set();
            productsPerShop[store].add(getStringId(item.product_id));
          }
        });
      }
    });
    // Calculate missing counts and missing product names
    Object.keys(totals).forEach((store) => {
      const present = productsPerShop[store] || new Set();
      const missing = allProductIds.filter(pid => !present.has(pid));
      missingCounts[store] = missing.length;
      missingProducts[store] = missing.map(pid => allProductNames[pid] || pid);
    });
    let cheapestStore = '';
    let minTotal = Infinity;
    Object.entries(totals).forEach(([store, total]) => {
      if (total < minTotal) {
        minTotal = total;
        cheapestStore = store;
      }
    });
    setTotalComparisonResult({ cheapestStore, totals, missingCounts, missingProducts });
  };

  return (
    <div className="price-comparison">
      <button
        onClick={fetchComparison}
        disabled={loading || productIds.length === 0}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors mb-4"
      >
        {loading ? "Laden..." : "Prijsvergelijking"}
      </button>
      <button
        onClick={handleCompareTotal}
        disabled={loading || productIds.length === 0}
        className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition-colors mb-4"
      >
        Vergelijk Totale Boodschappenlijst
      </button>
      {/* Always show loading spinner if loading */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <Loader size="md" color="teal" />
        </div>
      )}
      {/* Always show error if error */}
      {error && (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      )}
      {/* Show total comparison result if available and mode is 'total' */}
      {comparisonMode === 'total' && totalComparisonResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-left">
          <div className="text-lg font-semibold text-green-700 mb-2">
            Totaalprijs per winkel: 
          </div>
          <div className="text-gray-700">
            {Object.entries(totalComparisonResult.totals).map(([store, total]) => (
              <div key={store} className="mb-1 block relative">
                {store}: <span className="font-semibold">€{total.toFixed(2)}</span>
                {totalComparisonResult.missingCounts && totalComparisonResult.missingCounts[store] > 0 && (
                  <span className="text-xs text-red-500 ml-2 cursor-pointer group">
                    ({totalComparisonResult.missingCounts[store]} product{totalComparisonResult.missingCounts[store] > 1 ? 'en' : ''} niet beschikbaar)
                    <span className="absolute left-1/2 z-10 -translate-x-1/2 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg p-2 text-xs text-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 whitespace-normal">
                      <span className="font-semibold block mb-1">Niet beschikbaar:</span>
                      {totalComparisonResult.missingProducts[store].map((name, idx) => (
                        <span key={name + idx} className="block">• {name}</span>
                      ))}
                    </span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Only show per-product results if showResults is true and mode is 'perProduct' */}
      {comparisonMode === 'perProduct' && showResults && (
        <div className="space-y-4">
          {!loading && !error && comparisonData.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              Geen prijzen beschikbaar.
            </div>
          )}
          {!loading && !error && comparisonData.length > 0 && (
            <div className="space-y-4">
              {comparisonData.map((item: PriceComparison) => (
                <div key={item.product_id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-2">{item.product_name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="text-gray-600">Goedkoopste:</span>
                      <div className="text-right">
                        <span className="font-medium text-green-600">{item.cheapest_store}</span>
                        <span className="ml-2">€{calculateTotalPrice(item.cheapest_price_per_item, item.product_id)}</span>
                      </div>
                    </div>
                    {Array.isArray(item.all_prices) ? (
                      <div className="space-y-1">
                        {item.all_prices.map((price: any, idx: number) => {
                          const shoppingItem = shoppingListItems.find(i => getStringId(i.product_id) === item.product_id);
                          const unit = shoppingItem?.unit || 'item';
                          return (
                          <div key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="text-gray-600">{price.store}</span>
                            <div className="text-right">
                              <span className="font-medium">€{calculateTotalPrice(price.price_per_item, item.product_id)}</span>
                              <span className="text-gray-500 text-sm">
                                (€{formatPrice(parseFloat(price.price_per_item))} / {unit})
                              </span>
                            </div>
                          </div>
                        )})}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {Object.entries(item.all_prices).map(([store, price]: [string, any], idx: number) => {
                          const shoppingItem = shoppingListItems.find(i => getStringId(i.product_id) === item.product_id);
                          const unit = shoppingItem?.unit || 'item';
                          return (
                          <div key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="text-gray-600">{store}</span>
                            <div className="text-right">
                              <span className="font-medium">€{calculateTotalPrice(price.price_per_item, item.product_id)}</span>
                              <span className="text-gray-500 text-sm">
                                (€{formatPrice(parseFloat(price.price_per_item))} / {unit})
                              </span>
                            </div>
                          </div>
                        )})}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
