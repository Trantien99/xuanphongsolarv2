import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductService } from "@/service/product.service";
import { useTranslation } from "@/lib/i18n";
import PageModel from "@/model/page.model";
import Product from "@/model/product.model";
import { Badge } from "../ui/badge";
import { set } from "date-fns";
import { on } from "events";
import { AppUtils } from "@/utils/AppUtils";

interface AutocompleteSearchProps {
  placeholder?: string;
  className?: string;
}

export function AutocompleteSearch({
  placeholder = "Tìm kiếm sản phẩm...",
  className = ""
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<PageModel<Product>>(new PageModel<Product>());
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const ITEMS_PER_PAGE = 10;

  // Fetch search results when query changes
  // const { data: searchResultsData, isLoading, isFetching } = useQuery<{ products: Product[]; total: number }>({
  //   queryKey: ["search-products", query, currentPage],
  //   queryFn: async () => {
  //     if (!query.trim()) return { products: [], total: 0 };
  //     const searchModel = {
  //       filter: {},
  //       page: currentPage,
  //       pageSize: ITEMS_PER_PAGE,
  //       search: query.trim(),
  //     };
  //     const result = await ProductService.findByCondition(searchModel);
  //     return {
  //       products: Array.isArray(result.data) ? result.data : [],
  //       total: result.total || 0,
  //     };
  //   },
  //   enabled: query.trim().length >= 2,
  // });

  const onSearch = () => {
    setIsFetching(true);
    ProductService.findByCondition({
      filter: {
        name: query.trim(),
      },
      page: page.pageIndex,
      pageSize: ITEMS_PER_PAGE
    }).then(res => {
      setPage({
        pageIndex: res.page,
        pageSize: res.pageSize,
        total: res.total || 0,
        data: res.data || []
      });
      setIsFetching(false);
    });
  }

  useEffect(() => {
    onSearch();
  }, [query]);

  // Update all results when new data comes in
  // useEffect(() => {
  //   if (searchResultsData) {
  //     setAllResults(prev => {
  //       const newResults = currentPage === 1 ? searchResultsData.products : [...prev, ...searchResultsData.products];
  //       // Check if there are more results
  //       setHasMore(newResults.length < searchResultsData.total);
  //       return newResults;
  //     });
  //   }
  // }, [searchResultsData, currentPage]);

  // Reset pagination when query changes
  // useEffect(() => {
  //   if (query.trim().length >= 2) {
  //     setCurrentPage(1);
  //     setAllResults([]);
  //     setHasMore(true);
  //   }
  // }, [query]);

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !isFetching) {
      // setCurrentPage(prev => prev + 1);
      setPage(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
      onSearch();
    }
  }, [hasMore, isFetching]);

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
    localStorage.setItem("searchQuery", value);
    setQuery(value);
    setIsOpen(value.trim().length >= 2);
  };

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(finalQuery.trim())}&title=${encodeURIComponent(t('products.searchResults'))}`);
      setIsOpen(false);
      setQuery("");
      setHasMore(true);
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    navigate(`/products/${product.id}`);
    setIsOpen(false);
    setQuery("");
    setHasMore(true);
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
    setHasMore(true);
    inputRef.current?.focus();
  };

  return (
    <>
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
            className={`pl-10 pr-10 ${location.pathname == '/solar-energy' ? "focus:border-yellow-600 focus:ring-yellow-600" : ""}`}
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
            {isFetching && page.pageIndex === 1 ? (
              <div className="p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 py-3">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : page.data.length > 0 ? (
              <div className="py-2" ref={dropdownRef} onScroll={handleScroll}>
                {/* Search All Results Option */}
                <div
                  onClick={() => handleSearch()}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Tìm kiếm tất cả cho "<strong>{query}</strong>" ({page?.total || 0} kết quả)
                    </span>
                  </div>
                </div>

                {/* Product Results */}
                {page.data.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.imageUrls?.[0] || '/placeholder-image.jpg'}
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
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-semibold text-green-600">
                          {AppUtils.calculateDiscountString(product.price, product?.discount?.value || 0, product?.discount?.type || '')}
                        </span>
                        {product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {AppUtils.formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading more indicator */}
                {isFetching && page.pageIndex > 1 && (
                  <div className="px-4 py-2 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Đang tải thêm...</span>
                  </div>
                )}

                {/* End of results indicator */}
                {!hasMore && page.data.length > 0 && (
                  <div className="px-4 py-2 text-center text-xs text-gray-400 border-t border-gray-100">
                    Đã hiển thị tất cả kết quả
                  </div>
                )}
              </div>
            ) : query.trim().length >= 2 && !isFetching ? (
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
      <Button
        type="button"
        className={`absolute inset-y-0 right-0 flex items-center px-3 py-2 text-white rounded-r-lg transition-colors z-10 hidden md:flex ${location.pathname == '/solar-energy' ? "bg-yellow-600" : "bg-primary"}`}
        onClick={() => handleSearch()}
      >
        <Search className="h-4 w-4 mr-2" />
        {t('nav.visualSearch')}
      </Button>
      <Button
        className="w-full md:hidden"
        onClick={() => handleSearch()}
      >
        <Search className="h-4 w-4 mr-2" />
        {t('nav.visualSearch')}
      </Button>
    </>
  );
}