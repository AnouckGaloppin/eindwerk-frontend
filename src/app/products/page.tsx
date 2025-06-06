"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";
import type { Product } from "@/types/productTypes";
import Categories from "@/components/Categories";

export default function ProductsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) {
          params.set("category", category);
        }
        if (search) {
          params.set("search", search);
        }
        const response = await api.get(`/api/products?${params.toString()}`);
        setProducts(response.data.products);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProducts();
    } else {
      setError("Please login to view products");
      setLoading(false);
    }
  }, [user, category, search]);

  if (!user) {
    return (
      <div className="p-4 text-center">Please log in to view products.</div>
    );
  }

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center">{error}</div>;
  }

  return (
    <div className="p-4 pt-20 pb-24">
      <Categories className="mb-8" />
      <h2 className="text-2xl font-bold mb-4">
        {category
          ? `${category} Products`
          : search
          ? `Search Results for "${search}"`
          : "All Products"}
      </h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm-grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500">
                Category: {product.category}
              </p>
              <p className="text-lg font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}