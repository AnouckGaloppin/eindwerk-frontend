"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useMediaQuery } from "@/app/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import api from "@/lib/axios";
import type { Category } from "@/types/productTypes";
import { Loader } from "lucide-react";

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
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setHasMounted(true);
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        console.log("Categories response:", response.data);
        const fetchedCategories = response.data.categories;
        console.log("Fetched categories:", fetchedCategories);
        if (!Array.isArray(fetchedCategories)) {
          throw new Error("Expected categories to be an array");
        }
        const mappedCategories = fetchedCategories.map(
          (cat: any, index: number) => {
            const categoryId = cat._id || `fallback-${index}`;
            return {
              _id: categoryId,
              name: cat.name || "Unnamed Category",
              slug: cat.slug || "unknown Slug",
              color: cat.color || "bg-gray-500",
            };
          }
        );
        setCategories(mappedCategories);
      } catch (error: any) {
        console.error("Error fetching categories:", error.message || error);
        setError("Failed to load categories, using defaults");
        // setCategories(staticCategories);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (!hasMounted || isLoading) {
    return (
      <div className="flex items-center justify-center h-44">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {isDesktop ? (
        <DesktopCategories
          categories={categories}
          error={error}
          className={className}
        />
      ) : (
        <MobileCategories
          categories={categories}
          error={error}
          className={className}
        />
      )}
    </div>
  );
}

interface DesktopCategoriesProps {
  categories: Category[];
  error: string;
  className?: string;
}

function DesktopCategories({
  categories,
  error,
  className,
}: DesktopCategoriesProps) {
  return (
    <div className={`mb-4 w-full max-w-5xl mx-auto ${className}`}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available</p>
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          grabCursor={true}
          loop={false}
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id} className="swiper-slide-custom">
              <CategoryBox category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

interface MobileCategoriesProps {
  categories: Category[];
  error: string;
  className?: string;
}

function MobileCategories({
  categories,
  error,
  className,
}: MobileCategoriesProps) {
  return (
    <div className={`mb-4 w-full ${className}`}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available</p>
      ) : (
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          grabCursor={true}
          loop={false}
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id} className="swiper-slide-custom">
              <CategoryBox category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

function CategoryBox({ category }: { category: Category }) {
  // console.log("Rendering CategoryBox for:", category);
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div
        className={`${category.color} flex items-center justify-center rounded-lg h-24 text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity min-h-[96px]`}
      >
        {category.name}
      </div>
    </Link>
  );
}
