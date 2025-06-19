import { useShoppingList } from "./useShoppingList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSwipeable } from "react-swipeable";
// import { motion, AnimatePresence } from "framer-motion";
import type { ShoppingListItem as ShoppingListItemType } from "@/types/shoppingTypes";
import { Trash, Plus, Minus, Heart } from "lucide-react";
import Image from "next/image";
import { CardLoader, InfiniteScrollLoader } from "@/components/ui/Loader";
import { useState } from "react";
import { useToggleFavourite, useFavourites } from "@/features/favourites/useFavourites";
import { toast } from "react-toastify";

interface ShoppingListItemProps {
  product: ShoppingListItemType;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

function ShoppingListItem({ product, onDelete, onUpdateQuantity }: ShoppingListItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);
  const toggleFavourite = useToggleFavourite();
  const { favourites } = useFavourites();
  
  // Check if this product is in favorites
  const isFavorite = favourites.some(fav => fav.product_id === product.product_id);

  const handleToggleFavorite = async () => {
    try {
      await toggleFavourite.mutateAsync({ product_id: product.product_id });
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites!");
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(product._id);
      }, 300);
    },
    onSwipedRight: async () => {
      if (!isFavorite) {
        try {
          await toggleFavourite.mutateAsync({ product_id: product.product_id });
          toast.success("Added to favorites!");
        } catch (error) {
          toast.error("Failed to add to favorites");
        }
      }
    },
    onSwiping: (e) => {
      setIsSwipingLeft(e.dir === "Left");
      setIsSwipingRight(e.dir === "Right");
    },
    onTouchEndOrOnMouseUp: () => {
      setIsSwipingLeft(false);
      setIsSwipingRight(false);
    },
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <li 
      {...handlers}
      className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-2 transition-all duration-300 ease-in-out transform hover:shadow-lg hover:scale-105 relative ${
        isDeleting ? 'translate-x-[-100%] opacity-0' : ''
      }`}
    >
      {/* Delete indicator (left swipe) */}
      <div 
        className="absolute inset-y-0 right-0 bg-red-500 rounded-r-lg flex items-center justify-center px-4 text-white opacity-0 transition-opacity duration-200"
        style={{
          opacity: isSwipingLeft ? '1' : '0',
          width: '4rem'
        }}
      >
        <Trash className="w-5 h-5" />
      </div>

      {/* Favorite indicator (right swipe) */}
      <div 
        className="absolute inset-y-0 left-0 bg-pink-500 rounded-l-lg flex items-center justify-center px-4 text-white opacity-0 transition-opacity duration-200"
        style={{
          opacity: isSwipingRight ? '1' : '0',
          width: '4rem'
        }}
      >
        <Heart className="w-5 h-5" />
      </div>

      <div className="flex items-center space-x-4">
        {product.product?.img && (
          <div className="relative w-16 h-16">
            <Image
              src={product.product.img}
              alt={product.product.name}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        <div>
          <h3 className="font-medium text-gray-900">{product.product?.name}</h3>
          <p className="text-sm text-gray-500">{product.unit}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(product._id, Math.max(0, product.quantity - (product.product?.quantity || 1)))}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center">{product.quantity.toFixed(2)}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, product.quantity + (product.product?.quantity || 1))}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleFavorite}
            className="hidden sm:block p-2 text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="hidden sm:block p-2 text-red-600 hover:bg-red-50 rounded-full"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </li>
  );
}

export default function ShoppingList() {
  const { 
    items, 
    isLoading, 
    error, 
    deleteItem, 
    updateItem,
    fetchNextPage,
    hasMore,
    isFetchingNextPage
  } = useShoppingList();

  const { loadingRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore,
    isLoading: isFetchingNextPage,
  });

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateItem({ id, data: { quantity } });
  };

  if (isLoading) return <CardLoader text="Loading shopping list..." />;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Shopping List</h1> */}
      {items.length === 0 ? (
        <p className="text-gray-500">Your shopping list is empty</p>
      ) : (
        <div className="space-y-2">
          <ul className="space-y-2">
            {items.map((item) => (
              <ShoppingListItem
                key={item._id}
                product={item}
                onDelete={deleteItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </ul>
          
          {/* Infinite scroll loading indicator */}
          {hasMore && (
            <div ref={loadingRef}>
              <InfiniteScrollLoader text="Loading more items..." />
            </div>
          )}
          
          {/* No more items message */}
          {!hasMore && items.length > 0 && (
            <div className="flex justify-center py-4">
              <span className="text-gray-500 text-sm">No more items to load</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
