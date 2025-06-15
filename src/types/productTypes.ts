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
