import { Link } from "wouter";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-context";

export default function Cart() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();

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

  const subtotal = state.total;
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = subtotal * 0.0875; // 8.75% tax rate
  const total = subtotal + shipping + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Link href="/products">
            <Button variant="outline" className="mb-4 sm:mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại sản phẩm
            </Button>
          </Link>

          <div className="text-center py-12 sm:py-16">
            <ShoppingCart className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Giỏ hàng trống</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng.
            </p>
            <Link href="/products">
              <Button size="lg">
                Bắt đầu mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link href="/products">
          <Button variant="outline" className="mb-4 sm:mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tiếp tục mua sắm
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <CardTitle className="text-lg sm:text-xl">Giỏ hàng ({state.itemCount} sản phẩm)</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start sm:self-auto"
                >
                  Xóa giỏ hàng
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4 sm:space-y-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      {/* Image and Product Info */}
                      <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.images[0] || "https://via.placeholder.com/100x100"}
                            alt={item.product?.name || "Sản phẩm"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {item.product?.name || "Sản phẩm không xác định"}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Mã SP: {item.productId}
                          </p>
                          <p className="text-base sm:text-lg font-medium text-gray-900 mt-1 sm:mt-2">
                            {item.product?.price || "0"}.000₫
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls and Actions */}
                      <div className="flex items-center justify-between sm:justify-end space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="font-medium w-8 sm:w-10 text-center text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {((parseFloat(item.product?.price || "0")) * item.quantity).toLocaleString('vi-VN')}.000₫
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1 sm:mt-2 text-xs sm:text-sm h-7 sm:h-8"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString('vi-VN')}.000₫</span>
                </div>
                
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${shipping.toLocaleString('vi-VN')}₫`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Thuế VAT:</span>
                  <span>{(tax * 1000).toLocaleString('vi-VN')}₫</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{(total * 1000).toLocaleString('vi-VN')}₫</span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    Miễn phí vận chuyển cho đơn hàng trên 100.000₫
                  </p>
                )}

                <Button className="w-full mt-4 sm:mt-6" size="lg">
                  Tiến hành thanh toán
                </Button>

                <div className="text-center">
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>

                {/* Security Badges */}
                <div className="pt-4 sm:pt-6 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 text-center mb-2 sm:mb-3">
                    Thanh toán an toàn
                  </p>
                  <div className="flex justify-center space-x-2 text-xs text-gray-500">
                    <span>🔒 Bảo mật SSL</span>
                    <span>•</span>
                    <span>💳 Hỗ trợ tất cả thẻ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
