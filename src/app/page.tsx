// "use client";
// // pages/index.tsx

// import { useEffect, useState } from "react";
// import SearchBar from "@/components/SearchBar";

// type Category = {
//   id: number;
//   name: string;
// };

// export default function Home() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   // useEffect(() => {
//   //   const fetchCategories = async() => {
//   //     try {
//   //       const res = await fetch('/api/categories')
//   //       if (!res.ok) throw new Error('Failed to fetch categories')
//   //         const data = await res.json()
//   //       setCategories(data)
//   //     } catch(error) {
//   //       console.error('Error:', error)
//   //     }
//   //   }
//   //   fetchCategories()
//   // }, [])
//   return (
//     <main className="min-h-screen flex flex-col">
//       {/* Zoekbalk via component*/}
//       <div className="pt-16 bg-yellow-200 border border-red-500">
//         <SearchBar
//           value={searchTerm}
//           onChange={setSearchTerm}
//           placeholder="Zoek naar producten..."
//         />
//       </div>

//       {/* Categorieën */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             className="bg-blue-100 p-4 rounded text-center hover:bg-blue-200"
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* Navigatie naar lijsten */}
//       <div className="grid grid-cols-2 gap-4">
//         <button className="bg-green-200 p-4 rounded">Boodschappenlijst</button>
//         <button className="bg-red-200 p-4 rounded">Favorietenlijst</button>
//       </div>
//     </main>
//   );
// }

// // const Home = () => {
// //   const [data, setData] = useState(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/data`
// //       );
// //       const result = await response.json();
// //       setData(result);
// //     };

// //     fetchData();
// //   }, []);

// //   return (
// //     <div>
// //       <h1>Data from Laravel API:</h1>
// //       <pre>{JSON.stringify(data, null, 2)}</pre>
// //     </div>
// //   );
// // };

// // export default Home;

// "use client";

// import { useProducts } from "@/features/products/useProducts";
// import { Product } from "@/types/productTypes";

// export default function Home() {
//   const { data: products, isLoading, error } = useProducts();

//   if (isLoading) return <p>Laden...</p>;
//   if (error) return <p>Fout bij ophalen van producten</p>;

//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Producten</h1>
//       {Array.isArray(products) && products.length > 0 ? (
//         <ul className="space-y-2">
//           {products.map((product: any) => (
//             <li
//               key={product.id}
//               className="p-3 bg-gray-100 rounded-md shadow-sm"
//             >
//               {product.name}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>Geen producten gevonden.</p>
//       )}
//     </main>
//   );
// }

// import { ReactNode } from "react";

// import { NavItem } from "@/app/layout";

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="nl">
//       <body className="flex flex-col min-h-screen">
//         {/* Header met logo en zoekbalk */}
//         <header className="m-4 p-2 rounded bg-gray-500 shadow-md flex justify-between items-center">
//           <div className="text-xl font-bold">Logo</div>
//           <input
//             type="text"
//             placeholder="Search for product..."
//             className="border p-2 rounded-md w-full max-w-md ml-4"
//           />
//           <button className="cursor-pointer p-2">
//             <Settings className="w-6 h-6" />
//           </button>
//         </header>

//         {/* Main content */}
//         <main className="">{children}</main>

//         {/* Bottom navigation bar */}
//         <footer className="bg-gray-500 p-4 flex justify-around border-t">
//           <NavItem label="Home">
//             <House />
//           </NavItem>
//           <NavItem label="Zoek">
//             <Search />
//           </NavItem>
//           <NavItem label="Boodschappenlijst">
//             <ShoppingCart />
//           </NavItem>
//           <NavItem label="Favorieten">
//             <Heart />
//           </NavItem>
//           <NavItem label="Profiel">
//             <User />
//           </NavItem>
//         </footer>
//       </body>
//     </html>
//   );
// }

import Categories from "@/components/Categories";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="p-4 flex flex-col flex-grow">
      <h1 className="text-2xl font-bold mb-4 text-center">Welkom</h1>
      {/* Home content */}
      <Categories />

      <div className="flex flex-grow justify-center items-center">
        <div className="home grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
          <Link
            href="/shoppinglist"
            className="bg-teal-500 border text-white px-4 py-2 rounded-lg h-20 flex items-center justify-center w-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out group"
          >
            <span className="text-lg font-semibold tracking-tight group-hover:tracking-wide transition-all">
              Boodschappen
            </span>
          </Link>
          <Link
            href="/favourites"
            className="bg-teal-500 text-white px-4 py-2 rounded-lg h-20 flex items-center justify-center w-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out group"
          >
            <span className="text-lg font-semibold tracking-tight group-hover:tracking-wide transition-all">
              Favorieten
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
