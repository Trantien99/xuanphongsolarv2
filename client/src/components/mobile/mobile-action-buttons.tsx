import React from "react";
import { Phone, MessageCircle, ShoppingCart, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useCart } from "@/components/cart/cart-context";

interface ActionButton {
  icon: React.ComponentType<any>;
  label: string;
  action: () => void;
  bgColor: string;
  textColor: string;
  badge?: number;
}

export function MobileActionButtons() {
  const [, navigate] = useLocation();
  const { state } = useCart();
  const cartItemCount = state.itemCount;

  const actionButtons: ActionButton[] = [
    {
      icon: Phone,
      label: "Hotline",
      action: () => window.open("tel:+84909296297", "_self"),
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    {
      icon: MessageCircle,
      label: "Zalo",
      action: () => window.open("https://zalo.me/0909296297", "_blank"),
      bgColor: "bg-blue-500", 
      textColor: "text-white",
    },
    {
      icon: ShoppingCart,
      label: "Giỏ hàng",
      action: () => navigate("/cart"),
      bgColor: "bg-orange-500",
      textColor: "text-white",
      badge: cartItemCount,
    },
    {
      icon: Headphones,
      label: "Hỗ trợ",
      action: () => window.open("tel:+84968575857", "_self"),
      bgColor: "bg-purple-500",
      textColor: "text-white",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[50] md:hidden">
      {/* Overlay background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      
      {/* Action buttons container */}
      <div className="relative bg-white border-t border-gray-200 px-2 py-2 safe-area-pb shadow-lg">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          {actionButtons.map((button, index) => (
            <motion.button
              key={index}
              onClick={button.action}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Button background with icon */}
              <div className={`relative ${button.bgColor} ${button.textColor} p-3 rounded-full shadow-lg mb-1`}>
                <button.icon size={20} />
                
                {/* Badge for cart items */}
                {button.badge && button.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {button.badge > 9 ? "9+" : button.badge}
                  </motion.div>
                ) || ''}
              </div>
              
              {/* Button label */}
              <span className="text-xs text-gray-600 font-medium">
                {button.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Additional floating call button (prominent call-to-action)
export function FloatingCallButton() {
  return (
    <motion.div
      className="fixed right-4 bottom-20 z-[55] md:hidden"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={() => window.open("tel:+84909296297", "_self")}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(34, 197, 94, 0.7)",
            "0 0 0 10px rgba(34, 197, 94, 0)",
            "0 0 0 20px rgba(34, 197, 94, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <Phone size={24} />
      </motion.button>
    </motion.div>
  );
}