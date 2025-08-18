import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-context";
import { useTranslation } from "@/lib/i18n";
import { useTitle } from "@/hooks/use-title";
import { useMeta } from "@/components/seo/meta-manager";
import { AppUtils } from "@/utils/AppUtils";

export default function Cart() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useTranslation();
  
  // Set dynamic title
  useTitle("pageTitle.cart");

  // Dynamic SEO meta tags for cart page
  useMeta({
    title: `Giỏ hàng (${state.items.length} sản phẩm) | Xuân Phong Solar`,
    description: "Xem lại các sản phẩm trong giỏ hàng của bạn. Cập nhật số lượng, xóa sản phẩm hoặc tiến hành thanh toán tại Xuân Phong Solar.",
    keywords: "giỏ hàng, mua sắm, thanh toán, sản phẩm công nghiệp",
    ogTitle: `Giỏ hàng - ${state.items.length} sản phẩm`,
    ogDescription: "Xem lại các sản phẩm trong giỏ hàng và tiến hành thanh toán.",
    ogImage: "https://xuanphongsolar.com/og-cart.jpg",
    ogUrl: window.location.href,
    canonical: window.location.href
  });

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
  const tax = subtotal * 0.1; // 8.75% tax rate
  const total = subtotal + shipping + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Link to="/products">
            <Button variant="outline" className="mb-4 sm:mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('nav.products')}
            </Button>
          </Link>

          <div className="text-center py-12 sm:py-16">
            <ShoppingCart className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{t('cart.emptyCart')}</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
              {t('cart.emptyCartDesc')}
            </p>
            <Link to="/products">
              <Button size="lg">
                {t('cart.continueShopping')}
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
        <Link to="/products">
          <Button variant="outline" className="mb-4 sm:mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('cart.continueShopping')}
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <CardTitle className="text-lg sm:text-xl">{t('cart.pageTitle')} ({state.itemCount} {t('home.items')})</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start sm:self-auto"
                >
                  {t('common.delete')} {t('cart.pageTitle')}
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4 sm:space-y-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      {/* Image and Product Info */}
                      <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.avatar || "https://via.placeholder.com/100x100"}
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {item.product?.name || "Unknown Product"}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {t('productDetail.sku')}: {item.productId}
                          </p>
                          <div className="mt-1 sm:mt-2">
                            {item.product ? (
                              <>
                                {item.product.discount && item.product.discount.value > 0 ? (
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-500 line-through">
                                      {AppUtils.formatCurrency(item.product.price)}
                                    </p>
                                    <p className="text-base sm:text-lg font-medium text-green-600">
                                      {AppUtils.calculateDiscountString(
                                        item.product.price,
                                        item.product.discount.value,
                                        item.product.discount.type
                                      )}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-base sm:text-lg font-medium text-gray-900">
                                    {AppUtils.formatCurrency(item.product.price)}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-base sm:text-lg font-medium text-gray-900">
                                Liên hệ
                              </p>
                            )}
                          </div>
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
                          {item.product ? (
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                              {(() => {
                                const price = item.product.price || 0;
                                const discount = item.product.discount;
                                let finalPrice = price;
                                
                                if (discount && discount.value > 0) {
                                  finalPrice = AppUtils.calculateDiscount(price, discount.value, discount.type);
                                }
                                
                                return AppUtils.formatCurrency(finalPrice * item.quantity);
                              })()}
                            </p>
                          ) : (
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                              Liên hệ
                            </p>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1 sm:mt-2 text-xs sm:text-sm h-7 sm:h-8"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {t('cart.removeItem')}
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
                <CardTitle className="text-lg sm:text-xl">{t('cart.total')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>{t('cart.subtotal')}:</span>
                  <span>{AppUtils.formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm sm:text-base">
                  <span>{t('cart.shipping')}:</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm sm:text-base">
                  <span>{t('cart.tax')}:</span>
                  <span>{AppUtils.formatCurrency(tax)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>{t('cart.grandTotal')}:</span>
                  <span>{AppUtils.formatCurrency(total)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    Miễn phí vận chuyển cho đơn hàng trên 15.000.000đ
                  </p>
                )}
                <Link to="/checkout">
                  <Button className="w-full mt-4 sm:mt-6" size="lg">
                    {t('cart.checkout')}
                  </Button>
                </Link>

                <div className="text-center">
                  <Link to="/products">
                    <Button variant="outline" className="w-full">
                      {t('cart.continueShopping')}
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
                    <span>💳 Chấp nhận mọi thẻ</span>
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
