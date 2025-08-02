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

const categories = [
  { name: "All Categories", href: "/products" },
  { name: "Power Tools", href: "/products?category=power-tools" },
  { name: "Safety Equipment", href: "/products?category=safety-equipment" },
  { name: "Machinery", href: "/products?category=machinery" },
  { name: "Electronics", href: "/products?category=electronics" },
  { name: "Materials", href: "/products?category=materials" },
];

export function Header() {
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-24 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <Button
                  type="button"
                  onClick={() => setIsVisualSearchOpen(true)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Visual Search
                </Button>
              </form>
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
                <SheetContent side="left" className="w-72">
                  <div className="flex flex-col space-y-4">
                    <Link href="/">
                      <h2 className="text-xl font-bold text-primary">IndustrialSource</h2>
                    </Link>
                    
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </form>
                    
                    <Button
                      onClick={() => setIsVisualSearchOpen(true)}
                      className="w-full"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Visual Search
                    </Button>

                    <nav className="flex flex-col space-y-2">
                      <Link href="/">
                        <Button variant="ghost" className="w-full justify-start">
                          Home
                        </Button>
                      </Link>
                      <Link href="/products">
                        <Button variant="ghost" className="w-full justify-start">
                          Products
                        </Button>
                      </Link>
                      <Link href="/news">
                        <Button variant="ghost" className="w-full justify-start">
                          News
                        </Button>
                      </Link>
                      <Link href="/cart">
                        <Button variant="ghost" className="w-full justify-start">
                          Cart ({state.itemCount})
                        </Button>
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/products">
                  <Button variant="ghost" className={location === "/products" ? "bg-gray-100" : ""}>
                    Products
                  </Button>
                </Link>
                
                <Link href="/news">
                  <Button variant="ghost" className={location === "/news" || location.startsWith("/news/") ? "bg-gray-100" : ""}>
                    News
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
                  <span className="text-gray-700 hover:text-primary font-medium whitespace-nowrap cursor-pointer">
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
