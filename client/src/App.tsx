import { Switch, Route } from "wouter";
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

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import SolarEnergyLanding from "@/pages/solar-energy";
import NotFound from "@/pages/not-found";
import { ConsultationPopup } from "./components/product/consultation-popup";
import { create } from 'zustand';
import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import { useEffect } from "react";
import { CategoryService } from "./service/category.service";

interface AppContextModel {
  categories: any[]
};

interface AppContextStore {
  data: AppContextModel | null;
  setData: (data: AppContextModel) => void;
}

export const useAppContext = create<AppContextStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));

function Router() {
  // Auto scroll to top when route changes
  useScrollToTop('instant');

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={NewsDetail} />
      <Route path="/solar-energy" component={SolarEnergyLanding} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { data } = useAppContext();
  useEffect(() => {
    CategoryService.findByCondition({ filter: { status: '=ACTIVE' }, page: 1, pageSize: 100 }).then(res => {
      console.log('CategoryService.findByCondition', res);
      useAppContext.setState({ data: { categories: [...(res?.data || [])].map(c => ({ ...c, href: `/products?category=${c.key}` })) } });
    });
    return () => {

    }
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          {
            data &&
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main>
                <Router />
              </main>
              <Footer />

              {/* Mobile Action Buttons - Only visible on mobile */}
              <MobileActionButtons />
              {/* <MobileCartButton /> */}
              {/* <QuickCallButton /> */}

              {/* Scroll to top button */}
              <ScrollToTopButton />
              {/* Consultation Popup */}
              <ConsultationPopup />
            </div>
          }
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
