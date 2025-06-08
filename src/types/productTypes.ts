// src/types/types.ts
type MongoDBObjectId = {
  $oid: string;
};

export type StorePrice = {
  price_per_item: string;
  price_per_unit: string;
};

export type Product = {
  id: string | MongoDBObjectId;
  // id: string | MongoDBObjectId;
  name: string;
  brand?: string;
  img: string;
  unit: string;
  quantity: string;
  categories: string[];
  nutriscore?: string;

  // voeg dit toe:
  price_per_store?: {
    [storeName: string]: StorePrice;
  };
};

export type Products = Product[];

export type Category = {
  _id: string;
  name: string;
  slug: string;
  color: string;
};
