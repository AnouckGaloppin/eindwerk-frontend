// "use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { Product, StorePrice } from '@/types/productTypes';
// import api from '@/lib/axios';
// import { getStringId } from '@/lib/utils';
// import router from 'next/router';

type SearchResultsProps = {
  results: Product[];
  isLoading: boolean;
  searchQuery: string;
  onClear: () => void;
  onResultClick: () => void;
};

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  searchQuery,
  onClear,
  onResultClick,
}) => {
  if (!searchQuery) return null;

  const getLowestPrice = (pricePerStore?: { [storeName: string]: StorePrice }) => {
    if (!pricePerStore || Object.keys(pricePerStore).length === 0) return null;
    
    let lowestPrice = Number.MAX_VALUE;
    let storeName = '';
    
    Object.entries(pricePerStore).forEach(([store, storePrice]) => {
      const price = parseFloat(storePrice.price_per_item);
      if (!isNaN(price) && price < lowestPrice) {
        lowestPrice = price;
        storeName = store;
      }
    });
    
    return lowestPrice === Number.MAX_VALUE ? null : { price: lowestPrice, store: storeName };
  };

  return (
    <div 
      className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200"
      role="listbox"
      id="search-results"
      aria-label={`Search results for "${searchQuery}"`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">
          {isLoading ? 'Searching...' : `Search results for "${searchQuery}"`}
        </h3>
        <button
          onClick={onClear}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
          aria-label="Clear search and close results"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {isLoading ? (
        <div 
          className="p-4 text-center"
          role="status"
          aria-live="polite"
          aria-label="Loading search results"
        >
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
            </div>
          </div>
          <span className="sr-only">Loading search results...</span>
        </div>
      ) : results.length > 0 ? (
        <ul 
          className="max-h-80 overflow-y-auto"
          role="list"
          aria-label={`${results.length} search results found`}
        >
          {results.map((product, index) => {
            const lowestPrice = getLowestPrice(product.price_per_store);
            const productId = product.id || (typeof product._id === 'object' && product._id !== null && '$oid' in product._id 
              ? product._id.$oid 
              : String(product._id));
            const uniqueKey = productId || `product-${index}`;
            
            return (
              <li 
                key={uniqueKey} 
                className="border-b border-gray-200 last:border-b-0"
                role="option"
                aria-selected="false"
              >
                <Link
                  href={`/products/${productId}`}
                  className="flex items-center p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
                  onClick={(e) => {
                    e.preventDefault();
                    onResultClick();
                    window.location.href = `/products/${productId}`;
                  }}
                  aria-label={`${product.name} by ${product.brand}${lowestPrice ? `, price €${lowestPrice.price.toFixed(2)} at ${lowestPrice.store}` : ''}`}
                >
                  <div 
                    className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden"
                    aria-hidden="true"
                  >
                    {product.img ? (
                      <Image
                        src={product.img}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  {lowestPrice && (
                    <div className="text-right">
                      <p className="font-medium text-indigo-600">
                        €{lowestPrice.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{lowestPrice.store}</p>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div 
          className="p-4 text-center text-gray-500"
          role="status"
          aria-live="polite"
        >
          <span>No products found matching "{searchQuery}"</span>
        </div>
      )}
      
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <Link
          href={`/products?search=${encodeURIComponent(searchQuery)}`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          onClick={onResultClick}
          aria-label={`View all search results for "${searchQuery}"`}
        >
          View all results
        </Link>
      </div>
    </div>
  );
};

export default SearchResults; 