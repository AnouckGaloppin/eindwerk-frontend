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

export function FavouriteItem({
  favourite,
  // onDelete,
  isMobile,
}: FavouriteItemProps) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleToggle(),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  const { data: favourites = [] } = useFavourites();
  const toggleFavourite = useToggleFavourite();
  // const { favourites, toggleFavourite } = useFavouritesContext();
  const product = favourite.product;
  const productId = favourite.product?.id;

  if (!productId) {
    console.error("Missing product ID in favourite:", favourite);
    return null; // or handle the error as needed
  }
  const isFavourite = favourites.some((fav) => fav.product?.id === productId);

  const handleToggle = () => {
    toggleFavourite.mutate({ product_id: productId });
  };

  return (
    <li
      {...(isMobile ? swipeHandlers : {})}
      className="p-2 border rounded flex justify-between items-center"
    >
      <div className="flex items-center gap-4">
        {product?.img && (
          <img
            src={product.img}
            alt={favourite.product?.name || "Onbekend product"}
            className="w-12 h-12 object-cover rounded"
          />
        )}
      </div>
      <span>{favourite.product?.name || "Onbekend product"}</span>
      {!isMobile && (
        <button
          onClick={() => handleToggle()}
          className="text-red-600"
          aria-label="Toggle favourite"
        >
          {isFavourite ? (
            <Heart className="fill-red-500 w-4 h-4" />
          ) : (
            <Heart className="w-4 h-4" />
          )}
        </button>
      )}
    </li>
  );
}
