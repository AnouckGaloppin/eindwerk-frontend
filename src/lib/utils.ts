import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const formatQuantity = (quantity: number): string => {
  return quantity.toFixed(2);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 