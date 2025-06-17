import { Product } from './productTypes';

export type Favourite = {
  id: string;
  product_id: string | { $oid: string };
  product?: Product;
  user_id: string;
  created_at: string;
  updated_at: string;
};
