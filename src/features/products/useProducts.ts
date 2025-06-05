import { useQuery } from "@tanstack/react-query";
//axios gooit automatisch fouten wanneer er iets
// misgaat (zoals een 404 of 500 error), fetch() zou
// je zelf moeten controleren op fouten.
//gemakkelijkere configuratie
//makkelijker werken met JSON
import { Products } from "@/types/productTypes";
import api from "@/lib/axios";

export function useProducts() {
  return useQuery<Products, Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get<Products>(`/api/products`);
      return response.data;
    },
  });
}
