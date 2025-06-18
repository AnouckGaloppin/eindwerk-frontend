import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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

export function useProducts({ category, search }: UseProductsOptions = {}) {
  const query = useInfiniteQuery({
    queryKey: ["products", category, search],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      params.append('page', pageParam.toString());
      params.append('per_page', '12');
      
      const response = await api.get(`/api/products?${params.toString()}`);
      return response.data as ProductsResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.has_more ? lastPage.pagination.current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Memoize the flattened array to prevent infinite loops
  const allProducts = useMemo(() => {
    return query.data?.pages.flatMap((page: ProductsResponse) => page.products) ?? [];
  }, [query.data?.pages]);
  
  return {
    ...query,
    data: allProducts,
    products: allProducts,
    hasMore: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
