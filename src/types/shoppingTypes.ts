export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
};

export type ShoppingListState = {
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;
};
