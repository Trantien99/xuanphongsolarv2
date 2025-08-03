import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductGrid } from "@/components/product/product-grid";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTitle } from "@/hooks/use-title";
import type { Product, Category } from "@shared/schema";

export default function Products() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/products/:slug");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  
  // Set dynamic title
  useTitle("pageTitle.products");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category") || "";
    const search = urlParams.get("search") || "";
    
    setSelectedCategory(category);
    setSearchQuery(search);
  }, [location]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("categoryId", getCategoryId(selectedCategory));
      if (searchQuery) params.append("search", searchQuery);
      
      return fetch(`/api/products?${params.toString()}`).then(res => res.json());
    },
  });

  const getCategoryId = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    return category?.id || "";
  };

  const getCategoryName = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    return category?.name || "All Products";
  };

  // Filter products based on local filters
  const filteredProducts = products.filter(product => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    
    if (priceRange) {
      const price = parseFloat(product.price);
      switch (priceRange) {
        case "under-50":
          return price < 50;
        case "50-200":
          return price >= 50 && price <= 200;
        case "200-500":
          return price >= 200 && price <= 500;
        case "over-500":
          return price > 500;
        default:
          return true;
      }
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      default: // popular
        return b.reviewCount - a.reviewCount;
    }
  });

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).sort();

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange("");
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-2">
          {[
            { value: "under-50", label: "Under $50" },
            { value: "50-200", label: "$50 - $200" },
            { value: "200-500", label: "$200 - $500" },
            { value: "over-500", label: "Over $500" },
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="priceRange"
                value={option.value}
                checked={priceRange === option.value}
                onChange={(e) => setPriceRange(e.target.value)}
                className="text-primary"
              />
              <span className="text-sm text-gray-600">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      {uniqueBrands.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Brand</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uniqueBrands.map(brand => (
              <label key={brand} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                />
                <span className="text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {selectedCategory ? getCategoryName(selectedCategory) : "All Products"}
          </h1>
          {searchQuery && (
            <p className="text-base sm:text-lg text-gray-600">
              Search results for "{searchQuery}"
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-sm sm:text-base text-gray-600">
                  Showing {sortedProducts.length} of {products.length} products
                </span>
                
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-gray-300 rounded-lg self-center">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            <ProductGrid products={sortedProducts} isLoading={isLoading} />

            {/* Pagination */}
            {sortedProducts.length > 24 && (
              <div className="flex justify-center mt-8 sm:mt-12">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <span className="px-2 text-gray-500">...</span>
                  <Button variant="outline" size="sm">10</Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
