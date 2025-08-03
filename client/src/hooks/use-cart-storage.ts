import { useEffect, useCallback } from "react";

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

const CART_STORAGE_KEY = "cart_items_local";

export function useCartStorage() {
  // Lưu giỏ hàng vào localStorage
  const saveCartToStorage = useCallback((cartState: CartState) => {
    try {
      const cartData = {
        items: cartState.items,
        itemCount: cartState.itemCount,
        total: cartState.total,
        timestamp: Date.now(), // Lưu timestamp để kiểm tra độ mới của dữ liệu
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, []);

  // Load giỏ hàng từ localStorage
  const loadCartFromStorage = useCallback((): CartState | null => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) return null;

      const cartData = JSON.parse(savedCart);
      
      // Kiểm tra dữ liệu có hợp lệ không
      if (!cartData.items || !Array.isArray(cartData.items)) {
        return null;
      }

      return {
        items: cartData.items,
        itemCount: cartData.itemCount || 0,
        total: cartData.total || 0,
      };
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return null;
    }
  }, []);

  // Xóa giỏ hàng khỏi localStorage
  const clearCartStorage = useCallback(() => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart from localStorage:", error);
    }
  }, []);

  // Kiểm tra xem có dữ liệu giỏ hàng trong localStorage không
  const hasStoredCart = useCallback((): boolean => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return !!savedCart;
    } catch (error) {
      return false;
    }
  }, []);

  return {
    saveCartToStorage,
    loadCartFromStorage,
    clearCartStorage,
    hasStoredCart,
  };
}