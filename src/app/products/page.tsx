"use client";

import { useProducts } from "@/features/products/useProducts";
import { useShoppingList } from "@/features/shoppingList/useShoppingList";
import {
  useFavourites,
  useToggleFavourite,
} from "@/features/favourites/useFavourites";
import Categories from "@/components/Categories";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProductList from "@/features/products/ProductList";
import type { Product } from "@/types/productTypes";

export default function ProductsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts(category, search);
  const {
    items: shoppingList = [],
    isLoading: shoppingListLoading,
    error: shoppingListError,
    addItem,
    updateItem,
  } = useShoppingList();
  const {
    data: favourites = [],
    isLoading: favLoading,
    error: favError,
  } = useFavourites();
  const toggleFavouriteMutation = useToggleFavourite();

  const handleAddOrUpdate = (product: Product) => {
    console.log("handleAddOrUpdate", product);
    const productId = String(product.id);
    const existingItem = shoppingList.find(
      (item) => item.product_id === productId
    );

    if (existingItem) {
      // Update quantity
      updateItem({
        itemId: existingItem.id,
        quantity: existingItem.quantity + 1,
      });
    } else {
      // Add new item
      addItem({
        productId,
        quantity: 1,
        unit: product.unit || "piece",
      });
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: string) => {
    const numQuantity = parseFloat(newQuantity);
    if (!isNaN(numQuantity) && numQuantity > 0) {
      updateItem({
        itemId,
        quantity: numQuantity,
      });
    }
  };

  const errorMessage =
    productsError?.message || shoppingListError?.message || favError?.message;

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
      <ProductList
        products={products}
        shoppingList={shoppingList}
        favourites={favourites}
        isLoading={isProductsLoading || shoppingListLoading || favLoading}
        error={errorMessage}
        onAddOrUpdate={handleAddOrUpdate}
        onQuantityChange={handleQuantityChange}
        onToggleFavourite={(productId) =>
          toggleFavouriteMutation.mutate({ product_id: productId })
        }
      />
    </div>
  );
}
