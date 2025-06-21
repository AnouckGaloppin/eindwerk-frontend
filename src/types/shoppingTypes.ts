import { Product } from "./productTypes";

export type ShoppingListState = {
  items: ShoppingListItem[];
  loading: boolean;
  error: string | null;
};

export type RawShoppingListItem = {
  _id: string | { $oid: string };
  product_id: string | { $oid: string };
  product: Product;
  quantity: string | number;
  unit: string;
  created_at: string;
  updated_at: string;
};

export interface ShoppingListItem {
  _id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export type ShoppingList = ShoppingListItem[];

export interface AddToShoppingListInput {
  productId: string;
  quantity: number;
  unit: string;
}

export interface UpdateShoppingListItemInput {
  id: string;
  data: Partial<ShoppingListItem>;
}
