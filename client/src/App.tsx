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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
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
          </div>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
