import { Product } from './productTypes';

export interface Favourite {
  _id: string;
  user_id: string;
  product: Product;
  created_at: string;
  updated_at: string;
} 