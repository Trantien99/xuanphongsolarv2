import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./cart-context";
import { Link } from "wouter";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (itemId: string, change: number) => {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;
    
    const newQuantity = Math.max(0, item.quantity + change);
    if (newQuantity === 0) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-96 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="text-lg">Shopping Cart</span>
            {/* <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button> */}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 sm:py-6">
            {state.items.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={onClose}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Image and Product Info */}
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.images[0] || "https://via.placeholder.com/100x100"}
                          alt={item.product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                          {item.product?.name || "Unknown Product"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.product?.price || "0.00"}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          Total: ${((parseFloat(item.product?.price || "0")) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between sm:justify-start sm:flex-col sm:space-y-2">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 sm:p-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-base sm:text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  ${state.total.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-2 sm:space-y-3 pb-3">
                <Link href="/cart" onClick={onClose}>
                  <Button className="w-full bg-primary hover:bg-primary/90 h-11">
                    View Cart
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full h-10"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
