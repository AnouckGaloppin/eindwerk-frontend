// src/types/types.ts
type MongoDBObjectId = {
  $oid: string;
};

export type Product = {
  _id: string | MongoDBObjectId;
  id: string | MongoDBObjectId;
  name: string;
  description?: string;
  category_id: string;
  price_per_item: number | { $numberDecimal: string };
  price_per_kg?: string;
  standard_unit: string;
  quantity: string;
  img?: string;
  winkel_id?: string;
};

export type Products = Product[];

export type Category = {
  _id: string;
  name: string;
  slug: string;
  color: string;
};
