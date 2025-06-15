// src/types/types.ts
type MongoDBObjectId = {
  $oid: string;
};

export interface StorePrice {
  price_per_item: string;
  price_per_unit: string;
  unit: string;
}

export interface PriceData {
  [store: string]: StorePrice;
}

export interface Product {
  _id: string | MongoDBObjectId;
  id: string;
  name: string;
  brand: string;
  img?: string;
  price_per_store: PriceData;
  unit: string;
  quantity: number;
  nutriscore?: string;
  categories: Array<{
    id: string;
    name: string;
  }>;
}

export type Products = Product[];

export type Category = {
  _id: string;
  name: string;
  slug: string;
  color: string;
};

export interface PriceComparison {
  product_id: string;
  product_name: string;
  cheapest_store: string;
  cheapest_price_per_item: string;
  all_prices: PriceData;
}
