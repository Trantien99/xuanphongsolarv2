# Tính năng localStorage cho Giỏ hàng

## Mô tả
Tính năng này cho phép lưu trữ giỏ hàng vào localStorage của trình duyệt, giúp người dùng không bị mất dữ liệu giỏ hàng khi tải lại trang hoặc tạm thời mất kết nối internet.

## Các tính năng chính

### 1. **Lưu trữ tự động**
- Giỏ hàng được tự động lưu vào localStorage mỗi khi có thay đổi
- Dữ liệu bao gồm: danh sách sản phẩm, số lượng, tổng tiền
- Có timestamp để tracking thời gian cập nhật

### 2. **Tải lại tự động**
- Khi truy cập lại trang web, giỏ hàng sẽ được tự động khôi phục từ localStorage
- Đồng bộ với server khi có kết nối internet

### 3. **Hoạt động offline**
- Có thể thêm/sửa/xóa sản phẩm trong giỏ hàng khi offline
- Dữ liệu sẽ được đồng bộ với server khi có kết nối trở lại

### 4. **Đồng bộ thông minh**
- Tự động phát hiện khi có kết nối internet trở lại
- Đồng bộ dữ liệu từ localStorage lên server
- Tránh trùng lặp dữ liệu

## Cấu trúc dữ liệu localStorage

```json
{
  "items": [
    {
      "id": "item_1234567890",
      "sessionId": "session-id",
      "productId": "product-123",
      "quantity": 2,
      "product": {
        "id": "product-123",
        "name": "Tên sản phẩm",
        "price": "100000",
        "images": ["image-url"]
      }
    }
  ],
  "itemCount": 2,
  "total": 200000,
  "timestamp": 1641234567890
}
```

## Các file đã thay đổi

### 1. `client/src/hooks/use-cart-storage.ts` (Mới)
Hook custom để quản lý localStorage:
- `saveCartToStorage()`: Lưu giỏ hàng vào localStorage
- `loadCartFromStorage()`: Load giỏ hàng từ localStorage
- `clearCartStorage()`: Xóa dữ liệu localStorage
- `hasStoredCart()`: Kiểm tra có dữ liệu hay không

### 2. `client/src/components/cart/cart-context.tsx` (Cập nhật)
Tích hợp localStorage vào cart context:
- Tự động load từ localStorage khi khởi tạo
- Lưu vào localStorage mỗi khi state thay đổi
- Đồng bộ với server khi online
- Xử lý offline mode

## Cách hoạt động

### Khi online:
1. Thao tác trên giỏ hàng → Gọi API → Cập nhật localStorage
2. Khi tải trang → Load từ localStorage → Đồng bộ với server

### Khi offline:
1. Thao tác trên giỏ hàng → Chỉ cập nhật localStorage
2. Khi có internet → Đồng bộ localStorage lên server

### Event listeners:
- Lắng nghe event `online` để tự động đồng bộ khi có kết nối trở lại

## Cách test

### 1. Test cơ bản:
1. Thêm sản phẩm vào giỏ hàng
2. Tải lại trang → Kiểm tra giỏ hàng vẫn còn
3. Xóa cache/localStorage → Giỏ hàng sẽ trống

### 2. Test offline:
1. Tắt internet
2. Thêm sản phẩm vào giỏ hàng → Sẽ hiển thị "(offline)"
3. Bật internet → Dữ liệu sẽ được đồng bộ

### 3. Test với file demo:
Mở file `test-localStorage.html` trong trình duyệt để test các chức năng localStorage.

## Lưu ý kỹ thuật

### 1. **Error handling**
- Bọc tất cả localStorage operations trong try-catch
- Fallback về memory state nếu localStorage fail

### 2. **Performance**
- Chỉ đồng bộ khi cần thiết
- Có timeout để tránh spam requests

### 3. **Data validation**
- Kiểm tra cấu trúc dữ liệu trước khi sử dụng
- Type safety với TypeScript

### 4. **Session management**
- Sử dụng sessionId để phân biệt các session khác nhau
- Tự động tạo sessionId nếu chưa có

## Cài đặt và sử dụng

Tính năng đã được tích hợp sẵn vào ứng dụng. Không cần cài đặt thêm gì.

### Để tắt localStorage (nếu cần):
Có thể comment out các useEffect trong `cart-context.tsx` liên quan đến localStorage.

### Để thay đổi key localStorage:
Sửa `CART_STORAGE_KEY` trong `use-cart-storage.ts`.

## Browser support
- Tất cả browser hiện đại hỗ trợ localStorage
- Graceful degradation cho browser cũ (sẽ hoạt động như trước, không có persistent storage)

## Bảo mật
- Dữ liệu chỉ lưu ở local, không gửi thông tin nhạy cảm
- Tự động xóa khi user clear browser data
- Không lưu thông tin thanh toán hoặc cá nhân