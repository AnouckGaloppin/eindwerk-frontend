import { useSwipeable } from "react-swipeable";
import type { Favourite } from "@/types/favouritesTypes";
import { Heart } from "lucide-react";
import {
  useFavourites,
  useToggleFavourite,
} from "@/features/favourites/useFavourites";

type FavouriteItemProps = {
  favourite: Favourite;
  toggleFavourite: ReturnType<typeof useToggleFavourite>;
  isMobile?: boolean;
};

// Helper function to get string ID
const getStringId = (id: string | { $oid: string }): string => {
  if (typeof id === 'object' && id !== null && '$oid' in id) {
    return id.$oid;
  }
  return id;
};

export function FavouriteItem({
  favourite,
  // onDelete,
  isMobile,
}: FavouriteItemProps) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleToggle(),
    trackTouch: true,
  });

  const { data: favourites = [] } = useFavourites();
  const toggleFavourite = useToggleFavourite();
  // const { favourites, toggleFavourite } = useFavouritesContext();
  const product = favourite.product;
  const productId = product?.id ?? favourite.product_id;

  if (!productId) {
    console.error("Missing product ID in favourite:", favourite);
    return null; // or handle the error as needed
  }
  const isFavourite = favourites.some((fav) => {
    const favProductId = fav.product_id ? getStringId(fav.product_id) : null;
    return favProductId === productId;
  });

  const handleToggle = () => {
    const stringProductId = getStringId(productId);
    toggleFavourite.mutate({ product_id: stringProductId });
  };

  return (
    <li
      {...(isMobile ? swipeHandlers : {})}
      className="bg-white p-3 sm:p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center mb-2 hover:scale-[1.02]"
    >
      <div className="flex items-center gap-4">
        {product?.img && (
          <img
            src={product.img}
            alt={favourite.product?.name || "Onbekend product"}
            className="w-16 h-16 object-cover rounded-lg shadow-sm"
          />
        )}
        {product && (
          <div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words leading-tight">{product.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{product.brand || 'Unknown Brand'}</p>
          </div>
        )}
      </div>
      {!isMobile && (
        <button
          onClick={() => handleToggle()}
          className="text-red-600 hover:text-red-700 transition-colors duration-200 p-2 hover:bg-red-50 rounded-full"
          aria-label="Toggle favourite"
        >
          {isFavourite ? (
            <Heart className="fill-red-500 w-6 h-6" />
          ) : (
            <Heart className="w-6 h-6" />
          )}
        </button>
      )}
    </li>
  );
}
