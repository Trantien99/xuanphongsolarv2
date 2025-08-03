# Quick Setup Guide

## Hướng dẫn thiết lập nhanh MongoDB Backend

### 1. Cài đặt MongoDB

#### Option A: MongoDB Local
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS với Homebrew
brew install mongodb-community

# Windows
# Tải và cài đặt từ https://www.mongodb.com/try/download/community
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Đăng ký tài khoản miễn phí tại https://www.mongodb.com/atlas
2. Tạo cluster mới
3. Tạo database user
4. Lấy connection string

### 2. Cấu hình Environment

```bash
# Copy file cấu hình mẫu
cp .env.example .env

# Chỉnh sửa file .env
nano .env
```

**Cấu hình tối thiểu trong .env:**
```env
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/ecommerce
# Hoặc MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (PHẢI thay đổi!)
JWT_SECRET=your-super-secret-jwt-key-here

# Server port
PORT=5000
```

### 3. Khởi chạy

```bash
# Cài đặt dependencies (đã thực hiện)
npm install

# Khởi chạy development server
npm run dev
```

### 4. Kiểm tra hoạt động

Server sẽ chạy tại: http://localhost:5000

**Test endpoints:**
```bash
# Health check
curl http://localhost:5000/api/health

# Categories
curl http://localhost:5000/api/v1/categories

# Products  
curl http://localhost:5000/api/v1/products

# News
curl http://localhost:5000/api/v1/news
```

### 5. Tạo Admin User đầu tiên

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin123",
    "fullName": "System Administrator"
  }'
```

**Phản hồi sẽ chứa JWT token để sử dụng cho các API calls.**

### 6. Cập nhật role thành admin

Vào MongoDB và cập nhật role của user vừa tạo:

```javascript
// MongoDB shell hoặc MongoDB Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### 7. Test API với token

```bash
# Lấy token từ response đăng ký/đăng nhập
export TOKEN="your_jwt_token_here"

# Tạo category
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic products and devices"
  }'

# Tạo product
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "description": "This is a sample product",
    "sku": "SAMPLE-001",
    "price": 99.99,
    "stock": 10,
    "category": "category_id_from_above"
  }'
```

## 🎯 Các bước tiếp theo

1. **Thiết lập production environment** với HTTPS
2. **Cấu hình backup** cho MongoDB
3. **Setup monitoring** và logging
4. **Implement caching** với Redis (optional)
5. **Add file upload** functionality
6. **Setup CI/CD pipeline**

## 📞 Hỗ trợ

- Xem file `API_README.md` để biết chi tiết về tất cả endpoints
- Kiểm tra server logs nếu có lỗi
- Đảm bảo MongoDB đang chạy và có thể kết nối
- Verify port 5000 không bị block

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB:
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Giải pháp:** Khởi chạy MongoDB service

### Lỗi JWT:
```
Error: Invalid token
```
**Giải pháp:** Kiểm tra JWT_SECRET trong .env

### Port đã được sử dụng:
```
Error: listen EADDRINUSE :::5000
```
**Giải pháp:** Thay đổi PORT trong .env hoặc kill process đang dùng port 5000