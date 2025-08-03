import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Camera, User, ShoppingCart, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-context";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { VisualSearchModal } from "@/components/search/visual-search-modal";
import { AutocompleteSearch } from "@/components/search/autocomplete-search";
import { useTranslation } from "@/lib/i18n";

const categories = [
  { name: "Tất cả danh mục", href: "/products", highlight: false },
  { name: "Công cụ điện", href: "/products?category=power-tools", highlight: false },
  { name: "Thiết bị an toàn", href: "/products?category=safety-equipment", highlight: false },
  { name: "Năng lượng mặt trời", href: "/solar-energy", highlight: true },
  { name: "Máy móc", href: "/products?category=machinery", highlight: false },
  { name: "Thiết bị điện tử", href: "/products?category=electronics", highlight: false },
  { name: "Vật liệu", href: "/products?category=materials", highlight: false },
];

interface Category {
  name: string;
  href: string;
  highlight: boolean;
}

function MobileCategoryMenu({ categories }: { categories: Category[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Hiển thị 4 items per page để có thể fit 2 hàng x 2 items
  const itemsPerPage = 2;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  
  // Lấy items cho trang hiện tại
  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    return categories.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="relative">
      <div 
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <div key={pageIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-2 gap-2">
                {categories
                  .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                  .map((category: Category) => (
                    <Link key={category.name} href={category.href}>
                      <div className={`p-2 rounded-lg border text-center text-xs font-medium transition-colors ${
                        category.highlight 
                          ? "bg-yellow-50 border-yellow-200 text-yellow-700" 
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}>
                        {category.name}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots and next button */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>
        
        {currentPage < totalPages - 1 && (
          <button
            onClick={nextPage}
            className="flex items-center text-xs text-primary font-medium"
          >
            Xem thêm
            <ChevronRight className="h-3 w-3 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}

export function Header() {
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const { state } = useCart();
  const { t } = useTranslation();

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[51]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">
                  IndustrialSource
                </h1>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
              <AutocompleteSearch 
                placeholder={t('nav.searchPlaceholder')}
                className="w-full"
              />
              <Button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="absolute inset-y-0 right-0 flex items-center px-3 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition-colors z-10"
              >
                <Search className="h-4 w-4 mr-2" />
                {t('nav.visualSearch')}
              </Button>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 mobile-menu-height overflow-y-auto mobile-safe-bottom">
                  <div className="flex flex-col space-y-4 h-full">
                    <Link href="/">
                      <h2 className="text-xl font-bold text-primary">IndustrialSource</h2>
                    </Link>
                    
                    {/* Mobile Search */}
                    <AutocompleteSearch 
                      placeholder={t('nav.searchPlaceholder')}
                      className="w-full"
                    />
                    
                    <Button
                      onClick={() => setIsVisualSearchOpen(true)}
                      className="w-full"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {t('nav.visualSearch')}
                    </Button>

                    <nav className="flex flex-col space-y-2 flex-1">
                      <Link href="/">
                        <Button variant="ghost" className="w-full justify-start">
                          {t('nav.home')}
                        </Button>
                      </Link>
                      <Link href="/products">
                        <Button variant="ghost" className="w-full justify-start">
                          {t('nav.products')}
                        </Button>
                      </Link>
                      <Link href="/news">
                        <Button variant="ghost" className="w-full justify-start">
                          {t('nav.news')}
                        </Button>
                      </Link>
                      <Link href="/cart">
                        <Button variant="ghost" className="w-full justify-start">
                          {t('nav.cart')} ({state.itemCount})
                        </Button>
                      </Link>
                    </nav>

                    {/* Categories section */}
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Danh mục sản phẩm</h3>
                      <div className="space-y-1">
                        {categories.slice(1).map((category) => (
                          <Link key={category.name} href={category.href}>
                            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                              {category.name}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/products">
                  <Button variant="ghost" className={location === "/products" ? "bg-gray-100" : ""}>
                    {t('nav.products')}
                  </Button>
                </Link>
                
                <Link href="/news">
                  <Button variant="ghost" className={location === "/news" || location.startsWith("/news/") ? "bg-gray-100" : ""}>
                    {t('nav.news')}
                  </Button>
                </Link>
                
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {state.itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {state.itemCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 py-3 overflow-x-auto">
              {categories.map((category) => (
                <Link key={category.name} href={category.href}>
                  <span className={`font-medium whitespace-nowrap cursor-pointer ${
                    category.highlight 
                      ? "text-yellow-600 hover:text-yellow-700 font-semibold" 
                      : "text-gray-700 hover:text-primary"
                  }`}>
                    {category.name}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation - 2 rows with swipe support */}
            <div className="md:hidden py-2">
              <MobileCategoryMenu categories={categories} />
            </div>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <VisualSearchModal 
        isOpen={isVisualSearchOpen} 
        onClose={() => setIsVisualSearchOpen(false)} 
      />
    </>
  );
}
