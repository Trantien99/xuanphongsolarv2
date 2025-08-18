# Cart System Updates - ProductService Integration

## Tổng quan
Đã cập nhật hệ thống giỏ hàng để sử dụng `ProductService.getProductByIds` để truy vấn danh sách sản phẩm và tính toán giá cả theo công thức `AppUtils.calculateDiscount`.

## Files đã cập nhật

### 1. `client/src/components/cart/cart-context.tsx`
- **Import mới**: `AppUtils` và `Product` model
- **Interface CartItem**: Cập nhật để sử dụng `Product` model thay vì interface cũ
- **Tính toán giá cả**: Sử dụng `AppUtils.calculateDiscount` để tính giá sau khi áp dụng khuyến mãi
- **Product fetching**: Thêm query để fetch products bằng `ProductService.getProductByIds`
- **State management**: Cập nhật state khi products được fetch thành công

### 2. `client/src/hooks/use-cart-storage.ts`
- **Import mới**: `Product` model
- **Interface CartItem**: Cập nhật để sử dụng `Product` model
- **Type consistency**: Đảm bảo tính nhất quán về type với cart-context

### 3. `client/src/pages/cart.tsx`
- **Import mới**: `AppUtils`
- **Hiển thị giá cả**: 
  - Hiển thị giá gốc (gạch ngang) và giá sau khuyến mãi
  - Sử dụng `AppUtils.calculateDiscountString` để format giá
  - Tính tổng tiền theo số lượng với giá đã áp dụng khuyến mãi
- **Image handling**: Sử dụng `imageUrls[0]` hoặc `avatar` từ Product model

### 4. `client/src/components/cart/cart-sidebar.tsx`
- **Hiển thị giá cả**: Tương tự như cart.tsx
- **Tính toán tổng tiền**: Sử dụng `AppUtils.calculateDiscount` để tính giá cuối cùng
- **Image handling**: Sử dụng `imageUrls[0]` hoặc `avatar` từ Product model

## Tính năng mới

### 1. Tự động fetch products
- Khi có items trong giỏ hàng, hệ thống tự động fetch thông tin products
- Sử dụng `ProductService.getProductByIds` để lấy dữ liệu batch
- Cập nhật cart items với thông tin products đầy đủ

### 2. Tính toán khuyến mãi
- Hỗ trợ cả khuyến mãi theo phần trăm và theo số tiền cố định
- Sử dụng `AppUtils.calculateDiscount` để tính giá sau khuyến mãi
- Hiển thị giá gốc (gạch ngang) và giá khuyến mãi

### 3. Format tiền tệ
- Sử dụng `AppUtils.formatCurrency` để format giá tiền theo định dạng Việt Nam
- Hiển thị "Liên hệ" khi không có thông tin giá

## Cấu trúc dữ liệu

### Product Model
```typescript
class Product {
  id: string;
  name: string;
  price: number;
  discount: {
    value: number;
    type: string; // 'percent' hoặc 'fixed'
    code: string;
  } | null;
  imageUrls: string[];
  avatar: string;
  // ... other properties
}
```

### CartItem Interface
```typescript
interface CartItem {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  product: Product | null;
}
```

## Cách hoạt động

1. **Khởi tạo**: Cart context load items từ localStorage/server
2. **Fetch products**: Tự động fetch thông tin products cho tất cả items
3. **Cập nhật state**: Merge product data vào cart items
4. **Tính toán giá**: Sử dụng `AppUtils.calculateDiscount` để tính giá cuối cùng
5. **Hiển thị**: Render giá gốc, giá khuyến mãi và tổng tiền

## Lợi ích

- **Performance**: Fetch products theo batch thay vì từng item một
- **Consistency**: Sử dụng Product model nhất quán trong toàn bộ hệ thống
- **Flexibility**: Hỗ trợ nhiều loại khuyến mãi
- **User Experience**: Hiển thị giá khuyến mãi rõ ràng
- **Maintainability**: Code dễ bảo trì và mở rộng

## Lưu ý

- Đảm bảo Product model có đầy đủ các properties cần thiết
- `AppUtils.calculateDiscount` xử lý cả khuyến mãi theo % và theo số tiền
- Hệ thống fallback về "Liên hệ" khi không có thông tin giá
- Images được ưu tiên sử dụng `imageUrls[0]`, fallback về `avatar`
