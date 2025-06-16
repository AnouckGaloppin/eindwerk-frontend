import { useQuery } from "@tanstack/react-query";
//axios gooit automatisch fouten wanneer er iets
// misgaat (zoals een 404 of 500 error), fetch() zou
// je zelf moeten controleren op fouten.
//gemakkelijkere configuratie
//makkelijker werken met JSON
import { Product } from "@/types/productTypes";
import api from "@/lib/axios";

interface UseProductsOptions {
  category?: string;
  search?: string;
}

export function useProducts({ category, search }: UseProductsOptions = {}) {
  return useQuery<Product[]>({
    queryKey: ["products", category, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await api.get(`/api/products?${params.toString()}`);
      return response.data.products;
    },
  });
}
