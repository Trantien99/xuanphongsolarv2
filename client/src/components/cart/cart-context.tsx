import { createContext, useContext, useReducer, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";
import { useCartStorage } from "@/hooks/use-cart-storage";

interface CartItem {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    images: string[];
  } | null;
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
    const price = item.product ? parseFloat(item.product.price) : 0;
    return sum + (price * item.quantity);
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
      dispatch({ type: "SET_ITEMS", items: storedCart.items });
      console.log("Cart loaded from localStorage:", storedCart.items.length, "items");
      
      // Đồng bộ với server nếu có kết nối internet
      // Chờ một chút để đảm bảo query client đã sẵn sàng
      if (navigator.onLine) {
        setTimeout(() => {
          syncCartWithServer(storedCart.items);
        }, 1000);
      }
    }
  }, []); // Chạy một lần khi component mount

  // Cập nhật state khi nhận dữ liệu từ server
  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      dispatch({ type: "SET_ITEMS", items: cartItems });
      // Lưu vào localStorage khi nhận được dữ liệu từ server
      saveCartToStorage(calculateCartState(cartItems));
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

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", {
        sessionId,
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({ title: t("toastMessages.itemAddedToCart") });
    },
    onError: () => {
      toast({ title: t("toastMessages.failedToAddItem"), variant: "destructive" });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
    onError: () => {
      toast({ title: t("toastMessages.failedToUpdateCart"), variant: "destructive" });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("DELETE", `/api/cart/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({ title: t("toastMessages.itemRemovedFromCart") });
    },
    onError: () => {
      toast({ title: t("toastMessages.failedToRemoveItem"), variant: "destructive" });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/cart/session/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({ title: t("toastMessages.cartCleared") });
    },
    onError: () => {
      toast({ title: t("toastMessages.failedToClearCart"), variant: "destructive" });
    },
  });

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      // Thử gọi API nếu có internet
      if (navigator.onLine) {
        await addToCartMutation.mutateAsync({ productId, quantity });
      } else {
        // Nếu offline, chỉ cập nhật local state
        // Tạo một item tạm thời để hiển thị
        const tempItem: CartItem = {
          id: `temp_${Date.now()}`,
          sessionId,
          productId,
          quantity,
          product: null, // Sẽ được fetch sau khi online
        };
        
        dispatch({ type: "ADD_ITEM", item: tempItem });
        toast({ title: t("toastMessages.itemAddedToCartOffline") || "Item added to cart (offline)" });
      }
    } catch (error) {
      // Nếu API call fail, fallback về localStorage
      const tempItem: CartItem = {
        id: `temp_${Date.now()}`,
        sessionId,
        productId,
        quantity,
        product: null,
      };
      
      dispatch({ type: "ADD_ITEM", item: tempItem });
      toast({ title: t("toastMessages.itemAddedToCartOffline") || "Item added to cart (offline)" });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (navigator.onLine) {
        await updateQuantityMutation.mutateAsync({ itemId, quantity });
      } else {
        // Offline: chỉ cập nhật local state
        dispatch({ type: "UPDATE_ITEM", itemId, quantity });
        toast({ title: "Cart updated (offline)" });
      }
    } catch (error) {
      // Fallback về local update
      dispatch({ type: "UPDATE_ITEM", itemId, quantity });
      toast({ title: "Cart updated (offline)" });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (navigator.onLine) {
        await removeFromCartMutation.mutateAsync(itemId);
      } else {
        // Offline: chỉ cập nhật local state
        dispatch({ type: "REMOVE_ITEM", itemId });
        toast({ title: "Item removed (offline)" });
      }
    } catch (error) {
      // Fallback về local remove
      dispatch({ type: "REMOVE_ITEM", itemId });
      toast({ title: "Item removed (offline)" });
    }
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
    // Xóa cả localStorage khi clear cart
    clearCartStorage();
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoading,
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
