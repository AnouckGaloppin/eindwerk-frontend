"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";
import type { Product } from "@/types/productTypes";
import Categories from "@/components/Categories";
import { ShoppingCart } from "lucide-react";
import {
  useFavourites,
  useToggleFavourite,
} from "@/features/favourites/useFavourites";
import { Heart } from "lucide-react";

export default function ProductsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  // const { favourites, toggleFavourite } = useFavourites();
  const {
    data: favourites = [],
    isLoading: favLoading,
    error: favError,
  } = useFavourites();
  const toggleFavouriteMutation = useToggleFavourite();

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
        const apiUrl = `/products?${params.toString()}`;
        console.log("Making API request to:", apiUrl);

        const response = await api.get(apiUrl);
        console.log("API Response:", {
          status: response.status,
          data: response.data,
          products: response.data.products,
        });

        if (!response.data.products) {
          console.error("No products array in response:", response.data);
          setError("Invalid response format from server");
          return;
        }

        // Log the first product to see its structure
        // if (response.data.products.length > 0) {
        //   console.log("First product structure:", {
        //     product: response.data.products[0],
        //     id: response.data.products[0]._id,
        //     idType: typeof response.data.products[0]._id,
        //   });
        // }

        setProducts(response.data.products);
      } catch (error: any) {
        // console.error("Error fetching products:", {
        //   message: error.message,
        //   response: error.response?.data,
        //   status: error.response?.status,
        // });
        setError(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    // TODO: Re-enable user check later
    // if (user) {
    fetchProducts();
    // } else {
    //   setError("Please login to view products");
    //   setLoading(false);
    // }
  }, [category, search]);

  const handleAddToShoppingList = async (product: Product) => {
    try {
      // console.log("Full product object:", product);

      // Prefer product.id, fallback to _id if present
      const productId = product.id || product._id;

      if (!productId) {
        setError("Product ID is missing!");
        return;
      }

      setAddingToCart(String(productId));

      // TODO: Re-enable CSRF token fetch when authentication is needed
      // await api.get('/sanctum/csrf-cookie');

      const response = await api.post("/shopping-list", {
        productId: productId,
        quantity: 1,
        unit: product.standard_unit,
      });

      console.log("Add to shopping list response:", response.data);
      // You could add a toast notification here to show success
    } catch (error: any) {
      // Log the raw error for debugging
      // console.error("Raw error adding to shopping list:", error);

      // console.error("Error adding to shopping list:", {
      //   message: error.message,
      //   response: error.response?.data,
      //   status: error.response?.status,
      // });
      setError(
        error.response?.data?.message || "Failed to add to shopping list"
      );
    } finally {
      setAddingToCart(null);
    }
  };

  // const fetchFavourites = async () => {
  //   try {
  //     const response = await api.get("/favourites");
  //     const favouriteIds = response.data.map(
  //       (fav: { productId: string }) => fav.productId
  //     );
  //     console.log("Favourites fetched:", response.data);
  //     // setFavorites(favoriteIds);
  //   } catch (error: any) {
  //     console.error("Error fetching favourites:", {
  //       message: error.message,
  //       response: error.response?.data,
  //       status: error.response?.status,
  //     });
  //     setError(error.response?.data?.message || "Failed to load favourites");
  //   }
  //   fetchFavourites();
  // };

  // TODO: Re-enable user check later
  // if (!user) {
  //   return (
  //     <div className="p-4 text-center">Please log in to view products.</div>
  //   );
  // }

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (favError) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading favourites: {favError.message}
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 pb-24">
      <Categories className="mb-8" />
      <h2 className="text-2xl font-bold mb-4">
        {category
          ? `${category} products`
          : search
          ? `Search Results for "${search}"`
          : "All Products"}
      </h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const productId = product.id
              ? String(product.id)
              : product._id
              ? String(product._id)
              : "";

            const isFavourite = favourites.some(
              (fav) => fav.product.id === productId
            );

            return (
              <div
                key={productId}
                className="border p-4 rounded shadow hover:shadow-lg transition-shadow"
              >
                {product.img && (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold">{product.name}</h3>
                {product.description && (
                  <p className="text-gray-600">{product.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  Quantity: {product.quantity} {product.standard_unit}
                </p>
                <p className="text-lg font-bold mt-2">
                  $
                  {typeof product.price_per_item === "object" &&
                  product.price_per_item.$numberDecimal
                    ? parseFloat(product.price_per_item.$numberDecimal).toFixed(
                        2
                      )
                    : typeof product.price_per_item === "number"
                    ? product.price_per_item.toFixed(2)
                    : "0.00"}
                </p>
                <button
                  onClick={() => handleAddToShoppingList(product)}
                  disabled={addingToCart === productId}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white transition-colors ${
                    addingToCart === productId
                      ? "bg-gray-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingToCart === productId
                    ? "Adding..."
                    : "Add to Shopping List"}
                </button>
                <button
                  onClick={() =>
                    toggleFavouriteMutation.mutate({ product_id: productId })
                  }
                  aria-label={
                    isFavourite ? "Remove from favourites" : "Add to favourites"
                  }
                  className="mt-2"
                >
                  {isFavourite ? (
                    <Heart className="fill-red-500 text-red-500 w-6 h-6" />
                  ) : (
                    <Heart className="w-6 h-6" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
