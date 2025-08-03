import { createContext, useContext, useReducer, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

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

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (cartItems) {
      dispatch({ type: "SET_ITEMS", items: cartItems });
    }
  }, [cartItems]);

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
      toast({ title: "Đã thêm vào giỏ hàng" });
    },
    onError: () => {
      toast({ title: "Không thể thêm vào giỏ hàng", variant: "destructive" });
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
      toast({ title: "Không thể cập nhật giỏ hàng", variant: "destructive" });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("DELETE", `/api/cart/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({ title: "Đã xóa khỏi giỏ hàng" });
    },
    onError: () => {
      toast({ title: "Không thể xóa sản phẩm", variant: "destructive" });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/cart/session/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({ title: "Đã xóa toàn bộ giỏ hàng" });
    },
    onError: () => {
      toast({ title: "Không thể xóa giỏ hàng", variant: "destructive" });
    },
  });

  const addToCart = async (productId: string, quantity = 1) => {
    await addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const removeFromCart = async (itemId: string) => {
    await removeFromCartMutation.mutateAsync(itemId);
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
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
