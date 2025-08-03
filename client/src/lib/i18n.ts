// Simple i18n utility for Vietnamese translations
export interface Translations {
  [key: string]: string | Translations;
}

export const translations: Translations = {
  // Navigation
  nav: {
    home: "Trang chủ",
    products: "Sản phẩm",
    news: "Tin tức",
    cart: "Giỏ hàng",
    visualSearch: "Tìm kiếm hình ảnh",
    searchPlaceholder: "Tìm kiếm sản phẩm...",
    allCategories: "Tất cả danh mục",
  },
  
  // Categories
  categories: {
    powerTools: "Công cụ điện",
    safetyEquipment: "Thiết bị an toàn",
    solarEnergy: "Năng lượng mặt trời",
    machinery: "Máy móc",
    electronics: "Thiết bị điện tử",
    materials: "Vật liệu",
    handTools: "Công cụ cầm tay",
  },
  
  // Home page
  home: {
    heroTitle: "Tìm sản phẩm nhanh hơn với tìm kiếm hình ảnh",
    heroSubtitle: "Tải lên một bức ảnh hoặc bản phác thảo về những gì bạn cần. Tìm kiếm hình ảnh được hỗ trợ bởi AI của chúng tôi tìm ra các kết quả khớp chính xác từ hàng nghìn sản phẩm công nghiệp.",
    tryVisualSearch: "Thử tìm kiếm hình ảnh",
    browseCatalog: "Duyệt danh mục",
    shopByCategory: "Mua sắm theo danh mục",
    shopByCategoryDesc: "Tìm chính xác những gì bạn cần từ các danh mục sản phẩm toàn diện của chúng tôi",
    featuredProducts: "Sản phẩm nổi bật",
    featuredProductsDesc: "Sản phẩm được đánh giá cao nhất được tin tưởng bởi các chuyên gia ngành",
    viewAllProducts: "Xem tất cả sản phẩm",
    industryNews: "Tin tức ngành",
    industryNewsDesc: "Cập nhật những xu hướng mới nhất trong ngành và cập nhật sản phẩm",
    viewAllNews: "Xem tất cả tin tức",
    items: "mặt hàng",
  },
  
  // Footer
  footer: {
    companyDesc: "Đối tác đáng tin cậy của bạn cho các công cụ và thiết bị chuyên nghiệp. Phục vụ các chuyên gia ngành từ năm 2015.",
    products: "Sản phẩm",
    support: "Hỗ trợ",
    company: "Công ty",
    helpCenter: "Trung tâm trợ giúp",
    contactUs: "Liên hệ chúng tôi",
    returnPolicy: "Chính sách đổi trả",
    warranty: "Bảo hành",
    aboutUs: "Về chúng tôi",
    careers: "Nghề nghiệp",
    privacyPolicy: "Chính sách bảo mật",
    termsOfService: "Điều khoản dịch vụ",
    allRightsReserved: "Tất cả quyền được bảo lưu.",
  },
  
  // Common
  common: {
    loading: "Đang tải...",
    error: "Lỗi",
    success: "Thành công",
    cancel: "Hủy",
    save: "Lưu",
    delete: "Xóa",
    edit: "Chỉnh sửa",
    add: "Thêm",
    remove: "Xóa bỏ",
    search: "Tìm kiếm",
    filter: "Lọc",
    sort: "Sắp xếp",
    close: "Đóng",
    open: "Mở",
  },
  
  // Meta tags and SEO
  meta: {
    title: "IndustrialSource - Khám phá sản phẩm trực quan cho các chuyên gia ngành",
    description: "Tìm sản phẩm công nghiệp nhanh hơn với tìm kiếm hình ảnh. Nền tảng thương mại điện tử chuyên nghiệp cho các chuyên gia ngành với công cụ khám phá sản phẩm tiên tiến, công cụ điện, thiết bị an toàn và máy móc.",
    keywords: "sản phẩm công nghiệp, tìm kiếm hình ảnh, thị trường B2B, công cụ chuyên nghiệp, tìm nguồn cung thiết bị, công cụ điện, thiết bị an toàn, máy móc, thiết bị điện tử, vật liệu xây dựng",
    author: "IndustrialSource",
    ogTitle: "IndustrialSource - Khám phá sản phẩm trực quan cho các chuyên gia ngành",
    ogDescription: "Tìm sản phẩm công nghiệp nhanh hơn với tìm kiếm hình ảnh. Nền tảng thương mại điện tử chuyên nghiệp cho các chuyên gia ngành với công cụ khám phá sản phẩm tiên tiến.",
  },

  // Products page
  products: {
    pageTitle: "Sản phẩm",
    filters: "Bộ lọc",
    sortBy: "Sắp xếp theo",
    sortOptions: {
      popular: "Phổ biến",
      priceAsc: "Giá thấp đến cao", 
      priceDesc: "Giá cao đến thấp",
      rating: "Đánh giá",
      newest: "Mới nhất"
    },
    viewMode: {
      grid: "Dạng lưới",
      list: "Dạng danh sách"
    },
    filterByCategory: "Lọc theo danh mục",
    filterByBrand: "Lọc theo thương hiệu",
    filterByPrice: "Lọc theo giá",
    priceRanges: {
      under100: "Dưới 100.000đ",
      "100-500": "100.000đ - 500.000đ", 
      "500-1000": "500.000đ - 1.000.000đ",
      over1000: "Trên 1.000.000đ"
    },
    noResults: "Không tìm thấy sản phẩm nào",
    resultsFound: "sản phẩm được tìm thấy",
    clearFilters: "Xóa bộ lọc",
    applyFilters: "Áp dụng bộ lọc"
  },

  // Cart page
  cart: {
    pageTitle: "Giỏ hàng",
    emptyCart: "Giỏ hàng trống",
    emptyCartDesc: "Bạn chưa thêm sản phẩm nào vào giỏ hàng",
    continueShopping: "Tiếp tục mua sắm",
    quantity: "Số lượng",
    price: "Giá",
    total: "Tổng cộng",
    subtotal: "Tạm tính",
    shipping: "Phí vận chuyển",
    tax: "Thuế",
    grandTotal: "Tổng tiền",
    checkout: "Thanh toán",
    removeItem: "Xóa sản phẩm",
    updateQuantity: "Cập nhật số lượng"
  },

  // 404 page
  notFound: {
    title: "404 Trang không tìm thấy",
    description: "Bạn có quên thêm trang vào router không?",
    goHome: "Về trang chủ"
  },

  // News page
  news: {
    pageTitle: "Tin tức",
    latestNews: "Tin tức mới nhất",
    readMore: "Đọc thêm",
    author: "Tác giả",
    publishedOn: "Xuất bản ngày",
    relatedArticles: "Bài viết liên quan",
    searchNews: "Tìm kiếm tin tức...",
    noNews: "Không có tin tức nào",
    loadMore: "Tải thêm"
  },

  // Product details
  productDetail: {
    addToCart: "Thêm vào giỏ hàng",
    buyNow: "Mua ngay",
    description: "Mô tả",
    specifications: "Thông số kỹ thuật",
    reviews: "Đánh giá",
    relatedProducts: "Sản phẩm liên quan",
    inStock: "Còn hàng",
    outOfStock: "Hết hàng",
    sku: "Mã sản phẩm",
    brand: "Thương hiệu",
    category: "Danh mục",
    rating: "Đánh giá",
    writeReview: "Viết đánh giá"
  }
};

// Simple translation function
export function t(key: string): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Hook for using translations in components
export function useTranslation() {
  return { t };
}