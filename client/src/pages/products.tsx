import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Search, Grid, List, Filter } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductGrid } from "@/components/product/product-grid";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination, ItemsPerPageSelector, PaginationInfo } from "@/components/ui/pagination";
import { useTitle } from "@/hooks/use-title";
import { Category } from "@/model/category.model";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { scrollToElement } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useMeta } from "@/components/seo/meta-manager";
import { ProductService } from "@/service/product.service";
import PageModel from "@/model/page.model";
import Product from "@/model/product.model";

interface ProductsProps {
  categories: Category[];
}

export default function Products({ categories }: ProductsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [pageTitle, setPageTitle] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<PageModel<Product>>(new PageModel<Product>());
  const productsRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  // const [categoryName, setCategoryName] = useState(t("allProducts"));

  // Set dynamic title
  useTitle("pageTitle.products");

  // Dynamic SEO meta tags for SPA
  const getCategoryName = (searchQuery?: string, key?: string, categories?: Category[]) => {
    // If there's a search query, show search results
    if (searchQuery) {
      return `${t('products.searchResultsFor')} "${searchQuery}"`;
    }

    // Otherwise, show category name
    if (!key) return t("allProducts");
    const category = categories?.find(c => c.key === key);
    return category?.label || t("allProducts");
  };

  useMeta({
    title: `${pageTitle} - Sản phẩm công nghiệp chất lượng cao | Xuân Phong Solar`,
    description: `Khám phá ${pageTitle?.toLowerCase()} chất lượng cao tại Xuân Phong Solar. Tìm kiếm và so sánh sản phẩm từ các thương hiệu uy tín với công nghệ tìm kiếm hình ảnh tiên tiến.`,
    keywords: `${pageTitle.toLowerCase()}, sản phẩm công nghiệp, mua sắm B2B, thiết bị chuyên nghiệp, công cụ công nghiệp`,
    ogTitle: `${pageTitle} - Sản phẩm công nghiệp | Xuân Phong Solar`,
    ogDescription: `Khám phá ${pageTitle?.toLowerCase()} chất lượng cao tại Xuân Phong Solar. Tìm kiếm và so sánh sản phẩm từ các thương hiệu uy tín.`,
    ogImage: "https://xuanphongsolar.com/og-products.jpg",
    ogUrl: window.location.href,
    canonical: window.location.href
  });

  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  console.log("Location object:", location);
  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const category = urlParams.get("category") || "";
    const search = urlParams.get("search") || "";
    const page = parseInt(urlParams.get("page") || "1");
    const perPage = parseInt(urlParams.get("per_page") || "24");
    const title = getCategoryName(search, category, categories);
    setSelectedCategory(category);
    setSearchQuery(search);
    setCurrentPage(page);
    setItemsPerPage(perPage);
    setPageTitle(title);
    getProducts({ category, search, page, perPage });
  }, [location.search]);

  const getProducts = ({ category, search, page, perPage }: { category?: string; search?: string; page?: number; perPage?: number; }) => {
    setIsFetching(true);
      // Base filter
    const filter: Record<string, any> = {};

    // Ưu tiên category được truyền vào
    if (category) {
      filter.category = [category];
    }

    // Search theo tên
    if (search) {
      filter.name = search;
    }

    // Tạo model tìm kiếm
    const searchModel = {
      filter,
      page: page ?? 1,
      pageSize: perPage ?? 24,
      search: search ?? ''
    };

    ProductService.findByCondition(searchModel).then((result) => {
      setPage({
        data: Array.isArray(result.data) ? result.data : [],
        total: result.total || 0,
        pageIndex: result.page,
        pageSize: result.pageSize
      });
      setIsFetching(false);
    });
  }

  const getCategoryId = (slug: string) => {
    const category = categories.find(c => c.key === slug);
    return category?.id || "";
  };

  // // Sort products based on selected sort option
  // const sortedProducts = [...products].sort((a, b) => {
  //   switch (sortBy) {
  //     case "price-low":
  //       return parseFloat(a.price + "" || "0") - parseFloat(b.price + "" || "0");
  //     case "price-high":
  //       return parseFloat(b.price + "" || "0") - parseFloat(a.price + "" || "0");
  //     case "name":
  //       return (a.name || "").localeCompare(b.name || "");
  //     case "rating":
  //       return parseFloat(b.rating + "" || "0") - parseFloat(a.rating + "" || "0");
  //     default: // popular
  //       return (b.reviewCount || 0) - (a.reviewCount || 0);
  //   }
  // });

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand || ""))).sort();

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

  const updateURL = (updates: { page?: number; perPage?: number; category?: string; search?: string }) => {
    const urlParams = new URLSearchParams(location.search);

    if (updates.page !== undefined) {
      if (updates.page === 1) {
        urlParams.delete("page");
      } else {
        urlParams.set("page", updates.page.toString());
      }
    }

    if (updates.perPage !== undefined) {
      if (updates.perPage === 24) {
        urlParams.delete("per_page");
      } else {
        urlParams.set("per_page", updates.perPage.toString());
      }
    }

    if (updates.category !== undefined) {
      if (updates.category) {
        urlParams.set("category", updates.category);
      } else {
        urlParams.delete("category");
      }
    }

    if (updates.search !== undefined) {
      if (updates.search) {
        urlParams.set("search", updates.search);
      } else {
        urlParams.delete("search");
      }
    }

    const newUrl = `${location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    // window.history.pushState({}, '', newUrl);

    // 👇 dùng navigate thay vì pushState
    navigate(newUrl, { replace: false }); // replace: true nếu muốn ghi đè
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page });

    // Scroll to the top of the products section with mobile optimization
    scrollToElement(productsRef.current, {
      headerOffset: 80, // Desktop offset
      mobileHeaderOffset: 100, // Extra offset for mobile to account for mobile action buttons
      delay: 150 // Slightly longer delay for mobile
    });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    updateURL({ page: 1, perPage: items });
  };

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
      updateURL({ page: 1 });
    }
  }, [selectedCategory, searchQuery, selectedBrands, priceRange]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Bộ lọc</h3>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Xóa tất cả
        </Button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Khoảng giá</h4>
        <div className="space-y-2">
          {[
            { value: "<2000000", label: "Dưới 2 triệu" },
            { value: "2000000-5000000", label: "Từ 2 - 5 triệu" },
            { value: "5000000-10000000", label: "Từ 5 - 10 triệu" },
            { value: ">10000000", label: "Trên 10 triệu" },
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
            {pageTitle}
          </h1>
          {/* {searchQuery && pageTitle && (
            <p className="text-base sm:text-lg text-gray-600">
              Kết quả tìm kiếm với "{searchQuery}"
            </p>
          )} */}
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
          <div className="lg:w-3/4" ref={productsRef}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <PaginationInfo
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={page?.total || 0}
                />

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
                <ItemsPerPageSelector
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Mới nhất</SelectItem>
                    <SelectItem value="price-low">Giá: Thấp tới cao</SelectItem>
                    <SelectItem value="price-high">Giá: Cao tới thấp</SelectItem>
                    {/* <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Đánh giá</SelectItem> */}
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
            <ProductGrid products={page?.data || []} isLoading={isFetching} />

            {/* Pagination */}
            {page?.total > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(page.total / itemsPerPage)}
                  onPageChange={handlePageChange}
                  hasMore={currentPage < page.total}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
