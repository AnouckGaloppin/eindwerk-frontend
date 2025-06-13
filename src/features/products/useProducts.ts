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
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (search) params.set("search", search);
        
        console.log('Fetching products with params:', params.toString());
        const response = await api.get(`/api/products?${params.toString()}`);
        console.log('API Response:', response.data);
        
        if (!response.data) {
          console.error('No data in response');
          return [];
        }
        
        if (!Array.isArray(response.data.products)) {
          console.error('Products is not an array:', response.data.products);
          return [];
        }
        
        if (response.data.products.length === 0) {
          console.log('No products found');
          return [];
        }
        
        // Transform products to ensure they have an _id
        const products = response.data.products.map((product: any) => {
          if (!product._id) {
            console.error('Product missing _id:', product);
            return null;
          }
          return {
            ...product,
            _id: typeof product._id === 'object' ? product._id.$oid : product._id
          };
        }).filter(Boolean);
        
        console.log('Transformed products:', products);
        return products;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
  });
}
