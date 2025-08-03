import React, { useState } from "react";
import { 
  Phone, 
  MessageCircle, 
  ShoppingCart, 
  Headphones, 
  Mail,
  MapPin,
  Plus,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useCart } from "@/components/cart/cart-context";

export function MobileFloatingActions() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [, navigate] = useLocation();
  const { state } = useCart();
  const cartItemCount = state.itemCount;

  const actionItems = [
    {
      icon: Phone,
      label: "Gọi điện",
      action: () => window.open("tel:+84909296297", "_self"),
      bgColor: "bg-green-500",
      delay: 0.1,
    },
    {
      icon: MessageCircle,
      label: "Zalo Chat",
      action: () => window.open("https://zalo.me/0909296297", "_blank"),
      bgColor: "bg-blue-500",
      delay: 0.2,
    },
    {
      icon: Mail,
      label: "Email",
      action: () => window.open("mailto:info@xuanphongsolar.com", "_self"),
      bgColor: "bg-purple-500",
      delay: 0.3,
    },
    {
      icon: MapPin,
      label: "Địa chỉ",
      action: () => window.open("https://maps.google.com/", "_blank"),
      bgColor: "bg-red-500",
      delay: 0.4,
    },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      {/* Main floating action items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="flex flex-col items-end space-y-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {actionItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  item.action();
                  setIsExpanded(false);
                }}
                className={`${item.bgColor} text-white p-3 rounded-full shadow-lg flex items-center space-x-2 min-w-0`}
                initial={{ 
                  x: 50, 
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  scale: 1
                }}
                exit={{ 
                  x: 50, 
                  opacity: 0,
                  scale: 0.5
                }}
                transition={{ 
                  delay: item.delay,
                  type: "spring",
                  stiffness: 200
                }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium pr-1">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-orange-500 text-white p-4 rounded-full shadow-lg relative"
        whileTap={{ scale: 0.9 }}
        animate={{ 
          rotate: isExpanded ? 45 : 0,
          boxShadow: isExpanded 
            ? "0 8px 32px rgba(0,0,0,0.3)" 
            : "0 4px 16px rgba(0,0,0,0.2)"
        }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {isExpanded ? <X size={24} /> : <Plus size={24} />}
      </motion.button>
    </div>
  );
}

// Separate cart floating button
export function MobileCartButton() {
  const [, navigate] = useLocation();
  const { state } = useCart();
  const cartItemCount = state.itemCount;

  if (cartItemCount === 0) return null;

  return (
    <motion.div
      className="fixed bottom-20 left-4 z-50 md:hidden"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <motion.button
        onClick={() => navigate("/cart")}
        className="bg-orange-500 text-white p-4 rounded-full shadow-lg relative"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <ShoppingCart size={24} />
        
        {/* Cart badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
        >
          {cartItemCount > 9 ? "9+" : cartItemCount}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

// Quick call button with pulse animation
export function QuickCallButton() {
  return (
    <motion.div
      className="fixed top-1/2 right-0 z-40 md:hidden transform -translate-y-1/2"
      initial={{ x: 60 }}
      animate={{ x: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.button
        onClick={() => window.open("tel:+84909296297", "_self")}
        className="bg-green-500 text-white px-4 py-6 rounded-l-full shadow-lg flex items-center"
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(34, 197, 94, 0.7)",
            "0 0 0 10px rgba(34, 197, 94, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <Phone size={20} />
        <span className="ml-2 text-sm font-medium">Hotline</span>
      </motion.button>
    </motion.div>
  );
}