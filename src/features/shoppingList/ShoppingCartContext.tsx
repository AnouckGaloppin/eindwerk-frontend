import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from 'uuid';
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
    
    // Get the product ID, handling both string and object ID formats
    const productId = typeof product.id === 'object' ? product.id.$oid : product.id;

    if (!productId) {
      console.error("Product has no id:", product);
      return;
    }

    setCartItems((current) => {
      const itemIndex = current.findIndex(
        (item) => item.product_id === productId
      );
      
      if (itemIndex !== -1) {
        // If product is already in cart, increase quantity
        const updated = [...current];
        updated[itemIndex].quantity += quantity;
        return updated;
      } else {
        // Add new item to cart
        const newItem: ShoppingListItem = {
          id: uuidv4(),
          product_id: productId,
          product,
          quantity,
          unit: product.unit || 'piece',
          checked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [...current, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((current) =>
      current.filter((item) => item.product_id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((current) => {
      return current.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
    });
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.product_id === productId);
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
      "useShoppingCart must be used within ShoppingCartProvider"
    );
  }
  return context;
};
