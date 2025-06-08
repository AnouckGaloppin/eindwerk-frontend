import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "@/types/productTypes";
import type { ShoppingListItem } from "@/types/shoppingTypes";

type ShoppingCartContextType = {
  cart: ShoppingListItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  isInCart: (productId: string) => boolean;
};

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(
  undefined
);

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ShoppingListItem[]>([]);

  const addToCart = (product: Product, quantity = 1) => {
    console.log("Adding product to cart:", product);
    const productId =
      typeof product.id === "string"
        ? product.id
        : product.id
        ? product.id.toString()
        : typeof product.id === "string"
        ? product.id
        : product.id
        ? product.id
        : "";

    if (!productId) {
      console.error("Product has no id or _id:", product);
      return;
    }

    setCartItems((current) => {
      const itemIndex = current.findIndex(
        (item) => item.product.id === productId
      );
      if (itemIndex !== -1) {
        // Als product al in winkelmand, verhoog quantity
        const updated = [...current];
        updated[itemIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: ShoppingListItem = {
          id: uuidv4(), // uniek id genereren
          product_id: productId, // als dit ook nodig is
          product,
          quantity,
          unit: product.unit, // bijvoorbeeld overnemen van product
          checked: false, // standaard false
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [...current, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((current) =>
      current.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((current) => {
      return current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cart: cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        isInCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = (): ShoppingCartContextType => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error(
      "useShoppingCart moet binnen ShoppingCartProvider gebruikt worden"
    );
  }
  return context;
};
function uuidv4(): string {
  throw new Error("Function not implemented.");
}
