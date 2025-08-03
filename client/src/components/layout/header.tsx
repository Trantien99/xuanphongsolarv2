import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Camera, User, ShoppingCart, Menu, X } from "lucide-react";
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
                <Camera className="h-4 w-4 mr-2" />
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
            <nav className="flex space-x-8 py-3 overflow-x-auto">
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
