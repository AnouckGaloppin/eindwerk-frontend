"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/app/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const categories = [
  { id: 1, name: "Fruit", color: "bg-red-400" },
  { id: 2, name: "Groenten", color: "bg-green-400" },
  { id: 3, name: "Dranken", color: "bg-blue-400" },
  { id: 4, name: "Vlees", color: "bg-yellow-400" },
  { id: 5, name: "Zuivel", color: "bg-purple-400" },
  { id: 6, name: "Brood", color: "bg-pink-400" },
];

export default function Categories() {
  const [hasMounted, setHasMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="h-32" />;
  }

  return isDesktop ? <DesktopCategories /> : <MobileCategories />;
}

function DesktopCategories() {
  return (
    <div className="mb-4 w-full max-w-5xl mx-auto">
      <Swiper spaceBetween={20} slidesPerView={4} grabCursor={true}>
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <CategoryBox category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function MobileCategories() {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-4">
      {categories.slice(0, 6).map((category) => (
        <CategoryBox key={category.id} category={category} />
      ))}
    </div>
  );
}

// if (isDesktop) {
// return (
//   <Swiper spaceBetween={20} slidesPerView={4} grabCursor={true}>
//     {categories.map((category) => (
//       <SwiperSlide key={category.id}>
//         <CategoryBox category={category} />
//       </SwiperSlide>
//     ))}
//   </Swiper>
// );
// }

//   return (
//     <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-4">
//       {categories.slice(0, 6).map((category) => (
//         <CategoryBox key={category.id} category={category} />
//       ))}
//     </div>
//   );
// }

function CategoryBox({
  category,
}: {
  category: { id: number; name: string; color: string };
}) {
  return (
    <div
      className={`${category.color} flex items-center justify-center rounded-lg h-24 text-white font-semibold cursor-pointer`}
    >
      {category.name}
    </div>
  );
}
