import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/components/cart/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useTitle } from "@/hooks/use-title";
import { t } from "@/lib/i18n";
import { AppUtils } from "@/utils/AppUtils";
import App from "@/App";

interface CheckoutForm {
  // Shipping Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Payment Information
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  
  // Additional
  notes: string;
}

export default function Checkout() {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Set dynamic title
  useTitle("pageTitle.checkout");
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Vietnam",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    notes: ""
  });

  const subtotal = state.total;
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = subtotal * 0.0875;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'cardNumber', 'expiryDate', 'cvv', 'cardName'];
    return required.every(field => formData[field as keyof CheckoutForm].trim() !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: t("error"),
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t("toastMessages.orderSuccess"),
        description: "Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
      });
      
      clearCart();
      navigate("/");
    } catch (error) {
      toast({
        title: t("error"),
        description: "Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if cart is empty
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center py-12 sm:py-16">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
            <p className="text-lg text-gray-600 mb-8">
              Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.
            </p>
            <Link to="/products">
              <Button size="lg">
                Tiếp tục mua sắm
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
        <Link to="/cart">
          <Button variant="outline" className="mb-4 sm:mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại giỏ hàng
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Họ *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Nhập họ"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Tên *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Nhập tên"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0123456789"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Thành phố *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Hồ Chí Minh"
                        required
                      />
                    </div>
                    {/* <div>
                      <Label htmlFor="zipCode">Mã bưu điện *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="70000"
                        required
                      />
                    </div> */}
                  </div>
                  
                  {/* <div>
                    <Label htmlFor="country">Quốc gia</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vietnam">Việt Nam</SelectItem>
                        <SelectItem value="Thailand">Thái Lan</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                        <SelectItem value="Malaysia">Malaysia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </CardContent>
              </Card>

              {/* Payment Information */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Tên chủ thẻ *</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Số thẻ *</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        // Format card number with spaces
                        const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                        if (value.replace(/\s/g, '').length <= 16) {
                          handleInputChange('cardNumber', value);
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          // Format MM/YY
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            const formatted = value.substring(0, 2) + '/' + value.substring(2, 4);
                            handleInputChange('expiryDate', formatted);
                          } else {
                            handleInputChange('expiryDate', value);
                          }
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 3) {
                            handleInputChange('cvv', value);
                          }
                        }}
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Ghi chú thêm</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Ghi chú về đơn hàng (tùy chọn)"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.avatar || "https://via.placeholder.com/100x100"}
                          alt={item.product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {AppUtils.calculateDiscountString(item.product?.price || 0, item.product?.discount?.value || 0, item.product?.discount?.type || '')}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{AppUtils.formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Thuế:</span>
                    <span>{AppUtils.formatCurrency(tax)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span>{AppUtils.formatCurrency(total)}</span>
                  </div>
                </div>
{/* 
                {shipping > 0 && (
                  <p className="text-xs text-gray-600">
                    Miễn phí vận chuyển cho đơn hàng trên $100
                  </p>
                )} */}

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Xác nhận đặt hàng
                    </>
                  )}
                </Button>

                {/* Security Badges */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center mb-2">
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