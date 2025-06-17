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
  const [isLoading, setIsLoading] = useState(true);
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
        <div className="w-full max-w-[1200px] mx-auto flex justify-center">
          <Swiper
            ref={swiperRef}
            spaceBetween={8}
            grabCursor={true}
            loop={false}
            slidesPerView={2}
            centeredSlides={false}
            className="w-[380px] sm:w-[480px] md:w-[800px] lg:w-[1100px]"
            slidesOffsetBefore={24}
            slidesOffsetAfter={16}
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
            {(() => {
              // If currentCategory is not set, no category should be active
              const activeIndex = currentCategory ? categories.findIndex(cat => cat.slug === currentCategory) : -1;
              return categories.map((category, idx) => (
                <SwiperSlide
                  key={category._id}
                  className={
                    `flex justify-center` +
                    (category.slug === currentCategory ? ' z-20' : '') +
                    (activeIndex !== -1 && idx === activeIndex + 1 ? ' ml-4' : ' mr-1')
                  }
                >
                  <CategoryBox category={category} isActive={!!currentCategory && category.slug === currentCategory} />
                </SwiperSlide>
              ));
            })()}
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
      className="block"
    >
      <div
        className={
          `${category.color} rounded-lg text-white font-semibold cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out shadow-sm ` +
          (isActive
            ? " w-[140px] h-[65px] sm:w-[150px] sm:h-[70px] md:w-[170px] md:h-[85px] lg:w-[200px] lg:h-[95px] ml-2 scale-104 z-10"
            : " w-[130px] h-[60px] sm:w-[140px] sm:h-[65px] md:w-[160px] md:h-[75px] lg:w-[180px] lg:h-[85px] mx-1 scale-100")
        }
      >
        <span className="px-2 text-sm sm:text-base lg:text-lg text-center break-words hyphens-auto">
          {category.name}
        </span>
      </div>
    </Link>
  );
}
