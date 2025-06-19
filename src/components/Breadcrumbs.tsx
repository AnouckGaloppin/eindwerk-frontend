"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Product } from "@/types/productTypes";
import { getStringId } from "@/lib/utils";

export default function Breadcrumbs() {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);

  // Skip breadcrumbs for home page
  if (pathname === "/") return null;

  // Generate breadcrumb items
  const breadcrumbs = pathname
    .split("/")
    .filter((segment) => segment !== "")
    .map((segment, index, array) => {
      const path = `/${array.slice(0, index + 1).join("/")}`;
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        label,
        path,
        isLast: index === array.length - 1,
        isProduct: segment === "products" && array[index + 1] !== undefined,
        productId: segment === "products" ? array[index + 1] : undefined,
      };
    });

  console.log('Generated breadcrumbs:', breadcrumbs);

  // Fetch product data if we're on a product detail page
  const productSegment = breadcrumbs.find(b => b.isProduct);
  console.log('Product segment:', productSegment);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", productSegment?.productId],
    queryFn: async () => {
      if (!productSegment?.productId) return null;
      console.log('Fetching product with ID:', getStringId(productSegment.productId));
      try {
        const response = await api.get(`/api/products/${getStringId(productSegment.productId)}`);
        console.log('Product response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    },
    enabled: !!productSegment?.productId,
  });

  console.log('Product data:', product);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  return (
    <nav 
      className="flex items-center space-x-2 text-sm max-w-7xl mx-auto w-full px-4 mb-4 mt-4"
      role="navigation"
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center p-1.5 text-indigo-600 hover:text-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
            aria-label="Go to homepage"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            <ChevronRight 
              className="w-4 h-4 mx-2 text-gray-300" 
              aria-hidden="true"
            />
            {breadcrumb.isLast ? (
              <span 
                className="px-2.5 py-1 text-indigo-600 font-medium"
                aria-current="page"
              >
                {product?.name || breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.path}
                className="px-2.5 py-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                aria-label={`Go to ${breadcrumb.label}`}
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 