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
      <h2>Prijsvergelijking</h2>
      <button
        onClick={fetchComparison}
        disabled={loading || productIds.length === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Laden..." : "Vergelijk prijzen"}
      </button>
      {showResults && (
        // Resultaten alleen tonen als showResults true is
        <>
          {loading && <p>Laden...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && comparisonData.length === 0 && (
            <p>Geen prijzen beschikbaar.</p>
          )}
          {!loading && !error && comparisonData.length > 0 && (
            <ul>
              {comparisonData.map((item: any) => (
                <li key={item.product_id} className="mt-2">
                  <strong>{item.product_name}</strong>
                  <p>
                    Goedkoopste: {item.cheapest_store} (€
                    {item.cheapest_price_per_item})
                  </p>
                  {item.all_prices.length > 1 && (
                    <ul className="ml-4">
                      {item.all_prices.map((price: any, idx: number) => (
                        <li key={idx}>
                          {price.store}: €{price.price_per_item}{" "}
                          {price.price_per_unit &&
                            `(${price.price_per_unit} per unit)`}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
