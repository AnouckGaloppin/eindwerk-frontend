"use client";

import { FC, useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import api from "@/lib/axios";
import type { Product } from "@/types/productTypes";

interface SearchBarProps {
  className?: string;
}

const SearchBar: FC<SearchBarProps> = ({ className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // Debounce search query to prevent too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Get lowest price from a product's price_per_store
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

  // Handle clicks outside the search dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results when debounced query changes
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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      // If we have a selected item in the dropdown, navigate to its detail page
      if (isDropdownVisible && selectedIndex >= 0 && searchResults[selectedIndex]) {
        const product = searchResults[selectedIndex];
        const productId = typeof product._id === 'object' && product._id !== null && '$oid' in product._id 
          ? product._id.$oid 
          : typeof product.id === 'string' 
            ? product.id 
            : String(product._id);
        handleProductSelect(productId);
      } 
      // If no item is selected or dropdown is not visible, perform search
      else if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        handleCloseDropdown();
      }
      return;
    }

    // Handle other navigation keys only when dropdown is visible
    if (!isDropdownVisible) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case "Escape":
        e.preventDefault();
        handleCloseDropdown();
        break;
    }
  };

  const handleProductSelect = (productId: string) => {
    router.push(`/products/${productId}`);
    handleCloseDropdown();
  };

  const handleCloseDropdown = () => {
    setIsDropdownVisible(false);
    setSelectedIndex(-1);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  return (
    <div 
      ref={searchRef}
      className={`relative ${className}`}
      role="search"
      aria-label="Search products"
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products..."
          className="w-full pl-4 pr-12 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 border border-white/20 shadow-md transition-all duration-300 ease-in-out focus:ring-2 focus:ring-white/50 focus:outline-none"
          aria-expanded={isDropdownVisible}
          aria-controls="search-results"
          aria-describedby={isLoading ? "search-loading" : undefined}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isDropdownVisible && (
        <div 
          id="search-results"
          className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200"
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
                const productId = typeof product._id === 'object' && product._id !== null && '$oid' in product._id 
                  ? product._id.$oid 
                  : typeof product.id === 'string' 
                    ? product.id 
                    : String(product._id);
                
                return (
                  <li 
                    key={productId}
                    className={`border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex ? 'bg-indigo-50' : ''
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 focus:outline-none focus:bg-indigo-50"
                      onClick={() => handleProductSelect(productId)}
                    >
                      <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden">
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        {product.brand && (
                          <p className="text-sm text-gray-500 truncate">{product.brand}</p>
                        )}
                      </div>
                      {lowestPrice && (
                        <div className="flex-shrink-0 text-right">
                          <p className="font-medium text-indigo-600">
                            €{lowestPrice.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">{lowestPrice.store}</p>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
