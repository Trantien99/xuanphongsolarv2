export interface Translations {
  [key: string]: string | Translations;
}

export const translations: Translations = {

  vi: {
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
      sku: "Mã sản phẩm",
      writeReview: "Viết đánh giá"
    },
    // Common
    loading: "Đang tải...",
    error: "Lỗi",
    success: "Thành công",
    cancel: "Hủy",
    save: "Lưu",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    search: "Tìm kiếm",
    filter: "Lọc",
    sort: "Sắp xếp",
    viewAll: "Xem tất cả",
    backToProducts: "Quay lại sản phẩm",

    // Navigation
    // home: "Trang chủ",
    // products: "Sản phẩm",
    // news: "Tin tức",
    about: "Giới thiệu",
    contact: "Liên hệ",
    // cart: "Giỏ hàng",
    account: "Tài khoản",

    // Product Detail
    // productDetail: "Chi tiết sản phẩm",
    productNotFound: "Không tìm thấy sản phẩm",
    productImages: "Hình ảnh sản phẩm",
    noImages: "Chưa có hình ảnh",
    specifications: "Thông số kỹ thuật",
    features: "Tính năng",
    reviews: "Đánh giá",
    relatedProducts: "Sản phẩm liên quan",
    addToCart: "Thêm vào giỏ",
    buyNow: "Mua ngay",
    inStock: "Còn hàng",
    outOfStock: "Hết hàng",
    stockAvailable: "có sẵn",
    quantity: "Số lượng",
    price: "Giá",
    originalPrice: "Giá gốc",
    discount: "Giảm giá",
    brand: "Thương hiệu",
    category: "Danh mục",
    sku: "Mã sản phẩm",
    rating: "Đánh giá",
    reviewCount: "đánh giá",
    writeReview: "Viết đánh giá",
    featured: "Nổi bật",
    share: "Chia sẻ",
    favorite: "Yêu thích",

    // Image Gallery
    imageCounter: "{current} / {total}",
    previousImage: "Hình trước",
    nextImage: "Hình tiếp theo",
    thumbnail: "Thu nhỏ",

    // Consultation
    consultationTitle: "Đăng ký tư vấn miễn phí",
    consultationSubtitle: "Để lại thông tin, chúng tôi sẽ tư vấn cho bạn về giải pháp năng lượng mặt trời phù hợp nhất",
    consultationButton: "Tư vấn miễn phí",
    consultationCategory: "Danh mục cần tư vấn",
    consultationName: "Họ và tên",
    consultationPhone: "Số điện thoại",
    consultationEmail: "Email",
    consultationContent: "Nội dung cần tư vấn",
    consultationPlaceholder: "Mô tả chi tiết về nhu cầu và câu hỏi của bạn...",
    sendRequest: "Gửi yêu cầu",
    sending: "Đang gửi...",
    consultationSuccess: "Yêu cầu tư vấn của bạn đã được gửi. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
    consultationError: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    privacyPolicy: "chính sách bảo mật",
    privacyText: "Bằng cách gửi form, bạn đồng ý với",

    // Consultation Categories
    consultationCategories: {
      "solar-panels": "Tấm pin năng lượng mặt trời",
      "inverters": "Bộ nghịch lưu",
      "batteries": "Pin lưu trữ",
      "installation": "Tư vấn lắp đặt",
      "maintenance": "Bảo trì hệ thống",
      "financing": "Tài chính và vay vốn",
      "others": "Khác",
    },

    // Form Validation
    validation: {
      required: "Trường này là bắt buộc",
      email: "Email không hợp lệ",
      phone: "Số điện thoại không hợp lệ",
      selectCategory: "Vui lòng chọn danh mục cần tư vấn",
      enterName: "Vui lòng nhập họ tên",
      enterPhone: "Vui lòng nhập số điện thoại",
      enterEmail: "Vui lòng nhập email",
      enterContent: "Vui lòng nhập nội dung cần tư vấn",
    },

    // Breadcrumb
    breadcrumb: {
      home: "Trang chủ",
      products: "Sản phẩm",
      news: "Tin tức",
      cart: "Giỏ hàng",
      checkout: "Thanh toán",
    },

    // Product States
    productStates: {
      new: "Mới",
      hot: "Hot",
      sale: "Khuyến mãi",
      bestSeller: "Bán chạy",
    },

    // Currency
    currency: "₫",

    // Time
    timeAgo: {
      justNow: "Vừa xong",
      minutesAgo: "{minutes} phút trước",
      hoursAgo: "{hours} giờ trước",
      daysAgo: "{days} ngày trước",
      monthsAgo: "{months} tháng trước",
      yearsAgo: "{years} năm trước",
    },
  }
};

// Hook for using translations in components
export function useTranslation() {
  return { t };
}

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.vi;

let currentLanguage: Language = 'vi';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

export const getCurrentLanguage = (): Language => {
  return currentLanguage;
};

export const t = (key: string, replacements?: Record<string, string | number>): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }

  if (replacements) {
    return value.replace(/\{(\w+)\}/g, (match, placeholder) => {
      return replacements[placeholder]?.toString() || match;
    });
  }

  return value;
};

// Helper function for pluralization (if needed in the future)
export const plural = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};

// Format currency
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseInt(amount) : amount;
  return `${num.toLocaleString('vi-VN')}${t('currency')}`;
};

// Format time ago
export const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return t('timeAgo.justNow');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return t('timeAgo.minutesAgo', { minutes: diffInMinutes });
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return t('timeAgo.hoursAgo', { hours: diffInHours });
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return t('timeAgo.daysAgo', { days: diffInDays });
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return t('timeAgo.monthsAgo', { months: diffInMonths });
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return t('timeAgo.yearsAgo', { years: diffInYears });
};