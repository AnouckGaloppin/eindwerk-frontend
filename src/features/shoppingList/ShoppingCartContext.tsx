import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/productTypes";

interface CartItem {
  product: Product;
  quantity: number;
}

interface ShoppingCartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, quantity: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product._id === product._id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <ShoppingCartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error("useShoppingCart moet worden gebruikt binnen een ShoppingCartProvider");
  }
  return context;
}
