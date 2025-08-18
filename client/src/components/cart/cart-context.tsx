import { createContext, useContext, useReducer, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";
import { useCartStorage } from "@/hooks/use-cart-storage";
import { ProductService } from "@/service/product.service";
import { AppUtils } from "@/utils/AppUtils";
import Product from "@/model/product.model";

interface CartItem {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  product: Product | null;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
}

interface CartContextType {
  state: CartState;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction = 
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "UPDATE_ITEM"; itemId: string; quantity: number }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return calculateCartState(action.items);
    case "ADD_ITEM":
      return calculateCartState([...state.items, action.item]);
    case "UPDATE_ITEM":
      return calculateCartState(
        state.items.map(item => 
          item.id === action.itemId ? { ...item, quantity: action.quantity } : item
        )
      );
    case "REMOVE_ITEM":
      return calculateCartState(state.items.filter(item => item.id !== action.itemId));
    case "CLEAR_CART":
      return { items: [], itemCount: 0, total: 0 };
    default:
      return state;
  }
}

function calculateCartState(items: CartItem[]): CartState {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    if (!item.product) return sum;
    
    const price = item.product.price || 0;
    const discount = item.product.discount;
    let finalPrice = price;
    
    if (discount && discount.value > 0) {
      finalPrice = AppUtils.calculateDiscount(price, discount.value, discount.type);
    }
    
    return sum + (finalPrice * item.quantity);
  }, 0);

  return { items, itemCount, total };
}

function getSessionId(): string {
  let sessionId = localStorage.getItem("cartSessionId");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("cartSessionId", sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], itemCount: 0, total: 0 });
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  const { saveCartToStorage, loadCartFromStorage, clearCartStorage, hasStoredCart } = useCartStorage();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
    refetchOnWindowFocus: false,
  });

  // Fetch products data for cart items
  const productIds = state.items.map(item => item.productId).filter(Boolean);
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", productIds],
    queryFn: () => ProductService.getProductByIds(productIds),
    enabled: productIds.length > 0,
    refetchOnWindowFocus: false,
  });

  // Update cart items with product data
  useEffect(() => {
    if (products && Array.isArray(products) && state.items.length > 0) {
      const updatedItems = state.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          product: product || null
        };
      });
      
      // Only update if products actually changed
      if (JSON.stringify(updatedItems) !== JSON.stringify(state.items)) {
        dispatch({ type: "SET_ITEMS", items: updatedItems });
      }
    }
  }, [products, state.items]);

  // Đồng bộ localStorage với server
  const syncCartWithServer = async (localItems: CartItem[]) => {
    try {
      // Trước tiên clear cart trên server để tránh trùng lặp
      await apiRequest("DELETE", `/api/cart/session/${sessionId}`);
      
      // Sau đó gửi từng item từ localStorage lên server
      for (const item of localItems) {
        if (item.productId && item.quantity > 0) {
          await apiRequest("POST", "/api/cart", {
            sessionId,
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      }
      
      // Sau khi sync xong, refetch để có dữ liệu mới nhất từ server
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      console.log("Cart synchronized with server successfully");
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
    }
  };

  // Load giỏ hàng từ localStorage khi khởi tạo
  useEffect(() => {
    const storedCart = loadCartFromStorage();
    if (storedCart && storedCart.items.length > 0) {
      // Convert stored cart items to match new CartItem interface
      const convertedItems: CartItem[] = storedCart.items.map(item => ({
        ...item,
        product: null // Will be populated when products are fetched
      }));
      
      dispatch({ type: "SET_ITEMS", items: convertedItems });
      console.log("Cart loaded from localStorage:", convertedItems.length, "items");
      
      // Đồng bộ với server nếu có kết nối internet
      if (navigator.onLine) {
        setTimeout(() => {
          syncCartWithServer(convertedItems);
        }, 1000);
      }
    }
  }, []); // Chạy một lần khi component mount

  // Cập nhật state khi nhận dữ liệu từ server
  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      // Convert server cart items to match new CartItem interface
      const convertedItems: CartItem[] = cartItems.map(item => ({
        ...item,
        product: null // Will be populated when products are fetched
      }));
      
      dispatch({ type: "SET_ITEMS", items: convertedItems });
      // Lưu vào localStorage khi nhận được dữ liệu từ server
      saveCartToStorage(calculateCartState(convertedItems));
    }
  }, [cartItems, saveCartToStorage]);

  // Lưu vào localStorage mỗi khi state thay đổi
  useEffect(() => {
    if (state.items.length > 0 || hasStoredCart()) {
      saveCartToStorage(state);
    }
  }, [state, saveCartToStorage, hasStoredCart]);

  // Đồng bộ khi có kết nối internet trở lại
  useEffect(() => {
    const handleOnline = () => {
      const storedCart = loadCartFromStorage();
      if (storedCart && storedCart.items.length > 0) {
        syncCartWithServer(storedCart.items);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [loadCartFromStorage]);

  // Simple cart operations like in AppUtils
  const addToCart = async (productId: string, quantity = 1) => {
    try {
      // Check if product already exists in cart
      const existingItem = state.items.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update quantity if product already exists
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sessionId,
          productId,
          quantity,
          product: null, // Will be populated when products are fetched
        };
        
        dispatch({ type: "ADD_ITEM", item: newItem });
        
        // Try to sync with server if online
        if (navigator.onLine) {
          try {
            await apiRequest("POST", "/api/cart", {
              sessionId,
              productId,
              quantity,
            });
            queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
          } catch (error) {
            console.error("Failed to sync with server:", error);
          }
        }
        
        toast({ title: t("toastMessages.itemAddedToCart") || "Item added to cart" });
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast({ title: t("toastMessages.failedToAddItem") || "Failed to add item", variant: "destructive" });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await removeFromCart(itemId);
        return;
      }
      
      // Update local state first
      dispatch({ type: "UPDATE_ITEM", itemId, quantity });
      
      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
          queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
        } catch (error) {
          console.error("Failed to sync with server:", error);
        }
      }
      
      toast({ title: "Giỏ hàng được cập nhật thành công" });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast({ title: "Failed to update cart", variant: "destructive" });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      // Remove from local state first
      dispatch({ type: "REMOVE_ITEM", itemId });
      
      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          await apiRequest("DELETE", `/api/cart/${itemId}`);
          queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
        } catch (error) {
          console.error("Failed to sync with server:", error);
        }
      }
      
      toast({ title: t("toastMessages.itemRemovedFromCart") || "Item removed from cart" });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast({ title: "Failed to remove item", variant: "destructive" });
    }
  };

  const clearCart = async () => {
    try {
      // Clear local state first
      dispatch({ type: "CLEAR_CART" });
      
      // Try to sync with server if online
      if (navigator.onLine) {
        try {
          await apiRequest("DELETE", `/api/cart/session/${sessionId}`);
          queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
        } catch (error) {
          console.error("Failed to sync with server:", error);
        }
      }
      
      // Clear localStorage
      clearCartStorage();
      toast({ title: t("toastMessages.cartCleared") || "Cart cleared successfully" });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast({ title: "Failed to clear cart", variant: "destructive" });
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoading: isLoading || productsLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
