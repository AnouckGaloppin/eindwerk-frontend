"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import { useMediaQuery } from "@/app/hooks";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { useSearchParams } from "next/navigation";
import "swiper/css";
import api from "@/lib/axios";
import type { Category } from "@/types/productTypes";
import { Loader } from "lucide-react";
import './Categories.css';
// import { div } from "framer-motion/client";
import { AxiosError } from "axios";

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
  const [isLoading] = useState(true);
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const swiperRef = useRef<SwiperRef>(null);
  // const slidesPerView = 5;
  // const router = useRouter();
  // const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {
    setHasMounted(true);
    const fetchCategories = async () => {
      try {
        // console.log('Fetching categories...');
        const response = await api.get("/api/categories");
        // console.log('Categories API response:', response.data);
        const fetchedCategories = response.data.categories;
        if (!Array.isArray(fetchedCategories)) {
          throw new Error("Expected categories to be an array");
        }
        const mappedCategories = fetchedCategories.map(
          (cat: Category, index: number) => {
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
        // console.log('Mapped categories:', mappedCategories);
      
      // if (currentCategory) {
      //   const initialIndex = mappedCategories.findIndex((cat)=>cat.slug === currentCategory);
      //   if (initialIndex !== -1) {
      //     setActiveIndex(initialIndex);
      //     // router.push(`/products?category=${currentCategory}`);
      //   }
      // }

      } catch (error: unknown) {
        if (error instanceof AxiosError) {
        // console.error("Error fetching categories:", error.message || error);
        setError("Failed to load categories, using defaults");
      }
    };
    }
    fetchCategories();
  }, []);

  // Effect to scroll to active category when it changes
  useEffect(() => {
    if (currentCategory && swiperRef.current?.swiper && categories.length > 0) {
      const activeIndex = categories.findIndex(cat => cat.slug === currentCategory);
      if (activeIndex !== -1) {
        let targetIndex = activeIndex;
        if (activeIndex <= 1) {
          targetIndex = 0;
        } else if (activeIndex >= categories.length - 2) {
          targetIndex = Math.max(categories.length - 5, 0);
        } else {
          targetIndex = activeIndex - 2;
        }
        swiperRef.current.swiper.slideTo(targetIndex);
      }
    }
  }, [currentCategory, categories]);

  if (!hasMounted || isLoading) {
    return (
      <div className="flex items-center justify-center h-44">
        <Loader className="animate-spin text-gray-900" />
      </div>
    );
  }

  // Debug message to confirm rendering
  // console.log('Rendering Categories component. Categories:', categories);

  return (
    <div className={className}>
      {/* <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded text-center text-xs font-bold">[DEBUG] Categories component rendered</div> */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available</p>
      ) : (
        <div className="w-full max-w-[1200px] flex items-center justify-center overflow-hidden mx-auto min-h-[7rem]">
          <Swiper
            ref={swiperRef}
            spaceBetween={20}
            grabCursor={true}
            loop={false}
            slidesPerView={5}
            centeredSlides={false}
            className="w-full h-full flex items-center"
            breakpoints={{
              0: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id} className="h-full flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <CategoryBox category={category} isActive={category.slug === currentCategory} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

function CategoryBox({ category, isActive }: { category: Category, isActive: boolean }) {
  return (
    <Link 
      href={`/products?category=${category.slug}`} 
      className="w-full h-full flex items-center justify-center"
    >
      <div
        className={
          `${category.color} rounded-xl text-white font-semibold cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out shadow-sm` +
          (isActive ? " w-64 h-28" : " w-56 h-24")
        }
      >
        <span className="px-2 text-base md:text-lg text-center break-words hyphens-auto">
          {category.name}
        </span>
      </div>
    </Link>
  );
}
