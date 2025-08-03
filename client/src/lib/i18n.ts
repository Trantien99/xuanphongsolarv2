export const translations = {
  vi: {
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
    home: "Trang chủ",
    products: "Sản phẩm",
    news: "Tin tức",
    about: "Giới thiệu",
    contact: "Liên hệ",
    cart: "Giỏ hàng",
    account: "Tài khoản",
    
    // Product Detail
    productDetail: "Chi tiết sản phẩm",
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