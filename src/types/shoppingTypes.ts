import { Product } from "./productTypes";

// export type ShoppingItem = {
//   _id: string;
//   // id: string;
//   name: string;
//   quantity: number;
//   unit: string;
//   product_id: string;
//   checked: boolean;
// };

export type ShoppingListState = {
  items: ShoppingListItem[];
  loading: boolean;
  error: string | null;
};

export type ShoppingListItem = {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit: string;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShoppingList = ShoppingListItem[];

export type AddToShoppingListInput = {
  productId: string;
  quantity: number;
  unit: string;
};

export type UpdateShoppingListItemInput = {
  itemId: string;
  quantity?: number;
  unit?: string;
  checked?: boolean;
};
