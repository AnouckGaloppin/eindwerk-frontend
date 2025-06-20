import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const formatQuantity = (quantity: number): string => {
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    return '0.00';
  }
  return quantity.toFixed(2);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to get string ID from either string or MongoDB ObjectId
export const getStringId = (id: string | { $oid: string }): string => {
  if (typeof id === 'object' && id !== null && '$oid' in id) {
    return id.$oid;
  }
  return id;
};

// Helper function to generate URL-friendly slug from product name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}; 