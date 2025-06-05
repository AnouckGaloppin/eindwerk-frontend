// src/types/types.ts
export type Product = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
};

export type Products = Product[];

export type Category = {
  id: number | string;
  name: string;
  slug: string;
  color: string;
};
