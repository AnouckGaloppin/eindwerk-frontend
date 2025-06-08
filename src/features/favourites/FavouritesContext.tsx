// // src/context/FavoritesContext.tsx

// import { createContext, useContext, useEffect, useState } from "react";
// import api from "@/lib/axios";
// // import { error } from "console";

// type FavouritesContextType = {
//   favourites: string[];
//   toggleFavourite: (productId: string) => Promise<void>;
// };

// const FavouritesContext = createContext<FavouritesContextType | undefined>(
//   undefined
// );

// export const FavouritesProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [favourites, setFavourites] = useState<string[]>([]);

//   const fetchFavourites = async () => {
//     try {
//       const res = await api.get("/favourites");
//       const favouriteIds = res.data.map(
//         (fav: { product_id: string }) => fav.product_id
//       );
//       setFavourites(favouriteIds);
//     } catch (err: any) {
//       console.error("Error fetching favourites:", {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });
//     }
//   };

//   useEffect(() => {
//     fetchFavourites();
//   }, []);

//   const toggleFavourite = async (productId: string) => {
//     try {
//       const res = await api.post("/favourites/toggle", {
//         product_id: productId,
//       });
//       console.log("Toggle response:", res.data);

//       if (res.data.status === "added") {
//         setFavourites((prev) => [...prev, productId]);
//       } else if (res.data.status === "removed") {
//         setFavourites((prev) => prev.filter((id) => id !== productId));
//       }
//     } catch (err: any) {
//       console.error("Error toggling favourite:", {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });
//     }
//   };

//   return (
//     <FavouritesContext.Provider value={{ favourites, toggleFavourite }}>
//       {children}
//     </FavouritesContext.Provider>
//   );
// };

// export const useFavourites = () => {
//   const context = useContext(FavouritesContext);
//   if (context === undefined) {
//     throw new Error("useFavourites must be used within a FavouritesProvider");
//   }
//   return context;
// };
// // function setError(arg0: any) {
// //   throw new Error("Function not implemented.");
// // }
