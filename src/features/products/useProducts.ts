import { useQuery } from "@tanstack/react-query";
//axios gooit automatisch fouten wanneer er iets
// misgaat (zoals een 404 of 500 error), fetch() zou
// je zelf moeten controleren op fouten.
//gemakkelijkere configuratie
//makkelijker werken met JSON
import { Products } from "@/types/productTypes";
import api from "@/lib/axios";

export function useProducts(category?: string, search?: string) {
  return useQuery<Products, Error>({
    queryKey: ["products", category, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      const response = await api.get(`/api/products?${params.toString()}`);
      return response.data.products;
    },
  });
}
