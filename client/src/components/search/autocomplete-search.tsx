import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface AutocompleteSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function AutocompleteSearch({ 
  onSearch, 
  placeholder = "Tìm kiếm sản phẩm...",
  className = ""
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch search results when query changes
  const { data: searchResults = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { search: query }],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=8`);
      if (!response.ok) throw new Error("Failed to search products");
      return response.json();
    },
    enabled: query.trim().length >= 2,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length >= 2);
  };

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(finalQuery.trim())}`);
      setIsOpen(false);
      setQuery("");
      onSearch?.(finalQuery.trim());
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setLocation(`/products/${product.slug}`);
    setIsOpen(false);
    setQuery("");
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg border">
          {isLoading ? (
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {/* Search All Results Option */}
              <div
                onClick={() => handleSearch()}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Tìm kiếm tất cả cho "<strong>{query}</strong>"
                  </span>
                </div>
              </div>

              {/* Product Results */}
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.images?.[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {product.brand}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-semibold text-green-600">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Không tìm thấy sản phẩm nào cho "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">
                Hãy thử tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}