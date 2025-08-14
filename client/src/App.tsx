import { Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/cart/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileActionButtons, FloatingCallButton } from "@/components/mobile/mobile-action-buttons";
import { MobileFloatingActions, MobileCartButton, QuickCallButton } from "@/components/mobile/mobile-floating-actions";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import { ConsultationPopup } from "./components/product/consultation-popup";
import { useEffect, Suspense, lazy, useState } from "react";
import { CategoryService } from "./service/category.service";
import { ErrorBoundary } from "react-error-boundary";
import { routePreloader } from "./lib/route-preloader";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import type { Category } from "@/model/category.model";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/home"));
const Products = lazy(() => import("@/pages/products"));
const ProductDetail = lazy(() => import("@/pages/product-detail"));
const Cart = lazy(() => import("@/pages/cart"));
const Checkout = lazy(() => import("@/pages/checkout"));
const News = lazy(() => import("@/pages/news"));
const NewsDetail = lazy(() => import("@/pages/news-detail"));
const SolarEnergyLanding = lazy(() => import("@/pages/solar-energy"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component for lazy loaded routes
function PageLoader() {
  return <PageLoadingSpinner text="Đang tải trang..." />;
}

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Có lỗi xảy ra</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}

function AppRoutes({ categories }: { categories: Category[] }) {
  // Auto scroll to top when route changes
  useScrollToTop('instant');

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home categories={categories} />} />
          <Route path="/products" element={<Products categories={categories} />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/solar-energy" element={<SolarEnergyLanding />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load categories
    CategoryService.findByCondition({ filter: { status: '=ACTIVE' }, page: 1, pageSize: 100 }).then(res => {
      console.log('CategoryService.findByCondition', res);
      const loadedCategories = [...(res?.data || [])].map(c => ({ ...c, href: `/products?category=${c.key}` }));
      setCategories(loadedCategories);
    });

    // Preload critical routes for better performance
    routePreloader.preloadCriticalRoutes().catch(console.warn);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header categories={categories} />
            <main>
              <AppRoutes categories={categories} />
            </main>
            <Footer />

            {/* Mobile Action Buttons - Only visible on mobile */}
            <MobileActionButtons />

            {/* Scroll to top button */}
            <ScrollToTopButton />
            {/* Consultation Popup */}
            <ConsultationPopup />
          </div>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
