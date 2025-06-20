"use client";

import { FC, useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import api from "@/lib/axios";
import type { Product } from "@/types/productTypes";
import { generateSlug } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
}

const SearchBar: FC<SearchBarProps> = ({ className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
        setIsMobileExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/api/products/search?q=${encodeURIComponent(debouncedSearchQuery)}&limit=5`);
        setSearchResults(response.data.products);
        setIsDropdownVisible(true);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);

  const handleFocus = () => {
    if (window.innerWidth < 640) {
      setIsMobileExpanded(true);
    }
  };

  const handleClose = () => {
    setIsMobileExpanded(false);
    setIsDropdownVisible(false);
    setSelectedIndex(-1);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isDropdownVisible && selectedIndex >= 0 && searchResults[selectedIndex]) {
        const product = searchResults[selectedIndex];
        handleProductSelect(product);
      } else if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        handleClose();
      }
      return;
    }

    if (!isDropdownVisible) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => prev < searchResults.length - 1 ? prev + 1 : prev);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case "Escape":
        e.preventDefault();
        handleClose();
        break;
    }
  };

  const handleProductSelect = (product: any) => {
    if (product.name) {
      router.push(`/products/${generateSlug(product.name)}`);
    } else {
      // Fallback to product ID if name is not available
      const productId = typeof product._id === 'object' && product._id !== null && '$oid' in product._id 
        ? product._id.$oid 
        : typeof product.id === 'string' 
          ? product.id 
          : String(product._id);
      router.push(`/products/${productId}`);
    }
    handleClose();
  };

  const getLowestPrice = (pricePerStore?: { [storeName: string]: { price_per_item: string } }) => {
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
    <div ref={searchRef} className={`relative flex-grow sm:flex-grow-0 ${className}`}>
      {/* Regular Search Bar (Desktop / Mobile-Collapsed) */}
      <div className={`relative ${isMobileExpanded ? 'hidden sm:flex' : 'flex'} justify-center`}>
        <div className="relative w-full sm:w-1/2">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Search for products..."
            className="w-full pl-4 pr-12 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 border border-white/20 shadow-md transition-all duration-300 ease-in-out focus:ring-2 focus:ring-white/50 focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Mobile Expanded Search */}
      {isMobileExpanded && (
        <div className="fixed inset-x-0 top-0 p-2 bg-gradient-to-r from-indigo-500 to-teal-500 sm:hidden z-50">
          <div className="relative">
            <button
              onClick={handleClose}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for products..."
              className="w-full pl-12 pr-12 py-4 text-lg rounded-lg bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 border border-white/20 shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
              <Search className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isDropdownVisible && (
        <div 
          className={`
            absolute mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-40
            ${isMobileExpanded 
              ? 'fixed top-16 left-2 right-2' 
              : 'w-full sm:w-1/2 top-full sm:left-1/2 sm:-translate-x-1/2'
            }
          `}
          role="listbox"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((product, index) => {
                const lowestPrice = getLowestPrice(product.price_per_store);
                
                return (
                  <li 
                    key={typeof product._id === 'object' && product._id !== null && '$oid' in product._id 
                      ? product._id.$oid 
                      : String(product._id)}
                    className={`border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex ? 'bg-indigo-50' : ''
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 focus:outline-none focus:bg-indigo-50"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {product.img ? (
                          <Image
                            src={product.img}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 break-words leading-tight">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.brand || 'Unknown brand'}
                        </div>
                        {lowestPrice && (
                          <div className="text-sm text-indigo-600">
                            €{lowestPrice.price.toFixed(2)} at {lowestPrice.store}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
