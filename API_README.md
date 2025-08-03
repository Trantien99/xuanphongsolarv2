# MongoDB Backend API Documentation

Đây là hệ thống backend REST API với MongoDB được xây dựng bằng Node.js, Express, TypeScript và Mongoose. Hệ thống cung cấp đầy đủ các chức năng CRUD cho sản phẩm, tin tức, danh mục và quản lý người dùng.

## 🚀 Tính năng chính

- **Xác thực và phân quyền**: JWT tokens, role-based access control (admin, editor, user)
- **Quản lý sản phẩm**: CRUD, tìm kiếm, lọc, quản lý kho
- **Quản lý tin tức**: CRUD, publish/draft, featured articles
- **Quản lý danh mục**: Hierarchical categories, SEO optimization
- **Bảo mật**: Rate limiting, CORS, Helmet, input validation
- **Validation**: Comprehensive input validation với Zod
- **Pagination**: Phân trang cho tất cả các endpoints
- **Search**: Full-text search across products and news

## 🛠 Công nghệ sử dụng

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, Express Rate Limit
- **Password Hashing**: bcryptjs

## 📦 Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình môi trường**
```bash
cp .env.example .env
# Chỉnh sửa file .env theo cấu hình của bạn
```

4. **Khởi chạy MongoDB**
```bash
# Local MongoDB
mongod

# Hoặc sử dụng MongoDB Atlas (cloud)
# Cập nhật MONGODB_URI trong .env
```

5. **Khởi chạy server**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔧 Cấu hình môi trường

Xem file `.env.example` để biết tất cả các biến môi trường có thể cấu hình.

### Cấu hình quan trọng:

- `MONGODB_URI`: Connection string cho MongoDB
- `JWT_SECRET`: Secret key cho JWT tokens (đổi trong production!)
- `CORS_ORIGIN`: Domains được phép truy cập API
- `NODE_ENV`: development/production

## 📚 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### 🔐 Authentication Routes

#### Đăng ký
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890"
}
```

#### Đăng nhập
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Lấy thông tin profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <jwt_token>
```

#### Cập nhật profile
```http
PUT /api/v1/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "phoneNumber": "+1234567890",
  "address": "123 Main St"
}
```

### 📂 Category Routes

#### Lấy danh sách categories
```http
GET /api/v1/categories?page=1&limit=10&search=technology
```

#### Lấy category tree (hierarchical)
```http
GET /api/v1/categories/tree
```

#### Lấy category theo slug
```http
GET /api/v1/categories/slug/technology
```

#### Tạo category mới (Admin/Editor only)
```http
POST /api/v1/categories
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Technology",
  "description": "Technology related content",
  "parentCategory": "parent_category_id",
  "metaTitle": "Technology Category",
  "metaDescription": "All about technology"
}
```

### 🛍 Product Routes

#### Lấy danh sách sản phẩm
```http
GET /api/v1/products?page=1&limit=10&category=category_id&minPrice=100&maxPrice=1000&sort=-createdAt
```

#### Tìm kiếm sản phẩm
```http
GET /api/v1/products/search?q=laptop&page=1&limit=10
```

#### Lấy sản phẩm nổi bật
```http
GET /api/v1/products/featured?limit=5
```

#### Lấy sản phẩm theo slug
```http
GET /api/v1/products/slug/macbook-pro-2023
```

#### Tạo sản phẩm mới (Admin/Editor only)
```http
POST /api/v1/products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "MacBook Pro 2023",
  "description": "Latest MacBook Pro with M3 chip",
  "sku": "MBP-2023-001",
  "price": 1999.99,
  "salePrice": 1799.99,
  "stock": 50,
  "category": "category_id",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt": "MacBook Pro front view",
      "isPrimary": true
    }
  ],
  "tags": ["laptop", "apple", "macbook"],
  "isActive": true,
  "isFeatured": true
}
```

#### Cập nhật stock
```http
PATCH /api/v1/products/:id/stock
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "stock": 25,
  "minStock": 5
}
```

### 📰 News Routes

#### Lấy danh sách tin tức
```http
GET /api/v1/news?page=1&limit=10&category=category_id&status=published&isFeatured=true
```

#### Tìm kiếm tin tức
```http
GET /api/v1/news/search?q=technology&page=1&limit=10
```

#### Lấy tin tức nổi bật
```http
GET /api/v1/news/featured?limit=5
```

#### Lấy tin tức theo slug
```http
GET /api/v1/news/slug/latest-tech-trends
```

#### Tạo tin tức mới (Admin/Editor only)
```http
POST /api/v1/news
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Latest Technology Trends",
  "summary": "Exploring the newest trends in technology",
  "content": "Full article content here...",
  "featuredImage": {
    "url": "https://example.com/featured.jpg",
    "alt": "Technology trends"
  },
  "category": "category_id",
  "tags": ["technology", "trends", "innovation"],
  "status": "published",
  "isFeatured": true
}
```

#### Publish tin tức
```http
PATCH /api/v1/news/:id/publish
Authorization: Bearer <jwt_token>
```

#### Tương tác với tin tức (like/share)
```http
POST /api/v1/news/:id/interact
Content-Type: application/json

{
  "action": "like"
}
```

## 🔒 Phân quyền

### Roles:
- **user**: Người dùng thông thường
- **editor**: Có thể tạo/chỉnh sửa content
- **admin**: Quyền quản trị đầy đủ

### Permissions:
- **Public**: Xem sản phẩm, tin tức, categories
- **Authenticated**: Cập nhật profile, xem draft content của mình
- **Editor**: Tạo/sửa content, quản lý categories
- **Admin**: Toàn quyền, quản lý users

## 📊 Response Format

Tất cả responses đều có format nhất quán:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": {}, // Response data
  "error": "Error message if any"
}
```

### Pagination Response:
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10
    }
  }
}
```

## 🛡 Security Features

- **Rate Limiting**: Giới hạn requests per IP
- **CORS**: Cấu hình cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation
- **Password Hashing**: bcrypt với salt rounds
- **JWT Tokens**: Secure authentication
- **Role-based Access**: Fine-grained permissions

## 🔍 Query Parameters

### Pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Filtering:
- `search`: Full-text search
- `category`: Filter by category ID
- `status`: Filter by status
- `isActive`: Filter active/inactive items
- `isFeatured`: Filter featured items

### Sorting:
- `sort`: Sort field (prefix with `-` for descending)
- Examples: `sort=createdAt`, `sort=-price`, `sort=name,createdAt`

## 🚨 Error Handling

### HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

### Error Response Example:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🧪 Testing

### Health Check:
```http
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 📝 Best Practices

1. **Always include Authorization header** cho protected routes
2. **Use HTTPS** trong production
3. **Validate input** ở client side trước khi gửi
4. **Handle errors gracefully** 
5. **Use pagination** cho large datasets
6. **Cache responses** khi có thể
7. **Monitor API usage** và performance

## 🔄 Database Schema

### User:
- username, email, password (hashed)
- role (admin/editor/user)
- profile info (fullName, phone, address)
- timestamps

### Category:
- name, slug, description
- parentCategory (hierarchical)
- SEO fields (metaTitle, metaDescription)
- sorting and status

### Product:
- basic info (name, description, sku)
- pricing (price, salePrice, cost)
- inventory (stock, minStock)
- media (images, variants)
- categorization and SEO
- statistics (views, rating)

### News:
- content (title, summary, content)
- media (featuredImage, gallery)
- publishing (status, publishedAt)
- engagement (views, likes, shares)
- SEO and categorization

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng tạo issue trên GitHub repository.