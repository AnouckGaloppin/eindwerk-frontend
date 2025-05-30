import { useQuery } from "@tanstack/react-query";
//axios gooit automatisch fouten wanneer er iets
// misgaat (zoals een 404 of 500 error), fetch() zou
// je zelf moeten controleren op fouten.
//gemakkelijkere configuratie
//makkelijker werken met JSON
import axios from "axios";
import { Products } from "@/types/productTypes";

export function useProducts() {
  return useQuery<Products, Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get<Products>(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      return response.data;
    },
  });
}
