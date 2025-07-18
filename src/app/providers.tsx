"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCartProvider } from "@/features/shoppingList/ShoppingCartContext";
import { ToastProvider } from "@/context/ToastContext";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ShoppingCartProvider>
            <Header />
            {children}
            <Footer />
          </ShoppingCartProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
