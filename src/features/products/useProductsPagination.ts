import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/productTypes";
import api from "@/lib/axios";

interface UseProductsPaginationOptions {
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
  initialData?: ProductsResponse;
}

interface ProductsResponse {
  message: string;
  products: Product[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
  };
}

export function useProductsPagination({ 
  category, 
  search, 
  page = 1, 
  perPage = 12, 
  initialData 
}: UseProductsPaginationOptions = {}) {
  console.log('useProductsPagination called with:', { category, search, page, perPage });
  
  const query = useQuery({
    queryKey: ["products", category, search, page, perPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('per_page', perPage.toString());
      
      console.log('Making API call with params:', params.toString());
      const response = await api.get(`/api/products?${params.toString()}`);
      console.log('API response:', response.data);
      return response.data as ProductsResponse;
    },
    initialData: page === 1 ? initialData : undefined,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  console.log('Query result:', {
    data: query.data,
    isLoading: query.isLoading,
    products: query.data?.products?.length
  });

  return {
    ...query,
    products: query.data?.products ?? [],
    pagination: query.data?.pagination ?? {
      total: 0,
      per_page: perPage,
      current_page: page,
      last_page: 1,
      has_more: false
    },
    isLoading: query.isLoading,
    error: query.error,
  };
} 