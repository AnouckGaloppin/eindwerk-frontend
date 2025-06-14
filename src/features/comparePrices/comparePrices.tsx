"use client";

import { useState, useEffect } from "react";
import { compareShoppingList } from "./compare"; // Importeer vanuit de feature-map
import { p } from "framer-motion/client";

export default function PriceComparison({
  productIds,
}: {
  productIds: string[];
}) {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    setShowResults(true);
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

  //   if (loading) return <p>Laden...</p>;
  //   if (error) return <p>{error}</p>;

  return (
    <div className="price-comparison">
      <button
        onClick={fetchComparison}
        disabled={loading || productIds.length === 0}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors mb-4"
      >
        {loading ? "Loading..." : "Compare Prices"}
      </button>
      {showResults && (
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          {error && (
            <div className="text-red-500 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          )}
          {!loading && !error && comparisonData.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              No prices available.
            </div>
          )}
          {!loading && !error && comparisonData.length > 0 && (
            <div className="space-y-4">
              {comparisonData.map((item: any) => (
                <div key={item.product_id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-2">{item.product_name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="text-gray-600">Cheapest:</span>
                      <div className="text-right">
                        <span className="font-medium text-green-600">{item.cheapest_store}</span>
                        <span className="ml-2">€{item.cheapest_price_per_item}</span>
                      </div>
                    </div>
                    {item.all_prices.length > 1 && (
                      <div className="space-y-1">
                        {item.all_prices.map((price: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{price.store}</span>
                            <div className="text-right">
                              <span>€{price.price_per_item}</span>
                              {price.price_per_unit && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({price.price_per_unit})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
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
