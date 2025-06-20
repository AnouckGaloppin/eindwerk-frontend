import api from '@/lib/axios';
import { Suspense } from 'react';
import { cache } from 'react';
import { PageLoader } from '@/components/ui/Loader';
import ProductsClient from './ProductsClient';

const fetchCategories = cache(async () => {
  try {
    const response = await api.get("/api/categories");
    return response.data.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories on server:", error);
    return [];
  }
});

async function fetchInitialProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    const params = new URLSearchParams();
    if (searchParams.category) params.append('category', searchParams.category as string);
    if (searchParams.search) params.append('search', searchParams.search as string);
    
    // Get page from searchParams, default to 1
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    params.append('page', page.toString());
    params.append('per_page', '12');

    const response = await api.get(`/api/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch initial products on server:", error);
    return null;
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const categories = await fetchCategories();
  const initialProducts = await fetchInitialProducts(searchParams);

  return (
    <Suspense fallback={<PageLoader text="Loading..." />}>
      <ProductsClient categories={categories} initialProducts={initialProducts} />
    </Suspense>
  );
}
