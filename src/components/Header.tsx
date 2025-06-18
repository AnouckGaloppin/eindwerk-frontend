"use client";

import Link from "next/link";
import { LogOut, Search, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import useDebounce from "@/hooks/useDebounce";
import SearchResults from "./SearchResults";
import type { Product } from "@/types/productTypes";

const Header = () => {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // Debounce search query to prevent too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle clicks outside the search dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation for search dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownVisible) {
        setIsDropdownVisible(false);
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownVisible]);

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

  const handleLogout = async () => {
    try {
      setError("");
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsDropdownVisible(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Show dropdown if there's text, otherwise hide it
    if (value.trim()) {
      setIsLoading(true);
    } else {
      setIsDropdownVisible(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsDropdownVisible(false);
    searchInputRef.current?.focus();
  };

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-teal-500 shadow-lg text-white"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500 rounded"
          aria-label="Volovan - Go to homepage"
        >
          🛍️ Volovan
        </Link>
        
        <div
          ref={searchRef}
          className="fixed left-1/2 -translate-x-1/2 w-full max-w-md hidden sm:block"
          role="search"
          aria-label="Search products"
        >
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <label htmlFor="search-input" className="sr-only">
                Search for products
              </label>
              <input
                ref={searchInputRef}
                id="search-input"
                type="text"
                placeholder="Search for product..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => {
                  if (searchQuery.trim() && searchResults.length > 0) {
                    setIsDropdownVisible(true);
                  }
                }}
                className="w-full pl-4 pr-12 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 border border-white/20 shadow-md transition-all duration-300 ease-in-out transform group-focus-within:scale-[1.02] group-focus-within:shadow-lg group-focus-within:ring-2 group-focus-within:ring-white/50 focus:outline-none"
                aria-expanded={isDropdownVisible}
                aria-haspopup="listbox"
                aria-controls="search-results"
                aria-describedby={isLoading ? "search-loading" : undefined}
                aria-autocomplete="list"
                role="combobox"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-10 flex items-center justify-center text-gray-500 transition-colors duration-300 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
              <button
                type="submit"
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 transition-colors duration-300 group-hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          {/* Loading indicator for screen readers */}
          {isLoading && (
            <div id="search-loading" className="sr-only" aria-live="polite">
              Searching for products...
            </div>
          )}
          
          {/* Search results dropdown */}
          {isDropdownVisible && (
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onClear={clearSearch}
              onResultClick={() => setIsDropdownVisible(false)}
            />
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {error && (
            <span 
              className="text-sm text-yellow-200"
              role="alert"
              aria-live="polite"
            >
              {error}
            </span>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="hover:bg-white/10 p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500"
              aria-label="Logout from account"
            >
              <LogOut className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
