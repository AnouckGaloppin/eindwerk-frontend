"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter, useSearchParams } from "next/navigation";
import "swiper/css";
import api from "@/lib/axios";
import type { Category } from "@/types/productTypes";
import { Loader } from "lucide-react";
import { AxiosError } from "axios";
import { CardLoader } from "@/components/ui/Loader";

// const staticCategories: Category[] = [
//   { _id: "1", name: "Fruit", slug: "fruit", color: "bg-amber-500" },
//   { _id: "2", name: "Vegetables", slug: "vegetables", color: "bg-green-500" },
//   { _id: "3", name: "Dairy", slug: "dairy", color: "bg-yellow-500" },
//   { _id: "4", name: "Meat", slug: "meat", color: "bg-red-500" },
//   { _id: "5", name: "Fish", slug: "fish", color: "bg-blue-500" },
//   { _id: "6", name: "Drinks", slug: "drinks", color: "bg-orange-400" },
//   {
//     _id: "7",
//     name: "Meat substitutes",
//     slug: "meatsubstitutes",
//     color: "bg-green-700",
//   },
//   { _id: "8", name: "Bread", slug: "bread", color: "bg-amber-700" },
//   {
//     _id: "9",
//     name: "Salty snacks",
//     slug: "saltysnacks",
//     color: "bg-purple-500",
//   },
//   { _id: "10", name: "Sweet snacks", slug: "sweetsnacks", color: "bg-pink-500" },
//   { _id: "11", name: "Grains", slug: "grains", color: "bg-amber-200" },
//   { _id: "12", name: "Spices", slug: "spices", color: "bg-green-600" },
//   { _id: "13", name: "Canned food", slug: "cannedfood", color: "bg-gray-500" },
//   { _id: "14", name: "Frozen", slug: "frozen", color: "bg-blue-300" },
// ];

interface CategoriesProps {
  className?: string;
}

export default function Categories({ className }: CategoriesProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const swiperRef = useRef<any>(null);

  // Get current category from URL without causing re-renders
  useEffect(() => {
    const category = searchParams.get('category');
    if (category !== currentCategory) {
      setCurrentCategory(category);
    }
  }, [searchParams, currentCategory]);

  useEffect(() => {
    setHasMounted(true);
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        const fetchedCategories = response.data.categories;
        
        if (!Array.isArray(fetchedCategories)) {
          throw new Error("Expected categories to be an array");
        }

        const mappedCategories = fetchedCategories.map(
          (cat: Category, index: number) => ({
            _id: cat._id || `fallback-${index}`,
            name: cat.name || "Unnamed Category",
            slug: cat.slug || "unknown Slug",
            color: cat.color || "bg-gray-500",
          })
        );

        setCategories(mappedCategories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Center active category when it changes
  useEffect(() => {
    if (currentCategory && categories.length > 0) {
      const activeIndex = categories.findIndex(cat => cat.slug === currentCategory);
      if (activeIndex !== -1) {
        setTimeout(() => {
          const activeElement = document.querySelector(`[data-category="${currentCategory}"]`);
          if (activeElement) {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
          }
        }, 100);
      }
    }
  }, [currentCategory, categories]);

  const handleCategoryClick = (categorySlug: string) => {
    setCurrentCategory(categorySlug);
    router.push(`/products?category=${categorySlug}`);
  };

  if (!hasMounted || isLoading) {
    return (
      <div 
        className="flex justify-center items-center py-8"
        role="status"
        aria-live="polite"
        aria-label="Loading categories"
      >
        <CardLoader text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded text-center text-xs font-bold">[DEBUG] Categories component rendered</div> */}
      {error && (
        <p 
          className="text-red-500 mb-4"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      {categories.length === 0 ? (
        <p 
          className="text-gray-500"
          role="status"
          aria-live="polite"
        >
          No categories available
        </p>
      ) : (
        <div 
          className="w-full max-w-[1200px] mx-auto flex justify-center"
          role="region"
          aria-label="Product categories"
        >
          <div className="w-[380px] sm:w-[480px] md:w-[800px] lg:w-[1100px]">
            <Swiper
              ref={swiperRef}
              spaceBetween={8}
              slidesPerView={2}
              breakpoints={{
                0: { 
                  slidesPerView: 2,
                  spaceBetween: 8
                },
                640: { 
                  slidesPerView: 3,
                  spaceBetween: 8
                },
                768: { 
                  slidesPerView: 4,
                  spaceBetween: 8
                },
                1024: { 
                  slidesPerView: 5,
                  spaceBetween: 8
                }
              }}
            >
              {categories.map((category) => {
                const isActive = category.slug === currentCategory;
                return (
                  <SwiperSlide key={category._id}>
                    <CategoryBox 
                      category={category} 
                      isActive={isActive}
                      onClick={() => handleCategoryClick(category.slug)}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryBox({ category, isActive, onClick }: { category: Category, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-category={category.slug}
      className={`
        relative block w-full max-w-[200px] rounded-lg overflow-hidden
        transition-all duration-300 ease-in-out transform hover:shadow-lg hover:scale-105
        ${isActive ? 'h-20' : 'h-12'}
      `}
      aria-label={`Filter by ${category.name}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`
        absolute inset-0 ${category.color} bg-opacity-80
        flex items-center justify-center
        transition-opacity duration-300
        ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}
      `}>
        <span className="text-white text-center font-semibold px-2 text-base">
          {category.name}
        </span>
      </div>
    </button>
  );
}
